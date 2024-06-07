import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { verify_jwt } from '../utils/user';

const router = Router();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { inventory_data } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        let index = parseInt(await redisClient.get(`inventory_data_index`)) || 0;

        for (const item of inventory_data) {
            const englishItem = {
                manufacturer: item.Produsent || item.manufacturer,
                description: item.Beskrivelse || item.description,
                specifications: item.Spesifikasjoner || item.specifications,
                purchaseDate: item.Innkjøpsdato || item.purchaseDate,
                purchasePrice: item.Innkjøpspris || item.purchasePrice,
                expectedLifetime: item['Forventet levetid (i år)'] || item.expectedLifetime,
                category: item.Kategori || item.category,
                id: item.id || index,
                loanedBy: item.loanedBy || null
            };

            await redisClient.set(`inventory:${index}`, JSON.stringify(englishItem));
            index++;
        }

        await redisClient.set(`inventory_data_index`, index.toString());

        res.status(200).json({ message: 'Inventory uploaded successfully' });
    } catch(err) {
        next(err);
    }
});

router.post('/remove', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { item_ids } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        for (const id of item_ids) {
            await redisClient.del(`inventory:${id}`);
        }

        res.status(200).json({ message: 'Items removed successfully' });
    } catch(err) {
        next(err);
    }
});

router.get('/get', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let index = parseInt(await redisClient.get(`inventory_data_index`)) || 0;
        let inventory_data = [];

        for (let i = 0; i < index; i++) {
            let item = await redisClient.get(`inventory:${i}`);

            if (item !== null) {
                inventory_data.push(JSON.parse(item));
            }
        }

        res.status(200).json(inventory_data);
    } catch(err) {
        next(err);
    }
});

router.get('/getloaned', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let index = parseInt(await redisClient.get(`inventory_data_index`)) || 0;
        let inventory_data = {};

        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        for (let i = 0; i < index; i++) {
            const item = await redisClient.get(`inventory:${i}`);

            if (item === null) {
                continue;
            }

            const itemParsed = JSON.parse(item);

            if (itemParsed.loanedBy) {
                if (!inventory_data[itemParsed.loanedBy]) {
                    inventory_data[itemParsed.loanedBy] = [];
                }
                inventory_data[itemParsed.loanedBy].push(item);
            }
        }

        res.status(200).json(inventory_data);
    } catch(err) {
        next(err);
    }
});

router.post('/loan', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { item_ids, loaned_to } = req.body;

        for (const id of item_ids) {
            let item = JSON.parse(await redisClient.get(`inventory:${id}`));
            item.loanedBy = loaned_to;

            await redisClient.set(`inventory:${id}`, JSON.stringify(item));
        }

        res.status(200).json({ message: 'Items loaned successfully' });
    } catch(err) {
        next(err);
    }
});

router.post('/return', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { item_ids } = req.body;

        for (const id of item_ids) {
            let item = JSON.parse(await redisClient.get(`inventory:${id}`));
            item.loanedBy = null;

            await redisClient.set(`inventory:${id}`, JSON.stringify(item));
        }

        res.status(200).json({ message: 'Items returned successfully' });
    } catch(err) {
        next(err);
    }
});


export default router;

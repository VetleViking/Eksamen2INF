import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';

const router = Router();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { inventory_data } = req.body;

        let index = parseInt(await redisClient.get(`inventory_data_index`)) || 0;

        for (const item of inventory_data) {
            const englishItem = {
                manufacturer: item.Produsent,
                description: item.Beskrivelse,
                specifications: item.Spesifikasjoner,
                purchaseDate: item.Innkjøpsdato,
                purchasePrice: item.Innkjøpspris,
                expectedLifetime: item['Forventet levetid (i år)'],
                category: item.Kategori,
                id: item.id,
                loanedBy: item.loanedBy
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

router.get('/get', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let index = parseInt(await redisClient.get(`inventory_data_index`)) || 0;
        let inventory_data = [];

        for (let i = 0; i < index; i++) {
            let item = await redisClient.get(`inventory:${i}`);
            inventory_data.push(JSON.parse(item));
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
            console.log(id);
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

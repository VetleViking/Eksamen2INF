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

// {
//     "Produsent": "Hewlett Packard",
//     "Beskrivelse": "HP Envy Desktop TE01-4254",
//     "Spesifikasjoner": "Intel Core i7-13700, 16GB RAM, 1TB SSD, Intel UHD Graphics 770, Windows 11 Home",
//     "Innkj\u00f8psdato": "15.08.2023",
//     "Innkj\u00f8pspris": 999.99,
//     "Forventet levetid (i \u00e5r)": 5,
//     "Kategori": "Datamaskiner"
// },

export default router;

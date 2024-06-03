import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';

const router = Router();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { inventory_data } = req.body;

        let index= parseInt(await redisClient.get(`inventory_data_index`)) || 0;

        inventory_data.forEach(async (item: any) => {
            await redisClient.set(`inventory:${index}`, JSON.stringify(item));
            index++;
        });

        await redisClient.set(`inventory_data_index`, index.toString());

        res.status(200).json({ message: 'Inventory uploaded successfully' });
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

import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';

const router = Router();

router.post('/createmessage/:name/:email/:message', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, message } = req.params;

        if (!name || !email || !message) {
            res.status(400).json({ message: 'Name, email and message are required' });
            return;
        }

        const messageId = await redisClient.get('messageCounter') || '0';

        await redisClient.set('messageCounter', (parseInt(messageId) + 1).toString());

        await redisClient.hSet('messages', messageId, JSON.stringify({ name, email, message }));
        
        res.status(201).json('Melding lagd');
    } catch(err) {
        next(err);
    }
});

router.get('/getmessages', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await redisClient.hGetAll('messages');

        for (let key in messages) {
            messages[key] = JSON.parse(messages[key]);
        }

        res.status(200).json(messages);
    } catch(err) {
        next(err);
    }
});

router.delete('/deletemessage/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await redisClient.hDel('messages', id);

        res.status(200).json('Melding slettet');
    } catch(err) {
        next(err);
    }
});


export default router;

import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { generate_jwt, verify_jwt } from '../utils/user';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        if (userExists !== password) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }

        res.status(200).json({ message: 'Logged in', token: await generate_jwt(username) });
    } catch(err) {
        next(err);
    }
});


router.post('/createuser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        await redisClient.hSet('users', username, password);

        res.status(201).json({ message: 'User created' });
    } catch(err) {
        next(err);
    }
});

router.get('/getall', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const users = await redisClient.hGetAll('users');

        const usernames = Object.keys(users);
        const admins = await redisClient.hGetAll('admins');

        const usernamesWithAdmin = usernames.map(username => {
            return { username, admin: admins[username] ? true : false };
        });

        res.status(200).json(usernamesWithAdmin);
    } catch(err) {
        next(err);
    }
});

router.post('/makeadmin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        await redisClient.hSet('admins', username, 'true');

        res.status(200).json({ message: 'User is now an admin' });
    } catch(err) {
        next(err);
    }
});

router.post('/decodejwt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const decoded = await verify_jwt(token);

        const isAdmin = await redisClient.hGet('admins', decoded.username) ? true : false; 

        res.status(200).json({ username: decoded.username, admin: isAdmin });
    } catch(err) {
        next(err);
    }
});

export default router;

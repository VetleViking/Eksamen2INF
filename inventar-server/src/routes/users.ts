import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { generate_jwt, verify_jwt } from '../utils/user';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const userExists = await redisClient.hGet(`users:${username}`, 'password');

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
        const { username, password, email } = req.body;

        console.log(username, password, email);

        if (!username || !password || !email) {
            res.status(400).json({ message: 'Username, password and email are required' });
            return;
        }

        const userExists = await redisClient.hGet('users:' + username, 'password');

        console.log(userExists);

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        await redisClient.hSet('users:' + username, 'password', password);
        await redisClient.hSet('users:' + username, 'email', email);
        
        res.status(201).json({ message: 'User created' });
    } catch(err) {
        next(err);
    }
});

router.post('/deleteuser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const userExists = await redisClient.hGet('users' + username, 'password');
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        await redisClient.hDel(`users:${username}`, 'password');
        await redisClient.hDel(`users:${username}`, 'email');
        await redisClient.hDel('admins', username);

        res.status(200).json({ message: 'User deleted' });
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

        const users = await redisClient.keys('users:*');

        const usernames = users.map(user => user.split(':')[1]);
        console.log(usernames);
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
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const userExists = await redisClient.hGet(`users:${username}`, 'password');
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

router.post('/removeadmin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verify_jwt(token);
        const isAdmin = await redisClient.hGet('admins', decoded.username);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const userExists = await redisClient.hGet(`users:${username}`, 'password');
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        await redisClient.hDel('admins', username);

        res.status(200).json({ message: 'User is no longer an admin' });
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

router.post('/resetpasswordemail', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        console.log(email);

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const users = await redisClient.keys('users:*');

        const usersUsername = users.map(user => user.split(':')[1]);

        console.log(usersUsername);

        let userExists = false;

        for (const user of usersUsername) {
            const emailUser = await redisClient.hGet(`users:${user}`, 'email');
            if (emailUser === email) {
                userExists = true;
                break;
            }
        }

        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        const token = await generate_jwt(email, '1h');

        console.log(token);

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'vetleviking794@gmail.com', 
                pass: 'toby yrhx cymb kose'
            }
        });
    
        const mailOptions = {
            from: 'vetleviking794@gmail.com',
            to: email, 
            subject: 'Passord Tilbakestilling',
            html: `Du fikk denne eposten fordi du eller noen andre har bedt om en tilbakestilling av passordet ditt.
                   Vennligst klikk <a href="http://localhost:3000/resetpassword?token=${token}&email=${email}">her</a> for å tilbakestille passordet ditt.
                   Hvis du ikke ba om en tilbakestilling av passordet ditt, vennligst ignorer denne eposten og passordet ditt vil forbli det samme.`
        };

        const info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.messageId);

        res.status(200).json({ message: 'Email sent' });
    } catch(err) {
        next(err);
    }
});

router.post('/resetpassword', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, password } = req.body;

        console.log(token, password);

        if (!token || !password) {
            res.status(400).json({ message: 'Token and password are required' });
            return;
        }
 
        const decoded = await verify_jwt(token);

        const users = await redisClient.keys('users:*');

        const usersUsername = users.map(user => user.split(':')[1]);


        for (const user of usersUsername) {
            const emailUser = await redisClient.hGet(`users:${user}`, 'email');
            if (emailUser === decoded.username) {
                await redisClient.hSet(`users:${user}`, 'password', password);
                break;
            }
        }
        
        res.status(200).json({ message: 'Password reset' });
    } catch(err) {
        next(err);
    }
});

export default router;

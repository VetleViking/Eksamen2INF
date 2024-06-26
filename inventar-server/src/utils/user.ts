import jwt from 'jsonwebtoken'

export const generate_jwt = async (username: string, expires?: string) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '30d' || expires
    });
}

export const verify_jwt = async (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}
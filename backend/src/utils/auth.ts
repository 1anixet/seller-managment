import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, config.jwt.secret as string, {
        expiresIn: config.jwt.expire as string,
    } as any);
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, config.jwt.refreshSecret as string, {
        expiresIn: config.jwt.refreshExpire as string,
    } as any);
};

export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

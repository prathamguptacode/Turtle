import type { Request, Response } from 'express';
import { movieAboutSchema } from '../zodSchema/Schema.js';
import { fromZodError } from 'zod-validation-error';
import OpenAI from 'openai';
import movieAbout from '../model/movieAbout.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/enviromentType.js';

export async function uploadMovieAbout(req: Request, res: Response) {
    const userId = req.user;
    const zValidation = movieAboutSchema.safeParse(req.body);
    if (!zValidation.success) {
        const message = fromZodError(zValidation.error).message;
        return res.status(400).json({ message });
    }

    const openai = new OpenAI();
    const embeddingData = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: zValidation.data.serverDescription,
        encoding_format: 'float',
    });
    const embedding = embeddingData.data[0]?.embedding;
    if (!embedding) {
        return res
            .status(500)
            .json({ message: 'Something went wrong in the model' });
    }
    const newMovieAbout = new movieAbout({
        name: zValidation.data.name,
        description: zValidation.data.describe,
        serverDescription:
            `NAME: ${zValidation.data.name}: ` +
            zValidation.data.serverDescription,
        price: zValidation.data.price,
        owner: userId,
        embedding,
    });
    await newMovieAbout.save();
    const token = jwt.sign(
        { movieAboutId: newMovieAbout.id },
        env.MOVIEPOSTERTOKEN,
        {
            expiresIn: '15m',
            issuer: 'Turtle Backend',
            audience: 'Turtle Cleints',
        },
    );
    return res.json({ message: 'movie about created', token });
}

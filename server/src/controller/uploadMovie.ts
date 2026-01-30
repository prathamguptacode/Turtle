import type { Request, Response } from 'express';
import { movieAboutSchema } from '../zodSchema/Schema.js';
import { fromZodError } from 'zod-validation-error';
import OpenAI from 'openai';
import movieAbout from '../model/movieAbout.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/enviromentType.js';
import user from '../model/user.js';
import cloudinary from '../config/cloudinaryConfig.js';
import moviePoster from '../model/moviePoster.js';
import fs from 'fs';

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
    await user.updateOne(
        { _id: userId },
        { $push: { postedMovies: newMovieAbout._id } },
    );
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

export async function uploadPoster(req: Request, res: Response) {
    const userId = req.user;
    const headers = req.headers.authorization;
    if (!headers) {
        return res.status(400).json({ message: 'headers not found' });
    }
    const token = headers.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'invalid format of token' });
    }
    let movieAboutId = '';
    try {
        const tokenData = jwt.verify(
            token,
            env.MOVIEPOSTERTOKEN,
        ) as jwt.JwtPayload;
        movieAboutId = tokenData.movieAboutId;
        if (!movieAboutId) {
            return res
                .status(500)
                .json({ message: 'Somethin went work in token' });
        }
        const movieAboutData = await movieAbout.findById(movieAboutId);
        if (
            movieAboutData &&
            !movieAboutData.owner.equals(userId)
        ) {
            return res
                .status(403)
                .json({ message: 'only owner can upload Movie Poster' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'corrupted token' });
    }
    if (req.file?.path) {
        const uploadData = await cloudinary.uploader.upload(req.file.path, {
            use_filename: true,
            unique_filename: false,
            folder: 'Turtle_Posters',
            overwrite: true,
            quality:'auto:eco',
        });
        const newMoviePoster = new moviePoster({
            about: movieAboutId,
            moviePosterUrl: uploadData.url,
        });
        await newMoviePoster.save();
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log('Cannot delete the uploadPoster');
            }
        });
        return res.json({ message: 'Movie Poster Uploaded' });
    }
    return res.status(500).json({ message: 'Somethin went work in Upload' });
}

import type { Request, Response } from 'express';
import moviePoster from '../model/moviePoster.js';
import movieTrailer from '../model/movieTrailer.js';
import movie from '../model/movie.js';
import OpenAI from 'openai';
import movieAbout from '../model/movieAbout.js';

export async function poster(req: Request, res: Response) {
    const movieId = req.body?.movieId;
    if (!movieId) {
        return res.status(400).json({ message: 'invalid input' });
    }
    const movieDb = await moviePoster.find({ about: movieId }).limit(15);
    return res.json({ movieDb });
}

export async function trailer(req: Request, res: Response) {
    const movieId = req.body?.movieId;
    if (!movieId) {
        return res.status(400).json({ message: 'invalid input' });
    }
    const movieDb = await movieTrailer.find({ about: movieId });
    return res.json({ movieDb });
}

export async function video(req: Request, res: Response) {
    const movieId = req.body?.movieId;
    if (!movieId) {
        return res.status(400).json({ message: 'invalid input' });
    }
    const movieDb = await movie.find({ about: movieId });
    return res.json({ movieDb });
}

export async function search(req: Request, res: Response) {
    const name = req.body?.name;
    if (!name || name.length > 15) {
        return res.status(400).json({ message: 'invalid input' });
    }
    const openai = new OpenAI();
    const embeddingData = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: name,
        encoding_format: 'float',
    });
    if (!embeddingData.data[0]?.embedding) {
        return 'something went wrong';
    }
    const movieData = await movieAbout.aggregate([
        {
            $vectorSearch: {
                queryVector: embeddingData.data[0]?.embedding,
                path: 'embedding',
                numCandidates: 100,
                limit: 10,
                index: 'movie_abouts',
            },
        },
        {
            $project: {
                _id: 0,
                embedding: 0,
                owner: 0,
                __v: 0,
            },
        },
    ]);
    return res.json({ movieData });
}

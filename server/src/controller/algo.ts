import type { Request, Response } from 'express';
import OpenAI from 'openai';
import user from '../model/user.js';
import movieAbout from '../model/movieAbout.js';
import type { userT } from '../types/userInfoAlgo.js';
import { run } from '@openai/agents';
import algoAgent from '../algorithms/agents/algoAgent.js';

export async function topMovie(req: Request, res: Response) {
    const userId = req.user;
    const userInfo: userT = {
        id: userId.toString(),
    };
    const result = await run(algoAgent, 'top 10 movie for user', {
        context: userInfo,
    });
    const resultData = result.finalOutput;
    const movieArr = resultData?.ids as [string];
    const movieData = [];
    for (const moiveId of movieArr) {
        const data = await movieAbout
            .findById(moiveId)
            .select('name description price');
        movieData.push(data);
    }
    return res.json(movieData);
}

export async function mayLike(req: Request, res: Response) {
    const userId = req.user;
    const userInfo: userT = {
        id: userId.toString(),
    };
    const result = await run(algoAgent, 'May like movies for user', {
        context: userInfo,
    });
    const resultData = result.finalOutput;
    const movieArr = resultData?.ids as [string];
    const movieData = [];
    for (const moiveId of movieArr) {
        const data = await movieAbout
            .findById(moiveId)
            .select('name description price');
        movieData.push(data);
    }
    return res.json(movieData);
}

export async function similarMovie(req: Request, res: Response) {
    const movieId = req.body?.movieId;
    if (!movieId) {
        return res.status(400).json('invalid input');
    }
    try {
        const movieDb = await movieAbout
            .findById(movieId)
            .select('name serverDescription tags');
        if (!movieDb) {
            return res.status(400).json({ message: 'movie not found' });
        }
        console.log(movieDb);
        const openai = new OpenAI();
        const embeddingData = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: movieDb.serverDescription,
            encoding_format: 'float',
        });
        if (!embeddingData.data[0]?.embedding) {
            return res.status(500).json('something went wrong');
        }
        const movieData = await movieAbout.aggregate([
            {
                $vectorSearch: {
                    queryVector: embeddingData.data[0]?.embedding,
                    path: 'embedding',
                    numCandidates: 100,
                    limit: 8,
                    index: 'movie_abouts',
                },
            },
            {
                $project: {
                    _id: 1,
                    embedding: 0,
                    owner: 0,
                    __v: 0,
                },
            },
        ]);

        const clientMovie = movieData.filter((e) => {
            if (e._id != movieId) {
                return e;
            }
        });
        res.json(clientMovie);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Something went wrong');
    }
}

export async function byTag(req: Request, res: Response) {
    const tag = req.body?.tag;
    if (!tag) {
        return res.status(400).json({ message: 'invalid input' });
    }
    // ["Action","Comedy","Drama","Horror","Romance","Science Fiction","Thriller","Western"]
    const movieDb = await movieAbout
        .find({ tags: { $in: [tag] } })
        .select('name description price');

    res.json(movieDb);
}

import { tool } from '@openai/agents';
import { z } from 'zod';
import OpenAI from 'openai';
import movieAbout from '../../model/movieAbout.js';

const movieData = tool({
    name: 'Movie Data',
    description:
        'Gets the movies data in database by giving the query which goes through vector embedding for giving movies data',
    parameters: z.object({
        query: z.string(),
    }),
    execute: async ({ query }) => {
        const openai = new OpenAI();
        const embeddingData = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
            encoding_format: 'float',
        });
        if(!embeddingData.data[0]?.embedding){
            return 'something went wrong'
        }
        const movieData=await movieAbout.aggregate([
            {
                $vectorSearch:{
                    queryVector: embeddingData.data[0]?.embedding,
                    path: 'embedding',
                    numCandidates: 100,
                    limit: 4,
                    index: 'turtle_movies_dev'
                }
            },
            {
                $project:{
                    _id: 0,
                    embedding: 0,
                    owner: 0,
                    __v: 0,
                }
            }
        ])
        return movieData
    },
});

export default movieData

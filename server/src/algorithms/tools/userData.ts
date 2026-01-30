import { RunContext, tool } from '@openai/agents';
import { z } from 'zod';
import type { userT } from '../../types/userInfoAlgo.js';
import user from '../../model/user.js';

const userData = tool({
    name: 'fetch_user_data',
    description: 'gives the user data stored in database',
    parameters: z.object({}),
    execute: async (_args, runcontext?: RunContext<userT>) => {
        if (!runcontext?.context.id) {
            return 'something went wrong';
        }
        const userData = await user
            .findById(runcontext?.context.id)
            .select({ password: 0, _id: 0 })
            .populate([
                {
                    path: 'watchedMovies',
                    options: { limit: 7 },
                },
                {
                    path: 'likedMoviesAlgo',
                },
                {
                    path: 'postedMovies',
                },
            ]);
        return userData;
    },
});

export default userData;

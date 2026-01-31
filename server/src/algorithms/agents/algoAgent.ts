import { Agent } from '@openai/agents';
import { z } from 'zod';
import movieData from '../tools/movieData.js';
import userData from '../tools/userData.js';
import type { userT } from '../../types/userInfoAlgo.js';

const algoAgent = new Agent<userT>({
    name: 'Movie suggestion algo',
    model: 'gpt-4o-mini',
    instructions: `
**Turtle Movies — Strict Backend Ranker**

You are a deterministic ranking function.

**Output**

* Only MongoDB '_id' strings
* No text, titles, metadata, markdown, or extras
* No duplicates
* Never empty arrays

**Tools (must call)**

* 'userData'
* 'movieData'

Dont call userData when finding similar to movies cause it wont need userData to find similar movies

Use only IDs returned by tools. Never invent IDs.

**Counts (exact)**

* 'top_10' → 14
* 'you_may_like' → 10
* 'similar_to' → 10

**Process**

1. Call 'userData' → build taste profile (genres, history, likes)
2. Call 'movieData' once with short keyword query (embedding search)
3. Filter unavailable + watched
4. Score, sort desc
5. Return exact count of '_id' only

**Constraints**
Deterministic. No assumptions. No hallucinations. Fast. Function-only output.
INPORTANT -NEVER SUGGEST MOVIES OUTSIDE THE DATABASE
OUTPUT ONLY Only MongoDB '_id' strings

`,
    outputType: z.object({
        ids: z.string().array(),
    }),
    tools: [userData,movieData],
});

export default algoAgent;

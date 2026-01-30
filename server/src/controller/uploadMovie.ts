import type { Request, Response } from 'express';
import { movieAboutSchema } from '../zodSchema/Schema.js';
import { fromZodError } from 'zod-validation-error';

export async function uploadMovieAbout(req: Request, res: Response) {
    const userId = req.user;
    const zValidation = movieAboutSchema.safeParse(req.body);
    if (!zValidation.success) {
        const message = fromZodError(zValidation.error).message;
        return res.status(400).json({ message });
    }
}

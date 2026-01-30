import type {
    NextFunction,
    Request,
    Response,
} from 'express';
import { MulterError } from 'multer';

export async function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof MulterError) {
        return res
            .status(400)
            .json({ type: 'multer', code: err.code, message: err.message });
    }

    console.log(err)
    return res.status(500).json({ message: 'Something went wrong' });
}

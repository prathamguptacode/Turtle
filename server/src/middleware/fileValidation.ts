import type { NextFunction, Response, Request } from 'express';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';

export async function fileValidation(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const filePath = req.file?.path;
    if (!filePath) {
        return res.status(400).json({ message: 'file not found' });
    }
    const buffer = fs.readFileSync(filePath);
    const type = await fileTypeFromBuffer(buffer);
    const allowedType = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!type || !allowedType.includes(type.mime)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('cannot delete the file');
            }
        });
        return res.status(400).json({ mesaage: 'invalid file type' });
    }
    return next();
}

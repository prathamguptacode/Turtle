import type { Types } from "mongoose";

export {}
declare global {
    namespace Express {
        export interface Request {
            user: Types.ObjectId;
        }
    }
}

import mongoose, { Schema } from 'mongoose';

const sessionIdSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
    },
});

export default mongoose.model('user_sessionId', sessionIdSchema);

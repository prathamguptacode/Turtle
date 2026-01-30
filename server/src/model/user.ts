import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    watchedMovies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'movie_about',
        },
    ],
    postedMovies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'movie_about',
        },
    ],
    likedMoviesAlgo: [String],
});

export default mongoose.model('user',userSchema);

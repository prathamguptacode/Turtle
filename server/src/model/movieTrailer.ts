import mongoose, { Schema } from "mongoose";

const movieSchema = new mongoose.Schema({
    about:{
        type: Schema.Types.ObjectId,
        ref: 'movie_about',
        required: true
    },
    movieTrailerUrl:{
        type: String,
        required: true
    }
})

export default mongoose.model('movie_trailer',movieSchema)
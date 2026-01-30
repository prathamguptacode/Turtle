import mongoose, { Schema } from "mongoose";

const movieAboutSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    serverDescription:{
        type: String,
        required: true
    },
    tags:{
        type: [String],
    },
    price:{
        type: Number,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    likes:{
        type: Number,
        default: 0
    },
    embedding:{
        type: [Number],
        required: true
    }
});

export default mongoose.model('movie_about',movieAboutSchema)
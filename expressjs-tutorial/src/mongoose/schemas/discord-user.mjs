import mongoose, { Schema } from "mongoose";

const DiscordUserSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true // not allow duplicate
    },
    discordId:{
        type: mongoose.Schema.Types.String,
        required: true,
    }
});

export const DiscordUser = mongoose.model('DiscordUser', DiscordUserSchema); // to use in app
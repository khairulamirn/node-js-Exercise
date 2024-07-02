import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done) => { 
    console.log(`Inside serializeUser`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => { 
    console.log(`Inside deserializeUser`);
    console.log(`Deserializing user ID: ${id}`);
    try {
        const findUser = await DiscordUser.findById(id); 
        return findUser ? done(null, findUser) : done(null, null); // done is a callback function that takes two arguments (error, user). Purpose is to pass control to the next middleware or route handler.
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy({
        clientID: "1257589820017086575",
        clientSecret: "JTWIqdZqWGf-mL6lwblJbDApwpjlm-qD",
        callbackURL: "http://localhost:3000/api/auth/discord/redirect", // redirect url
        scope: ["identify"], // scope of the user information
    }, 
    async (accessToken, refreshToken, profile, done) => {
        let findUser;
        try {
            findUser = await DiscordUser.findOne({discordId: profile.id});
        } catch (err) {
            return done(err, null);    
        }

        try {
        if (!findUser) {
            const newUser = new DiscordUser({
                username: profile.username, 
                discordId: profile.id
            });
            const newSavedUser = await newUser.save();
             return done(null, newSavedUser);
        }
        return done(null, findUser);

        } catch (err) {
            console.log(err);
            return done(err, null);
        }
    })
);
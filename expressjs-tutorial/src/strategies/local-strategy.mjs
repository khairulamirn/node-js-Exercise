import passport from "passport";
import { Strategy } from "passport-local"; // strategies class include in all type of passport
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

// this function is used to serialize the user ID for the session. So we can say that the user ID is stored in the session.
passport.serializeUser((user, done) => { 
    console.log(`Inside serializeUser`);
    console.log(user);
    done(null, user.id); // done is a callback function that takes two arguments (error, user). Purpose is to pass control to the next middleware or route handler.
});

// this function is used to deserialize the user from the session.
passport.deserializeUser(async (id, done) => { 
    console.log(`Inside deserializeUser`);
    console.log(`Deserializing user ID: ${id}`);
    try {
        const findUser = await User.findById(id); // (Await the result of the query) to put on req.body for example 
        if (!findUser) throw new Error('User not found');
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy(async (username, password, done) => { // username and password can be changed to any name using curly brackets before the (username, password, done) => {}
        try {
            const findUser = await User.findOne({username});
            if(!findUser) // comparePassword(plain, hashed)
                throw new Error('User not found');
            if(!comparePassword(password, findUser.password)) // comparePassword(plain, hashed)
                throw new Error('Wrong password');
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    }) 
);

// if(!findUser) throw new error ('User not found');
// if (!comparePassword(password, findUser.password)) throw new error ('Bad credentials');
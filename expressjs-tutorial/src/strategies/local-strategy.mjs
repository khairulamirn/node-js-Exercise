import passport from "passport";
import { Strategy } from "passport-local"; // strategies class include in all type of passport
import { mockUsers } from "../utils/constants.mjs"; 

// this function is used to serialize the user ID for the session. So we can say that the user ID is stored in the session.
passport.serializeUser((user, done) => { 
    console.log(`Inside serializeUser`);
    console.log(user);
    done(null, user.id); // done is a callback function that takes two arguments (error, user). Purpose is to pass control to the next middleware or route handler.
});

// this function is used to deserialize the user from the session.
passport.deserializeUser((id, done) => { 
    console.log(`Inside deserializeUser`);
    console.log(`Deserializing user ID: ${id}`);
    try {
        const findUser = mockUsers.find((user) => user.id === id); // to put on req.body for example 
        if (!findUser) throw new Error('User not found');
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy((username, password, done) => { // username and password can be changed to any name using curly brackets before the (username, password, done) => {}
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try {
            const findUser = mockUsers.find((user) => user.username === username);
            if (!findUser || findUser.password !== password) 
                throw new Error('Wrong username or password');
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    }) 
);
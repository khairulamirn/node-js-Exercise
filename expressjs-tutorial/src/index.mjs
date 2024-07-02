// ECMA SCRIPT MODULE 
import express from 'express'; // import express
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"; // cookie parser is also middleware
import session from "express-session"; // middleware session
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from "connect-mongo";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

const app = express(); // assigning to express for use

// for mongodb database
mongoose.connect('mongodb://localhost:27017/expressjs-tutorial')
    .then(() => {
        console.log('Connected to Database');
    })
    .catch((err) => {
        console.log(err);
});

app.use(express.json()); // application sets up middleware that parses incoming request bodies containing JSON and makes the parsed data available under the `req.body` property.
app.use(cookieParser("helloworld")); // can have additional argument secret and need to enabled before routes so that the routes can parse the cookies for those routes or we wont be able to use it
app.use(
    session({
        secret: 'anson the dev', // kinda like a password need to be sophisticated not guessable
        saveUninitialized: false, // dont want to save unmodified session data to the session store for example client just visiting your website not doing anything
        resave: false, // update the session for example cookies
        cookie: {
            maxAge: 60000 * 60, 
        },
        // for session store to store in mongodb if the server is restarted
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);

app.use(passport.initialize()); // this mean we can use passport in our routes and middleware in express
app.use(passport.session()); // passport.session is also middleware in express

app.use(routes);

const PORT = process.env.PORT || 3000;
// Production Environment: In a production setting, the server (like Heroku, AWS, or any other hosting service) usually provides a port for your application to run on, which will be set in the PORT environment variable. Thus, process.env.PORT will have a value, and the application will listen on that port.

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
// localhost:3000  //domain
// localhost:3000/products  //route path
// localhost:3000/products?key=value&key2=value2  //query string

// register middleware
const loggingMiddleware = (req,res, next) => { // middleware must be registered before routes
    console.log(`Method: ${req.method} - url: ${req.url}`);
    next();
};

app.use(loggingMiddleware, (req,res, next) => {  //use middleware
    console.log("Finished Logging...");
    next();
});

//  example using middleware
app.get('/', 
    (req, res, next) => {
        console.log(req.session);
        console.log(req.session.id); // sessionID
        req.session.visited = true; // Id same so server knows what the session ID is and they can look up the session ID attach the correct session data to do the incoming request object so we'll know which user is
        res.cookie("hello", "world", {maxAge: 60000 * 60 * 2, signed: true}); //string, value, options(maxAge, signed, path)
        // only receive cookies from browser
        console.log("Base URL 1");
        next(); // call next middleware
    },
    (req, res, next) => {
        console.log("Base URL 2");
        next(); // call next middleware
    },
    (req, res, next) => {
        console.log("Base URL 3");
        next(); // call next middleware
    },
    (req, res) => {
    res.status(200).send('Hello world (Admin Khairul)');}
);

// Authentication discord
app.get('/api/auth/discord', passport.authenticate('discord'));

// redirect url
app.get('/api/auth/discord/redirect', passport.authenticate('discord'), 
(req, res) => {
    console.log(req.session);
    console.log(req.user);
    res.sendStatus(200);
});

// HTTP cookies is small pieces of data that your web server sends to the browser then it can store the cookies
// its important because by default HTTP is stateless that means is that whenever you make a request the server doesn't know who that request is coming from.
// For example e-commerce website cart system put and delete 

// Authentication mechanism for login

// client secret: JTWIqdZqWGf-mL6lwblJbDApwpjlm-qD
// client id: 1257589820017086575
// redirect url: http://localhost:3000/api/auth/discord/redirect
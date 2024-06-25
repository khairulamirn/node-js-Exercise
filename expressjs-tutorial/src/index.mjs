// ECMA SCRIPT MODULE 
import express from 'express'; // import express
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"; // cookie parser is also middleware
import session from "express-session"; // middleware session
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import "./strategies/local-strategy.mjs";

const app = express(); // assigning to express for use

app.use(express.json()); // application sets up middleware that parses incoming request bodies containing JSON and makes the parsed data available under the `req.body` property.
app.use(cookieParser("helloworld")); // can have additional argument secret and need to enabled before routes so that the routes can parse the cookies for those routes or we wont be able to use it
app.use(
    session({
        secret: 'anson the dev', // kinda like a password need to be sophisticated not guessable
        saveUninitialized: false, // dont want to save unmodified session data to the session store for example client just visiting your website not doing anything
        resave: false,
        cookie: {
            maxAge: 60000 * 60, 
        },
    })
);

app.use(passport.initialize()); // this mean we can use passport in our routes and middleware in express
app.use(passport.session()); // passport.session is also middleware in express

app.use(routes);

// register middleware
const loggingMiddleware = (req,res, next) => { // middleware must be registered before routes
    console.log(`Method: ${req.method} - url: ${req.url}`);
    next();
};

app.use(loggingMiddleware, (req,res, next) => {  //use middleware
    console.log("Finished Logging...");
    next();
});

const PORT = process.env.PORT || 3000;
// Production Environment: In a production setting, the server (like Heroku, AWS, or any other hosting service) usually provides a port for your application to run on, which will be set in the PORT environment variable. Thus, process.env.PORT will have a value, and the application will listen on that port.

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
// localhost:3000  //domain
// localhost:3000/products  //route path
// localhost:3000/products?key=value&key2=value2  //query string

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
    res.status(200).send('Hello world');}
);

// Authentication
app.post(
    '/api/auth', 
    passport.authenticate('local'), 
    (req,res) => {
    const {     
        body: { username, password},
    } = req; // destructuring

    const findUser = mockUsers.find((user) => user.username === username); // find user by username
    if (!findUser || findUser.password !== password) // check password
        return res.status(401).send({msg: 'BAD CREDENTIALS'}); // 401 unauthorized

    req.session.user = findUser; // set session user
    return res.status(200).send(findUser); // 200 ok
});

// Authentication Status
app.get('/api/auth/status', (req,res) => { 
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(req.session); // session data stored in data structure on the server in memory.
    });
    return req.session.user // ternory operator 
        ? res.status(200).send(req.session.user) // ? if true : if false
        : res.status(401).send({msg: "Not Authenticated"});
});

// Logout
app.post('/api/auth/logout', (req,res) => {
    if(!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.send(200);
    });
})

// Cart System (Shopping Cart) 
app.post("/api/cart", (req,res) => { 
    if (!req.session.user) return res.sendStatus(401); // !req.session.user = undefined from auth then return 401
    const {body: item} = req; 
    const {cart} = req.session; 
    if (cart) { // if cart exists
        cart.push(item); // push item
    } else {
        req.session.cart = [item]; // if cart not exist create cart
    }
    return res.status(201).send(item);
});

// Get Cart System
app.get("/api/cart", (req,res) => {
    if (!req.session.user) return res.sendStatus(401); 
    return res.send(req.session.cart ?? []); // ?? = if null or undefined then return empty array (?? is the same as ||)
});

// HTTP cookies is small pieces of data that your web server sends to the browser then it can store the cookies
// its important because by default HTTP is stateless that means is that whenever you make a request the server doesn't know who that request is coming from.
// For example e-commerce website cart system put and delete 

// Authentication mechanism for login
// ECMA SCRIPT MODULE 
import express from 'express'; // import express
import routes from "./routes/index.mjs"

const app = express(); // assigning to express for use

app.use(express.json()); // application sets up middleware that parses incoming request bodies containing JSON and makes the parsed data available under the `req.body` property.
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
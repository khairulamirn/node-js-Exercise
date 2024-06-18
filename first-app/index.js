//  1. WHAT IS IT? 
// Runtime that allows you to run javascript on a server

console.log('Hello world 🙌');
console.log(process.platform);
console.log(process.env.USER);

//  NODE ARCHITECTURE 
//  no document object
// object in node
// file system: fs.readFile()
// listen for request: http.createServer()


// 2. HOW NODE WORKS 
// Non-blocking ASYNCHRONOUS
// Event Queue
// Ideal for I/O -intensive apps
// Do not use Node for CPU-intensive apps
// data intensive and realtime applications

const sayHello = (name) => console.log('Hello '+ name + '!');
sayHello('Khairul');

// console.log(window); window not defined bcs in node no window or document


// 3. NODE MODULE SYSTEM (operating system (os), file system(fs) events and http)
// GLOBAL OBJECT 
console.log(); // global scope

// setTimeout() // global scope
// clearTimeout();
// setInterval();
// clearInterval();

// var message = '';
// window.message

console.log(module); // in node every file is a module and the variables and functions defined in that file are a scoped not available outside of that module


// 4. CREATING A MODULE (module.exports.log = log;)
// 5. LOADING A MODULE 
// const log = require('./logger');

// console.log(logger);
// logger.log('message'); // Output: message
// log('message'); // function

//  6. MODULE WRAPPER FUNCTION


//  7. PATH MODULE 
const path = require('node:path');

var pathObj = path.parse(__filename);
console.log(pathObj);


//  8. OS MODULE (Operating System) (usualy javascript run only inside of a browser and could only work with the window or document objects) (with node JS code executed outside of a browser or on the server ) (with node we can work with file, network, build web server that listen HTTP request on a given port)
const os = require('node:os');

var totalMemory = os.totalmem();
var freeMemory = os.freemem();

// console.log('Total memory:' + totalMemory);

// TEMPLATE STRING
// ES6 / ES2015 : ECMAScript 6

console.log(`Total Memory: ${totalMemory}`);
console.log(`Free Memory: ${freeMemory}`); 


//  9. FILE SYSTEM MODULE (avoid using accessSync instead use asynchronous method bcs non-bloking and node has single thread) (Example have many clients connecting to that back-end if that single thread is busy wont able to serve many client thats why use asynchronous.)
const fs = require('node:fs');

// const files = fs.readdirSync('./'); // directory method
// console.log(files);

fs.readdir('./', function(err, files) {
    if (err) console.log('Error', err);
    else console.log('Result', files);
});


//  10. EVENTS MODULE (a signal that something has happened)
// its a class (container for properties and function we called methods) (method: .emit [Defination: Making a noise, produce - signalling], .addListener / .on (jQuery))
// EventEmitter
// const EventEmitter = require('node:events');

// class (human)
// class MyEmitter extends EventEmitter {};

// object (khairul)
// const myEmitter = new MyEmitter();

// // Register a listener using arrow function
// myEmitter.on('messageLogged', (arg) => { // e, eventArg
//   console.log('an event occurred!', arg);
// });

// more cleaner code using arrow function with one line of code 
// myEmitter.on('logging', (arg) => console.log('successfully logged in!', arg));

// Raise an event (synchronously) //  11. EVENT ARGUMENTS (send some data about that event) {id: 1, url: 'http://'} example do it in object
// myEmitter.emit('messageLogged', {id: 1, url: 'http://'});

// Raise: logging (data: message)
// myEmitter.emit('logging', {data: 'Thanks for using our app.'});


//  12. Extending EventEmitter

const Logger = require('./logger');
const logger = new Logger();

// Register a listener using arrow function
logger.on('messageLogged', (arg) => { // e, eventArg
    console.log('an event occurred!', arg);
});

logger.log('message');


//  13. HTTP Module (example not used in real world) (use framework called Express (build on top of HTTP module in node) which gives application a clean structure to handle various routes)
const http = require('node:http');
const { Socket } = require('node:net');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Hello Internet');
        res.end();
    };

    if (req.url === '/api/courses') {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});

// server.on('connection', (socket) => console.log('New connection...'));

server.listen(3000);

console.log('Listening on port 3000...');
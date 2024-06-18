console.log(__filename);
console.log(__dirname);

const EventEmitter = require('node:events');

var url = 'http://mylogger.io/log';

// const logMessage = (message) => console.log(message);
// logMessage();

// class use Pascal case convention
class Logger extends EventEmitter {
     log(message) {
        // Send an HTTP request
        console.log(message);

        // Raise an event
        this.emit('messageLogged', {id: 1, url: 'http://'});
    };
};

// module.exports.log = log; 
module.exports = Logger; // function


const server = require('./Communication/DriverMQTT') ; 
const serial = require('./Communication/Serial');
const UI = require('./Driver/UI');


server.open() ; 
serial.open() ;
UI.init() ;

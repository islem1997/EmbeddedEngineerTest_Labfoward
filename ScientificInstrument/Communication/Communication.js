const serial = require('./Serial');
const MQTT = require('./BalanceMQTT');
const Config = require('../Device/BalanceConfig');
const log = require('../Utils/Log');

var link =  {} ;
const COM = {};
COM.init = function init(){
    log.error(Config.link) ; 
    if (Config.link === "Serial") 
    {
        link = serial ; 
    }
    else if (Config.link === "MQTT")
    {
        link = MQTT ;
    }
    else 
    {
        link = serial ;
    }
}
COM.connect = function connect(cb) {
    link.connect(); 
}
COM.disconnect = function disconnect() {
    link.disconnect() ; 
}
COM.send = function send(Value , cb) {
    link.send(Value , cb) ; 
}
module.exports = COM;










const server = require('../Communication/DriverMQTT') ; 
const serial = require('../Communication/Serial');
const log = require('../Utils/Log');
const config = require('./ConfigDriver') ; 

const Commands = {} ; 

// parse Command function transforms a cmdline command to a MQTT or Serial Command ready for the device : points of improvement implementing device rooting and brodcast commands
Commands.parseComands = function parseCommands(Command){
    var parsedCommand = "" ; 
    var topic = {} ; 
    if (Command === "help")
    {
        console.log("To be able to communicate and send commands\n"+
                    "the following commands are set for use : \n" +
                    "S --------------------------------------> to get the stable weight calculated by the device\n"+
                    "G --------------------------------------> to get the Current weight calculated by the device\n"+
                    "BConf ----------------------------------> to get the Current config details of the device\n"+
                    "C other.Device_Name name ---------------> the change the device name\n"+
                    "C link link link ----------------------->  to set which link the driver should use to connect to the device , link can be Serial or MQTT\n"+
                    "C mqtt.broker : broker ----------------->  to set the mqtt host : usually local host unless the solution is set on containers or online\n"+
                    "C mqtt.username usrname ----------------> to set the username for device authentication\n"+
                    "C mqtt.password pwd --------------------> to set the password for device authentication\n"+
                    "C serial.path path ---------------------> COMx on windows for this project a virtual com port COM1 and COM2 are being used\n"+
                    "C serial.baudRate bd -------------------> to set the serial port BaudRate\n"+
                    "C serial.parity parity -----------------> to set the serial port parity \n"+
                    "C measurement.READ_INTERVAL T (in ms) --> to set how many data points the sensor per T collects to calculate the stable weight\n"+
                    "C measurement.PERIODIC_MEASUREMENTS x --> (true or false) to set a function that sends data periodically to the iot driver\n" +
                    "C measurement.unit ---------------------> (mg or g) : to set the unit in which the sensor value is sent to the driver\n"+ 
                    "IN ORDER TO HAVE THE Config COMMANDS Done you have to Restart the device Process\n") ; 
        return ; 
    }
    else if (Command[0] ==="S")
    {
        topic = config.mqtt.topics.Commands ;
        parsedCommand = 'S' ;
    }
    else if (Command[0] ==="G")
    {
        topic = config.mqtt.topics.Commands ;
        parsedCommand = 'G' ;
    }
    else if (Command ==="BConf")
    {
        topic = config.mqtt.topics.Commands ;
        parsedCommand = 'BConf' ;
    }
    else if (Command[0] === "C")
    {
            topic = config.mqtt.topics.Configs ;
            const buffer = Command.toString().split(' ') ; 
            if (buffer.length != 3)
            {
                log.error("Invalid Command") ;
                return ;
            }
            else
            {
                parsedCommand = "C " + buffer[1]+":"+" "+buffer[2] ; 

            }
    }
    else 
    {
        return ;
    }
    if (serial.isOpen === true)
    {
        serial.writeData((parsedCommand.toString())) ; 
    }
    else
    {
        server.publish(topic , parsedCommand) ; 
    }
}
module.exports = Commands;
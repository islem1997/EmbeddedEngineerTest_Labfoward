var SerialPort = require('serialport').SerialPort;
const log = require('../Utils/Log');
const config = require('../Device/BalanceConfig');
const balance = require('../Device/Balance');



var port = {} ; 
// connect function :  sets the connect options creates and opens the virtual port and assigns the callbacks 
port.connect  = function connect(){
    const connectOptions = {
        path: config.serial.path,
        baudRate: config.serial.baudRate,
        autoOpen: config.serial.autoOpen,
        parity: config.serial.parity, 
      };
    port =new SerialPort(connectOptions) ;
    console.log(`Trying to connect to the serial port at ${config.serial.path}`);
    port.open() ;
    port.on('open', showPortOpen);
    port.on('data', readSerialData);
    port.on('close', showPortClose);
    port.on('error', showError);
}
port.disconnect = function disconnect(){
        port.close() ; 
}
port.send = function send(Value){
    const message = {
        Weight : Value,
      };
    writeData(JSON.stringify(message)) ; 
}
function writeData(data){
    setTimeout(()=>{
        log.info ("Sent : "+ data) ;
        port.write(data) ; 
    },3000)

}
function showPortOpen() {
    setTimeout(()=>{
        log.success(`Connected successfully to the serial port at ${config.serial.path} with speed ${config.serial.baudRate}`)
        writeData("device is Online via "+ config.link) ;
    },3000) ; 
  }
   
  function readSerialData(data) {
    setTimeout(()=>{
        log.info( `Recieved : ${data}`) // buffer to string
        ParseCommand(data) ; 
    },3000)

  }
  
   
  function showPortClose() {
    setTimeout(()=>{
        log.error(`Disconnected from the serial port at ${config.serial.path}`)

    },3000)
  }
   
  function showError(error) {
    setTimeout(()=>{
        log.error(`An error occurred. ${error}`);

    },3000)
  }
  // Parse Command function parses all the commands coming from the iot driver : point of improvement is implementing 
  // a more generic version of this function in the Communication.js which absracts the Interface
  function ParseCommand(data)
  {
    log.info("Parsing the Serial message...") ; 
    setTimeout(()=>{
        if (data.toString() === "driver is Online")
        {
            writeData("device is Online via "+ config.link) ;
        }
        else if (data.toString() === "BConf")
        {
            log.info("Command Recognized Conf-> get Conf details") ; 
            writeData(JSON.stringify(config)) ;
        }
        else 
        {
            switch (String.fromCharCode(data[0])){
                case 'S' : 
                    {
                        log.info("Command Recognized S-> Stable") ; 
                        balance.readStableWeight((Weight)=>{
                            if (Weight < 1)
                                {
                                    writeData("S -") ;
                                }
                            if (Weight > 1000)
                                {
                                    writeData("S +") ;
                                }
                            else
                                {
                                    writeData("S S "+Weight+" "+config.measurement.unit) ;
                                }
                        }) ; 
                        break ;
                    }
                    case 'G' : 
                    {
                        log.info("Command Recognized G-> Current") ; 
                        balance.readCurrentWeight((Weight)=>{
                            if (Weight < 1)
                                {
                                    writeData("G -") ;
                                }
                            if (Weight > 1000)
                                {
                                    writeData("G +") ;
                                }
                            else
                                {
                                    writeData("G G "+Weight+" "+config.measurement.unit) ;
                                }
                        }) ; 
                        break ;
                    }
                case 'C' : 
                    {
                        log.info("Command Recognized C-> Config") ; 
                        const command = data.toString().split(' ') ; 
                        command.forEach(element => {
                            if (element.charAt(element.length -1) === ':') // this is the config
                            {
                                writeData(config.updateConfig(element , command[command.indexOf(element)+1])) ; 
                            }
                        });
                        break ; 
                    }
                default : 
                    log.error('Invalid Command ' + data[0]) ; 
            }
        }
    },3000) ; 
}
module.exports = port;
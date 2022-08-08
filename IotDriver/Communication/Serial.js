var SerialPort = require('serialport').SerialPort;
const log = require('../Utils/Log');
const config = require('../Driver/ConfigDriver') ; 


const port =new SerialPort({ path :'COM2' ,baudRate: 115200 , 
    autoOpen : false ,
    parity :  "none" }) ;
  port.on('open', showPortOpen);
  port.on('data', readSerialData);
  port.on('close', showPortClose);
  port.on('error', showError);

  function writeData(data){
    setTimeout(()=>{
        log.info ("Sent : "+ data) ;
        port.write(data) ; 
    },1000)

}
function showPortOpen() {
    setTimeout(()=>{
        log.success(`Connected successfully to the serial port at ${port.path} with speed ${port.baudRate}`)
        writeData("driver is Online") ;
    },1000) ; 
  }
   
  function readSerialData(data) {
    setTimeout(()=>{
        log.info( `Recieved : ${data}`) // buffer to string
    },1000)

  }
  function showPortClose() {
    setTimeout(()=>{
        log.error(`Disconnected from the serial port at ${port.path}`)

    },1000)
  }
   
  function showError(error) {
    setTimeout(()=>{
        log.error(`An error occurred. ${error}`);

    },1000)
  }
  port.writeData = function WriteData(data){
    port.write(data) ; 
    log.info ("Sent via Serial  : "+ data) ;
  }
module.exports = port;
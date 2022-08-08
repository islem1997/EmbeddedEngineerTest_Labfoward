const Config = require('./Device/BalanceConfig');
const log = require('./Utils/Log');
const COM = require('./Communication/Communication');
const balance = require('./Device/Balance');
const { config } = require('dotenv');


const app = {};

app.init = function init() {
  log.info('Device with Name : '+ Config.other.Device_Name+' is Online');
  balance.init(()=>{
  }) ; 
  COM.init() ; 
  COM.connect() ; 
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  transmitter.disconnect(() => {
    process.exit();
  });
};

process.on('SIGINT', () => {
  app.shutdown();
});

process.on('SIGTERM', () => {
  app.shutdown();
});
process.on('SIGKILL', () => {
  app.shutdown();
});
app.init();

if (Config.measurement.PERIODIC_MEASUREMENTS === "true") // sends Data to the 
{
setInterval(() => {
  balance.readStableWeight((w)=>{
    COM.send(Config.mqtt.topics.Data ,JSON.stringify(w))
})
},10000) ;
}
module.exports = app 

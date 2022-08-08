/*
 * Sensor responsible for reading the temperature sensor
 */
const log = require('../Utils/Log');
const mqtt = require('mqtt') ;
const config = require('../Device/BalanceConfig');
const balance = require('../Device/Balance');

const transmitter = {};

transmitter.connect = function connect() {
  const connectOptions = {
    host: config.mqtt.broker,
    port: config.mqtt.port,
    username: config.mqtt.username,
    password: config.mqtt.password, 
  };

  console.log(`Trying to connect to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);

  transmitter.client = mqtt.connect(connectOptions);
  transmitter.client.on('connect', () => {
    setTimeout(()=>{
      log.success(`Connected successfully to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);
      transmitter.subscribe(config.mqtt.topics.Data) ;
      transmitter.subscribe(config.mqtt.topics.Commands) ;
      transmitter.subscribe(config.mqtt.topics.CommandsResponse) ;
      transmitter.subscribe(config.mqtt.topics.Configs) ;
      transmitter.subscribe(config.mqtt.topics.ConfigsResponse) ;
    },3000)
  });
  transmitter.client.on('disconnect', () => {
    setTimeout(()=>{
      log.error(`Disconnected from the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);
    },3000)
  });

  transmitter.client.on('error', (err) => {
    setTimeout(()=>{
      log.error(`An error occurred. ${err}`);
    },3000)
  });
  transmitter.client.on('message', (topic, message, packet) => {
    setTimeout(()=>{
      log.info(`Recieved message : \nthe topic is. ${topic}` + `the message is. ${message}`);
      ParseCommand(topic , message) ; 
    },3000)
  });

};
transmitter.disconnect = function disconnect(cb) {
  transmitter.client.end();
  cb();
};
transmitter.send = function send(topic ,Value) {
  setTimeout(()=>{
    transmitter.client.publish(topic, Value, (err) => {
      if (err) {
          log.error(`An error occurred while trying to publish a message. Err: ${err}`);
      } else {
          log.success('Successfully published message');
      }
    });
  },3000)
};
transmitter.subscribe = function Subscribe(topic){
  transmitter.client.subscribe((topic) , (err)=>{
    if (err) {
      log.error(`An error occurred while trying to publish a message. Err: ${err}`);
  } else {
      log.success(`Successfully Subscribed To Topics ${topic}`);
  }
});
} ; 
  // Parse Command function parses all the commands coming from the iot driver : point of improvement is implementing 
  // a more generic version of this function in the Communication.js which absracts the Interface
function ParseCommand(topic , message)
{
  log.info("Parsing the MQTT message...") ; 
  setTimeout(()=>{
      if(topic === config.mqtt.topics.Commands) 
          {                  
            if (String.fromCharCode(message[0]) === 'S')
            {
              log.info("Command Recognized S-> Stable") ; 
              balance.readStableWeight((Weight)=>{
                    if (Weight < 1)
                        {
                          transmitter.send(config.mqtt.topics.CommandsResponse , "S -") ;
                        }
                    if (Weight > 1000)
                        {
                          transmitter.send(config.mqtt.topics.CommandsResponse , "S +") ;
                        }
                    else
                        {
                          transmitter.send(config.mqtt.topics.CommandsResponse , "S S "+Weight+" "+config.measurement.unit) ;
                        }
              }) ; 
            }
            else if (String.fromCharCode(message[0]) === 'G')
            {
              log.info("Command Recognized G-> Current") ; 
              balance.readCurrentWeight((Weight)=>{
                if (Weight < 1)
                    {
                      transmitter.send(config.mqtt.topics.CommandsResponse , "G -") ;
                    }
                if (Weight > 1000)
                    {
                      transmitter.send(config.mqtt.topics.CommandsResponse , "G +") ;
                    }
                else
                    {
                      transmitter.send(config.mqtt.topics.CommandsResponse , "G G "+Weight+" "+config.measurement.unit) ;
                    }
               }) ; 
            }
            else if (String.fromCharCode(message) === 'Conf')
            {
              log.info("Command Recognized Conf-> get Conf details") ; 
              transmitter.send(JSON.stringify(config)) ;
            }
            else
            {
              log.error("Invalid Command") ;
            }
          }
        else if (topic === config.mqtt.topics.Configs)      
          {
              log.info("Command Recognized C-> Config") ; 
              const buffer = message.toString().split(' ') ; 
              transmitter.send(config.mqtt.topics.ConfigsResponse ,config.updateConfig(buffer[1] , buffer[2])) ; 
          }
        else if (topic === config.mqtt.topics.ConfigsResponse || topic === config.mqtt.topics.CommandsResponse || topic === config.mqtt.topics.Data)
        {
          log.info("Command Recognized Response/data-> No need for other action ") ; 
        }
        else 
          log.error('Invalid Topic') ; 
  },3000) ; 
  }
module.exports = transmitter;
/*
 * Device Configuration Variables Used by the balance
 *
 */

const log = require('../Utils/Log');

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

// Container for all Configurations
const fs = require("fs");
const os = require("os");
const Configs = {};

Configs.V1 = {
  other: {
    Device_Name: process.env.DEVICE_NAME,   // name of the device
  },
  link: process.env.LINK,  // can be "MQTT" or "Serial" as well
  mqtt: { 
    broker: process.env.MQTT_BROKER_HOST, // broker name usually localhost
    port: process.env.MQTT_BROKER_PORT, // port
    topics:{
      Data : process.env.MQTT_TOPICS_DATA, 
      Commands:  process.env.MQTT_TOPICS_COMMANDS, 
      CommandsResponse:  process.env.MQTT_TOPICS_COMMANDS_REPONSE,  // MQTT Topics
      Configs : process.env.MQTT_TOPICS_CONFIGS,
      ConfigsResponse : process.env.MQTT_TOPICS_CONFIGS_RESPONSE,

    },    
    username: process.env.MQTT_USERNAME, // MQTT USername and Passwd
    password: process.env.MQTT_PASSWORD,
  },
  serial: {
    path : process.env.SERIAL_PATH , 
    baudRate : parseInt(process.env.SERIAL_BAUDRATE) ,    // Serial Port Vars
    autoOpen : false , 
    parity : process.env.SERIAL_PARITY , 
  },
  measurement: {
    NUMBER_OF_SAMPLES: process.env.MEASUREMENT_NUMBER_OF_SAMPLES, // in the stable buffer to improve readings
    READ_INTERVAL : process.env.MEASUREMENT_READ_INTERVAL, // in ms 
    PERIODIC_MEASUREMENTS : process.env.MEASUREMENT_PERIODIC_MEASUREMENTS ,  // to set the periodic send of data
    MEASURMENTS_PERIOD : 0,
    unit : process.env.MEASUREMENT_UNIT // can be "g" :
  },
};

// Update Config helps Update all the functions and in the .env File most of the vars and updated dirzctly but some neeed Restart
// for the sake of the simulation
Configs.V1.updateConfig = function updateConfig(field , value) {
  if (field === 'other.Device_Name:')
  {
    setEnvValue("DEVICE_NAME" , value) ; 
  }
  else if (field === 'link:')
  {
      if(value === "Serial" || value === "MQTT")
      {
        setEnvValue("LINK" , value) ; 
      }
      else
      {
        log.error("Invalid Link : " + value)
        return "Invalid Link : " + value ;
      }
  }
  else if (field === 'mqtt.broker:')
  {
    setEnvValue("MQTT_BROKER_HOST" , value) ; 
  }
  else if (field === 'mqtt.port:')
  {
    setEnvValue("MQTT_BROKER_PORT" , value) ; 

  }
  else if (field === 'mqtt.data-topic:')
  {
    setEnvValue("MQTT_TOPICS_DATA" , value) ; 

  }
  else if (field === 'mqtt.command-topic:')
  {
    setEnvValue("MQTT_TOPICS_COMMANDS" , value) ; 
  }
  else if (field === 'mqtt.command-response-topic:')
  {
    setEnvValue("MQTT_TOPICS_COMMANDS_RESPONSE" , value) ; 
  }
  else if (field === 'other.config-topic:')
  {
    setEnvValue("MQTT_TOPICS_CONFIGS" , value) ; 

  }
  else if (field === 'other.config-response-topic:')
  {
    setEnvValue("MQTT_TOPICS_CONFIGS_RESPONSE" , value) ; 

  }
  else if (field === 'other.username:')
  {
    setEnvValue("MQTT_USERNAME" , value) ; 
  }
  else if (field === 'other.password:')
  {
    setEnvValue("MQTT_PASSWORD" , value) ; 
  }
  else if (field === 'serial.path:')
  {
    setEnvValue("SERIAL_PATH" , value) ; 
  }
  else if (field === 'serial.baudRate:')
  {
    setEnvValue("SERIAL_BAUDRATE" , value) ; 

  }
  else if (field === 'serial.parity:')
  {
    setEnvValue("SERIAL_PARITY" , value) ; 
  }
  else if (field === 'measurement.NUMBER_OF_SAMPLES:')
  {
    setEnvValue("MEASUREMENT_NUMBER_OF_SAMPLES" , value) ; 
  }
  else if (field === 'measurement.READ_INTERVAL:')
  {
    setEnvValue("MEASUREMENT_READ_INTERVAL" , value) ; 
  }
  else if (field === 'measurement.unit:')
  {
    if (value === 'mg' || value === 'g')
    {
      setEnvValue("MEASUREMENT_UNIT" , value) ; 
    }
    else
    {
      log.error("Invalid Unit : " + value)

      return ("Invalid Unit : " + value) ;
    }
  }
  else if (field === 'measurement.PERIODIC_MEASUREMENTS:')
  {
    setEnvValue("MEASUREMENT_PERIODIC_MEASUREMENTS" , value) ; 
  }
  else {
    log.error("NO Commands have been executed");
    return "NO Commands have been executed" ;
  }
  return "Config has Changed to this new Value -> "+ field + "-> "+value + ". \nRestart device Process to See changes" ;
} ;
function setEnvValue(key, value) {

  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
  }));

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}
// export the module
module.exports = Configs.V1;
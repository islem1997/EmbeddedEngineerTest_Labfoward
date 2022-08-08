/*
 * Create and export configuration variables used for the IotDriver
 *
 */
// Container for all environments
const Configs = {};
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();


Configs.V1 = {
  mqtt: {
    broker: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
    topics:{
      Data : 'Labfoward/Data/',
      Commands: 'Labfoward/Commands/' , 
      Configs : 'Labfoward/Configs/', 
    },
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  envName: 0,
  log: {
    level: process.env.LOG_LEVEL,
  },
  notifyInterval: 10,
};

// export the module
module.exports = Configs.V1;
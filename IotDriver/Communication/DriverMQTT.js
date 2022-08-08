const aedes = require('aedes')();
const mqtt = require('net').createServer(aedes.handle);
const config = require('../Driver/ConfigDriver') ; 
const log = require('../Utils/Log');
const serial = require('./Serial');
const server  = {} ; 
server.open = function Open()
{
    mqtt.listen(config.mqtt.port, function () {
        log.info(`MQTT Broker running on port: ${config.mqtt.port}`);
      });
}
// authenticate the connecting client
aedes.authenticate = (client, username, password, callback) => {
    password = Buffer.from(password, 'base64').toString();
    if (username === config.mqtt.username && password === config.mqtt.password) {
        return callback(null, true);
    }
    const error = new Error('Authentication Failed!! Invalid user credentials.');
    log.error('Error ! Authentication failed.')
    return callback(error, false)
}

// emitted when a client connects to the broker
aedes.on('client', function (client) {
    setTimeout(()=>{
        log.success(`[CLIENT_CONNECTED]`)
        serial.close() ; 
    },1000)

})

// emitted when a client disconnects from the broker
aedes.on('clientDisconnect', function (client) {
    setTimeout(()=>{
        log.error(`[CLIENT_DISCONNECTED]`)
        serial.open() ; 
    },1000)

})

// emitted when a client subscribes to a message topic
aedes.on('subscribe', function (subscriptions, client) {
    setTimeout(()=>{
        log.success(`[TOPIC_SUBSCRIBED] : \n${subscriptions.map(s => s.topic).join('\n')}`)

    },1000)
})

// emitted when a client unsubscribes from a message topic
aedes.on('unsubscribe', function (subscriptions, client) {
    setTimeout(()=>{
        log.error(`[TOPIC_UNSUBSCRIBED] : \n ${subscriptions.join('\n')}`)

    },1000)
})

// emitted when a client publishes a message packet on the topic
aedes.on('publish', async function (packet, client) {
    setTimeout(()=>{
        if (client) {
            log.info(`[MESSAGE_PUBLISHED] on\n {${packet.topic} \n the payload is ${packet.payload}}`)
        }
    },1000)

})
server.close = function Close(){
    aedes.close(()=>{
        log.error("Closed MQTT Server") ; 
    }) ; 
}
server.publish = function Publish(topic , payload){
    setTimeout(()=>{
        aedes.publish({ topic: topic, payload: payload}) ; 
        log.info ("Sent via MQTT :\n "+ `{topic: ${topic},\n payload:  ${payload}}` ) ;
    },1000)
}

module.exports = server ; 
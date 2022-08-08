const readline = require('readline');
const cmd = require('./Commands');
const log = require('../Utils/Log');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.init = function init(){
    log.error('Welcome to the Iot Driver \n once the Device is Online you will be notified \n if you want to know about the possible commands write help');
    rl.on('line', (input) => {
        cmd.parseComands(input) ; 
      });
}
module.exports = rl;
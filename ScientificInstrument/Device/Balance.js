/*
 * The balance responsible for reading the weight.
 */
const config = require('./BalanceConfig');
const log = require('../Utils/Log');

const balance = {}; 
// Circular buffer to store the simulated readings
var values = createRingBuffer(config.measurement.NUMBER_OF_SAMPLES) ; 
//init
balance.init = function init(cb){
  setInterval(() => {
    balance.senseData(cb)  ;   
  } , config.measurement.READ_INTERVAL);
}  
// get the simulated readings
balance.senseData = function senseData(cb) {
    // Generate a fake Value for testing
    const Weight = Math.floor(Math.random() * 520);
    values.push(Weight) ; 
    cb(Weight) ;
  }
// get the current weight which is the last simulated sensor reading 
balance.readCurrentWeight = function readCurrentWeight(cb) {
    const CurrentW = values.get() ; 
    cb(CurrentW) ; 
  };
// get the stable weight after avereging the circular Buffer
balance.readStableWeight = function readStableWeight(cb) {
    const StableW = values.avg() ; 
    cb(StableW) ; 
  };
  function createRingBuffer(length){
    pointer = 0 ; 
    buffer  = [] ; 
    return {
      Pointer : function(){return pointer ;},
      get  : function(){
          if (pointer === 0){
              return null;
          } else{
              return buffer[pointer-1];
          }
      },
      push : function(item){
        buffer[pointer] = item;
        pointer = (pointer + 1) % length;
        return item;
      },
      min  : function(){return Math.min.apply(Math, buffer);},
      sum  : function(){return buffer.reduce(function(a, b){ return a + b; }, 0);},
      avg : function(){return (this.sum()/pointer) ; }
    };
  };
module.exports = balance;
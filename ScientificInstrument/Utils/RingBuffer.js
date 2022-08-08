
 function createRingBuffer(length){ // ring Buffer Used For Stable Weight Calculation
    return {
      pointer : 0, 
      buffer : [],
      get  : function(key){
          if (key < 0){
              return buffer[pointer+key];
          } else if (key === false){
              return buffer[pointer - 1];
          } else{
              return buffer[key];
          }
      },
      push : function(item){
        buffer[pointer] = item;
        pointer = (pointer + 1) % length;
        return item;
      },
      min  : function(){return Math.min.apply(Math, buffer);},
      sum  : function(){return buffer.reduce(function(a, b){ return a + b; }, 0);},
      avg : function(){return sum/length ; }
    };
  };
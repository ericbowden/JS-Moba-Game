window.requestAnimFrame = (function(callback){
   return window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   function(callback){
      window.setTimeout(callback, 1000 / 60);
   };
})();
 
function animate(lastTime, stage){
   // update
   var date = new Date();
   var time = date.getTime();
   var timeDiff = time - lastTime;
   
   // log fps
   var fps = 1000 / timeDiff;
   var spf = timeDiff / 1000;

   // Animate and move:
   var shape = stage.layers[0].getShapes()[0];
   var debugtext = "fps: " + Math.round(fps);
   //console.debug(shape.isRunning);
   //debugtext += " isRunning: " + shape.isRunning;
   
   if (stage.mousePos || stage.touchPos){
   
      var qSize = 32;
      var mX = stage.mousePos.x || stage.touchPos.x;
      var mY = stage.mousePos.y || stage.touchPos.y;
      
      var dX = mX - shape.x;
      var dY = mY - shape.y;
      
      //determine quadrant:
      var qX = 0, qY = 0;
      
      if (dX > qSize) qX = 1;
      if (dX < -1 * qSize) qX = -1;
      
      if (dY > qSize) qY = 1;
      if (dY < -1 * qSize) qY = -1;
      
      //determine the animation based on quadrant:
      //var origA = shape.currentAnimation;
   
      shape.isRunning = true;
      
      if (qX == -1 && qY == -1) shape.currentAnimation = shape.RUN_UL;
      if (qX == 0 && qY == -1) shape.currentAnimation = shape.RUN_U;
      if (qX == 1 && qY == -1) shape.currentAnimation = shape.RUN_UR;
      if (qX == 1 && qY == 0) shape.currentAnimation = shape.RUN_R;
      if (qX == 1 && qY == 1) shape.currentAnimation = shape.RUN_DR;
      if (qX == 0 && qY == 1) shape.currentAnimation = shape.RUN_D;
      if (qX == -1 && qY == 1) shape.currentAnimation = shape.RUN_DL;
      if (qX == -1 && qY == 0) shape.currentAnimation = shape.RUN_L;
      if (qX == 0 && qY == 0){
         shape.isRunning = false;
         shape.canRun = false;
         if (shape.currentAnimation < shape.SIT)
            shape.currentAnimation = shape.SIT;
      }
      
      //debugtext += " animation: " + shape.currentAnimation;
      
      if (shape.canRun){
         if (shape.isRunning){
            var speed = shape.speed; //px/sec
            var dist = Math.sqrt(dX * dX + dY * dY);
            var incX = (speed * dX / dist) * spf;
            var incY = (speed * dY / dist) * spf;

            shape.x += incX;
            shape.y += incY;
            
            shape.x = Math.round(shape.x);
            shape.y = Math.round(shape.y);
         }
      } else if(shape.currentAnimation < shape.SIT){
         shape.currentAnimation = shape.WAKE;
      }
   } else { //no mouse, start resting/sleeping 
      if (shape.isRunning){
         shape.isRunning = false;
         shape.currentAnimation = shape.SIT;
         shape.canRun = false;
      }
   }
  
   shape.animate(timeDiff);
   
   stage.layers[0].getShapes()[1].text = debugtext;
   
   // draw
   stage.draw();

   // request new frame
   requestAnimFrame(function(){
      animate(time, stage);
   });
};

Kinetic.Sprite = function (obj) {
	console.log(obj);
	

}

Kinetic.Animation = function (obj) {
	//console.log(obj);
	for(var prop in obj)
		this[prop] = obj[prop]
	console.log(this);
}

function nekoF() {
  // var stage = new Kinetic.Stage("container", 320, 320);
   //var container = stage.getContainer();

   var nekoSprite = new Kinetic.Sprite({
      animations: [
         new Kinetic.Animation({ //run up - 0
            frames: [
               {   image: images.neko, imageData: [2 * 32, 1 * 32, 32, 32]   },
               {   image: images.neko,   imageData: [2 * 32, 0 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){//nekoSprite.currentAnimation = 1;    },
            speed: 250,
            currFrame: 0
         }),
         
         new Kinetic.Animation({ //run up/right - 1
            frames: [
               {   image: images.neko, imageData: [3 * 32, 1 * 32, 32, 32]   },
               {   image: images.neko,   imageData: [4 * 32, 0 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){//nekoSprite.currentAnimation = 1;    },
            speed: 250,
            currFrame: 0
         }),
         
         new Kinetic.Animation({ //run right - 2
            frames: [
               {   image: images.neko,   imageData: [3 * 32, 2 * 32, 32, 32] },
               {   image: images.neko,   imageData: [4 * 32, 2 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){               //nekoSprite.currentAnimation = 1;                },
            speed: 250,
            currFrame: 0
         }),
         
         new Kinetic.Animation({ //run down/right - 3
            frames: [
               {   image: images.neko,   imageData: [3 * 32, 3 * 32, 32, 32] },
               {   image: images.neko,   imageData: [4 * 32, 4 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){               //nekoSprite.currentAnimation = 1;                },
            speed: 250,
            currFrame: 0
         }),

         new Kinetic.Animation({ //run down - 4
            frames: [
               {   image: images.neko,   imageData: [2 * 32, 3 * 32, 32, 32] },
               {   image: images.neko,   imageData: [2 * 32, 4 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){               //nekoSprite.currentAnimation = 1;                },
            speed: 250,
            currFrame: 0
         }),

         new Kinetic.Animation({ //run down/left - 5
            frames: [
               {   image: images.neko,   imageData: [1 * 32, 3 * 32, 32, 32] },
               {   image: images.neko,   imageData: [0 * 32, 4 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){               //nekoSprite.currentAnimation = 1;                },
            speed: 250,
            currFrame: 0
         }),

         new Kinetic.Animation({ //run left - 6
            frames: [
               {   image: images.neko,   imageData: [1 * 32, 2 * 32, 32, 32] },
               {   image: images.neko,   imageData: [0 * 32, 2 * 32, 32, 32]   }
            ],
            loop: true,
            storyLine: [0, 1],
            //callBack: function(){               //nekoSprite.currentAnimation = 1;                },
            speed: 250,
            currFrame: 0
         }),   

         new Kinetic.Animation({ //run left/up - 7
            frames: [
               {   image: images.neko,   imageData: [1 * 32, 1 * 32, 32, 32] },
               {   image: images.neko,   imageData: [0 * 32, 0 * 32, 32, 32]   }
            ],
            //loop: true,
            storyLine: [0, 1],
            //callBack: function(){               //nekoSprite.currentAnimation = 1;                },
            speed: 250,
            currFrame: 0
         }),   

         new Kinetic.Animation({ //sit - 8
            frames: [ {   image: images.neko, imageData: [1 * 32, 0 * 32, 32, 32]   } ],
            //loop: true,
            //storyLine: [0, 1, 0, 1, 0, 1],
            callBack: function(){   nekoSprite.currentAnimation = 10; },
            speed: 2000,
            currFrame: 0
         }),

         new Kinetic.Animation({ //wake up - 9
            frames: [ {   image: images.neko, imageData: [2 * 32, 2 * 32, 32, 32]   } ],
            //loop: false,
            //storyLine: [0, 1, 0, 1, 0, 1],
            callBack: function(){   nekoSprite.canRun = true; },
            speed: 1000,
            currFrame: 0
         }),
         
         new Kinetic.Animation({ //scratch - 10
            frames: [
               {   image: images.neko, imageData: [0 * 32, 3 * 32, 32, 32]   },
               {   image: images.neko,   imageData: [4 * 32, 3 * 32, 32, 32]   },
               {   image: images.neko, imageData: [1 * 32, 0 * 32, 32, 32]   }
            ],
            //loop: true,
            storyLine: [0, 1, 0, 1, 2, 2, 2, 2, 0, 1, 0, 1, 0, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2],
            callBack: function(){ nekoSprite.currentAnimation = 11; },
            speed: 150,
            currFrame: 0
         }),
         
         new Kinetic.Animation({ //yawn - 11
            frames: [ {   image: images.neko, imageData: [3 * 32, 0 * 32, 32, 32]   } ],
            //loop: false,
            //storyLine: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            callBack: function(){ nekoSprite.currentAnimation = 12; },
            speed: 2000,
            currFrame: 0
         }),

         new Kinetic.Animation({ //sleep - 12
            frames: [
               {   image: images.neko, imageData: [0 * 32, 1 * 32, 32, 32]   },
               {   image: images.neko,   imageData: [4 * 32, 1 * 32, 32, 32]   }
            ],
            //loop: true,
            //storyLine: [0, 1],
            //callBack: function(){               nekoSprite.currentAnimation = 0;               },
            speed: 800,
            currFrame: 0
         })
         
      ],
      currentAnimation: 8
      });
      
   nekoSprite.speed = 50;
   
   nekoSprite.RUN_U = 0;
   nekoSprite.RUN_UR = 1;
   nekoSprite.RUN_R = 2;
   nekoSprite.RUN_DR = 3;
   nekoSprite.RUN_D = 4;
   nekoSprite.RUN_DL = 5;
   nekoSprite.RUN_L = 6;
   nekoSprite.RUN_UL = 7;
   nekoSprite.SIT = 8;
   nekoSprite.WAKE = 9;
   nekoSprite.SCRATCH = 10;
   nekoSprite.YAWN = 11;
   nekoSprite.SLEEP = 12;
   
   nekoSprite.isRunning = false;
   nekoSprite.canRun = false;
   
   var debug = new Kinetic.Shape(function(){
         var context = this.getContext();
         context.font = "10pt Calibri";
         context.fillStyle = "#888";
         context.textBaseline = "top";
         context.fillText(debug.text, 10, 300);
   });

   // add custom property
   debug.text = "Welcome!";

    var layer = new Kinetic.Layer();
    layer.add(nekoSprite);
   layer.add(debug);

   CANVAS.add(layer);
   
   
   // stage.on("mousemove", function(){
        // alert("mouse!");
            // });

   animate(new Date().getTime(), CANVAS);
};
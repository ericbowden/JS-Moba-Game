//animations
window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 30);
    };
})();

function animate(lastTime){
	//if(ANIMATE) {
	// update
	var date = new Date();
    var time = date.getTime();
    var timeDiff = time - lastTime;
	//timeDiff/1000; //times per second, our period
	
    // clear
	lastTime = time;
	
    // draw
	BOARD.stage.draw();
	//BOARD.stage.getLayer('buildLayer').draw();
	//BOARD.stage.getLayer('unitsLayer').draw();
	//BOARD.stage.getLayer('animLayer').draw();
	//BOARD.unitsLayer.draw();
	//}
	// request new frame
	requestAnimFrame(function(){
		animate(lastTime);
	});
}

function OnTimerTick(){
	if(PAUSE)
		return;
	/*if(Math.floor(Math.random()*2)){
		for (var i = 0; i < UNIT_MAP.length; i++) {
			var unit = UNIT_MAP[i];
		
			unit.Act();
			//unit.MoveTo();
			//unit.Sync();
			unit.SyncShape();
			unit.CheckDead(); //removes if dead
		}
	}
	else{
		for (var i = UNIT_MAP.length-1; i >= 0; i--) {
			var unit = UNIT_MAP[i];
		
			unit.Act();
			//unit.MoveTo();
			//unit.Sync();
			unit.SyncShape();
			unit.CheckDead(); //removes if dead
		}
	}
	for (var i = 0; i < BUILDING_MAP.length; i++) {
		if(!BUILDING_MAP[i].CheckDead())
			BUILDING_MAP[i].CreateUnit();
	}
	*/
	
	for (var i in UNIT_MAP) {
			var unit = UNIT_MAP[i];
			
			unit.Act();
			//unit.MoveTo();
			//unit.Sync();
			unit.SyncShape();
			unit.CheckDead(); //removes if dead
		}
	
	for (var i in BUILDING_MAP) {
		//console.log(i);
		if(!BUILDING_MAP[i].CheckDead())
			BUILDING_MAP[i].CreateUnit();
	}

	$("#debug-p1-gold").html(PLAYER1.gold);
	$("#debug-p2-gold").html(PLAYER2.gold);
	ANIMATE = true;
	//CANVAS.draw();
}

function C_KeyDown(code) {
	
	//console.log(code);
	
	/*if (code == 38) unit1.Move('up');
	if (code == 37) unit1.Move('right');
	if (code == 39) unit1.Move('left');
	if (code == 40) unit1.Move('down');*/
	
	/*if (code == 87) box2.Jump();
	if (code == 65) box2.SetRight(-1);
	if (code == 68) box2.SetRight(1);*/
}

function C_KeyUp(code) {
	/*if (code == 38) box.SetUp(0);
	if (code == 37) box.SetRight(0);
	if (code == 39) box.SetRight(0);
	
	if (code == 87) box2.SetUp(0);
	if (code == 65) box2.SetRight(0);
	if (code == 68) box2.SetRight(0);*/
}

function C_Save(){ 
	//localStorage['top'] = box.GetTop();
	//localStorage['left'] = box.GetLeft();
	//console.log('save');
}

function C_Load(){ 

	//box.SetTop(parseInt(localStorage['top']));
	//box.SetLeft(parseInt(localStorage['left']));
}

function C_New(){ 
	//console.log('new');
	//box.SetTop(200);
	//box.SetLeft(200);
	//localStorage.clear();
}

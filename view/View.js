$('html').keydown(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	C_KeyDown(code);
});

$('html').keyup(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	C_KeyUp(code);
});

 // Add a script element as a child of the body
 // Use this to 'lazy' load scripts after page load
 function loadJSScript(JSscript, callBack) {
	var js = document.createElement("script");
	//js.type= 'text/javascript';
	js.src = JSscript;
	document.head.appendChild(js);

    js.onload = function () {
        console.log('JS onload fired');
		callBack();
		//removes the call once loaded, script will remain in memory
		//document.head.removeChild(js); 
    }
 }

function loadImages(sources, callback){
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
    
    //callback(images);
}

$(document).ready(function(){ //main function
	var scripts = [];
	//loadJSScript('./Debug.js');
	
	var imgPath = "./Images/";
	var sources = {
		sword: imgPath+"swordsman.png",
		//swordblue: imgPath+"swordsman.png",
		archer: imgPath+"archer.png",
		mage: imgPath+"mage.png",
		neko: imgPath+"neko.png",
		background: imgPath+"back.png",
		blueb: imgPath+"blueb.png",
		redb: imgPath+"redb.png",
		
	};
	
	loadImages(sources, doneLoading);
});
	
function doneLoading(images) {
	
	IMAGES = images;
	UNIT_MAP = {};
	BUILDING_MAP = {};
	
	BUILDING_RED_COUNT = 0;
	BUILDING_BLUE_COUNT = 0;
	//BUILDING_ORANGE_COUNT = 0;
	//UNIT_ORANGE_COUNT = 0;
	
	UNIT_RED_COUNT = 0;
	UNIT_BLUE_COUNT = 0;
	
	PLACE_BUILDING = false;
	BUILDING_TYPE = false;
	CURRENT_PLAYER = false;
	MENU_CLICKED = false;
	
	var fps = 25; //i fixed the fps
	
	new Board(({
		id: 'BOARD',
		rowNum: 20,
		colNum: 60,
		top: 10,
		left: 250,
		color: 'gray',
		cellSize: 16, //px by px
	}));
	
	//$('#BOARD').append($('<div></div>').attr('id','units')); //creates units div
	//$('#BOARD').append($('<div></div>').attr('id','buildings')); //creates buildings div
	
	new Menu(({
		id: 'MENU',
		top: BOARD.top+BOARD.height,
		left: BOARD.left,
		height: 50,
		width: BOARD.width,
		color: 'black',
	}));
	
	new MenuElement(({
		id: 'menuEl',
		height: 30,
		width: 30,
		color: 'green',
		type: 'sword',
	}));
	
	new MenuElement(({
		id: 'menuEl2',
		height: 30,
		width: 30,
		color: 'green',
		type: 'archer',
	}));
	
	new MenuElement(({
		id: 'menuEl3',
		height: 30,
		width: 30,
		color: 'green',
		type: 'mage',
	}));
	
	new Player(({
		id: 'PLAYER1',
		team: 'red',
		gold: 200,
	}));
	
	new Player(({
		id: 'PLAYER2',
		team: 'blue',
		gold: 200,
	}));
	
	CURRENT_PLAYER = PLAYER1;
	
	BUILDING_TYPE='sword';
	PLAYER1.PlaceBuilding(Math.floor(BOARD.rowNum/2),3)
	BUILDING_TYPE='sword';
	PLAYER2.PlaceBuilding(Math.floor(BOARD.rowNum/2),BOARD.colNum-3)
	/*
	for(var i = 0; i < 500; i++) {
		var randVar = Math.ceil(Math.random()*10);
		var imgPath = (randVar > 5)?'./images/archer.png': './images/swordsman.png';
		var id = (randVar > 5) ?'unit_blue'+i: 'unit_red'+i
		var unit = new Unit(({
			id: id,
			board: BOARD,
			map: UNIT_MAP,
			row: 4,
			col: (randVar > 5) ?35: 5,
			size: (randVar > 5)?1:1,
			unitImg: imgPath,//'RGB'(size*10),
			team: (randVar > 5) ?'blue': 'red',
			moveWait: 0,
			maxHP: 10,
			dmg:	2,
			sight:	3,
			range:	1,
			attackWait: 5,
		}));

		UNIT_MAP[unit.id] = unit;
	}//*/
	
	//Uncomment to turn on debug
	Debug();
	
	$("#button-save").click(function(){ 
		C_Save();
	});

	$("#button-load").click(function(){ 
		C_Load();
	});

	$("#button-new").click(function(){ 
		C_New();
	});
	
	TimerTick = setInterval(OnTimerTick, parseInt(1000/fps));
	
	var date = new Date();
    var time = date.getTime();
	animate(time);
}

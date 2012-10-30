$('html').keydown(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	C_KeyDown(code);
});

$('html').keyup(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	C_KeyUp(code);
});

function Paint(obj){
	obj.Sync();
}

$(document).ready(function(){ //main function

	var fps = 25;
	
	//instantiates Box class
	new M_Box(({	
		id: 'box',
		height: 20, //automatically sets css and position
		width: 20,
		color: 'red',
		top: 200,
		left: 200,	
	}));
	
	//box2 = 
	new M_Box(({	
		id: 'box2',
		height: 20, //automatically sets css and position
		width: 20,
		color: 'blue',
		top: 200,
		left: 500,	
	}));
	
	new M_Ground(({
		id: 'ground1',
		height: 20, //automatically sets css and position
		width: 100,
		color: 'black',
		top: 250,
		left: 120,
	}));
	
	new M_Ground(({
		id: 'ground2',
		height: 20, //automatically sets css and position
		width: 100,
		color: 'black',
		top: 250,
		left: 250,
	}));
	
	new M_Ground(({
		id: 'ground3',
		height: 20, //automatically sets css and position
		width: 300,
		color: 'black',
		top: 250,
		left: 450,
	}));

	$("#button-save").click(function(){ 
		C_Save();
	});

	$("#button-load").click(function(){ 
		C_Load();
	});

	$("#button-new").click(function(){ 
		C_New();
	});
	
	setInterval(OnTimerTick, parseInt(1000/fps));
});

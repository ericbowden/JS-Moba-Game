function OnDebugTick(){

	//debugging
	if(typeof DEBUG != "undefined" && DEBUG)
		BOARD.RefreshArray();
		
}

function Debug(){
	
	//fps stat---------------------------
	var stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	stats.domElement.id = 'statsJS';
	$('html').append( stats.domElement );
	setInterval( function () {
		stats.update();
	}, 1000 / 60 );
	
	
	$("#debug-building-team").change(function(){ 
		if($('#debug-building-team').val() == 'player1')
			CURRENT_PLAYER = PLAYER1
		else
			CURRENT_PLAYER = PLAYER2;
	});
	
	//debug checkbox-------------------------
	$("#debug-box").click(function(){ 
		if($('#debug-box').is(':checked')) {
			DEBUG = true;
			BOARD.DrawArray();
			DEBUG_INTERVAL = setInterval(OnDebugTick, 300); //starts debug interval
		}
		else {
			DEBUG = false;
			BOARD.DeleteArray();
			clearInterval(DEBUG_INTERVAL);
		}
	});
	
	//pause checkbox-------------------------------
	PAUSE = false;
	$("#debug-pause").click(function(){ 
		if($('#debug-pause').is(':checked')) {
			PAUSE = true;	
		}
		else {
			PAUSE = false;
		}
	});
	
	//place checkbos-------------------------------
	DEBUG_PLACE = false;
	$("#debug-place").click(function(){ 
		if(DEBUG_PLACE) {
			DEBUG_PLACE = false;
		}
		else {
			DEBUG_PLACE = true;
		}
	});
	
	//when user presses a debugkey-------------------------------------------
	$('html').keydown(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		//console.log(code);
		
		//if p
		if(code == 80) {
			if(PAUSE) {
				PAUSE = false;
				$("#debug-pause").prop("checked", false);
			} else { 
				PAUSE = true;
				$("#debug-pause").prop("checked", true);
			}
		}
	});
}

//prototype adds to Board class for debugging purposes
Board.prototype.DrawArray= function(){

	var debugBoard = $('<div></div>').attr('id','debug-board');
	
	$('#BOARD').append(debugBoard);
	$('#debug-board')[0].style.cssText = $('#BOARD')[0].style.cssText;
	$('#debug-board').css({left:0,top:0,'z-index':2});

	for (var r = 0; r < this.rowNum; r++)
		for (var c = 0; c < this.colNum; c++) {
			var gridColor;
	
			/*if(this.array[r][c] == 0)
				gridColor = 'green';
			else if (this.array[r][c] == 1)
				gridColor = 'yellow';
			else if (this.array[r][c].match('unit_red'))
				gridColor = 'red';
			else if (this.array[r][c].match('unit_blue'))
				gridColor = 'blue';*/
				
			var grid = $('<div></div>').attr('id','debug-grid-'+r+'-'+c)
			grid.css({
				
				//'background-color':gridColor,
				height: this.cellSize,
				width: this.cellSize,
				float: 'left',
				'box-shadow': 'inset 0 0 1px #000000',
				'z-index': '2 !important',
			});
			
			$('#debug-board').append(grid); 
			
		}

};

Board.prototype.RefreshArray = function(){
	for (var r = 0; r < this.rowNum; r++)
		for (var c = 0; c < this.colNum; c++) {
			var gridColor = this.array[r][c];
			if(this.array[r][c] == 0)
				gridColor = 'green';
			else if (this.array[r][c] == 1)
				gridColor = 'yellow';
			else if (this.array[r][c].match('unit_red'))
				gridColor = 'red';
			else if (this.array[r][c].match('unit_blue'))
				gridColor = 'blue';
			else if (this.array[r][c].match('building_red'))
				gridColor = '#6d0019';
			else if (this.array[r][c].match('building_blue'))
				gridColor = '#0F0068';
			
				
			$('#debug-grid-'+r+'-'+c).css('background-color',gridColor);
		}

};

Board.prototype.DeleteArray = function(){
	//for (var r = 0; r < this.rowNum; r++)
	//	for (var c = 0; c < this.colNum; c++)
	//		$('#grid-'+r+'-'+c).remove();
	$('#debug-board').remove();
};

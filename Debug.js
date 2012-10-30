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
	$('html').append( stats.domElement );
	setInterval( function () {
		stats.update();
	}, 1000 / 60 );
	
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
	
	//radio
	DEBUG_PLACE_B = true;
	DEBUG_PLACE_U = false;
	$(".debug-radio").click(function(){ 
		if(DEBUG_PLACE_B) {
			DEBUG_PLACE_U = true;	
			DEBUG_PLACE_B = false;
		}
		else {
			DEBUG_PLACE_U = false;
			DEBUG_PLACE_B = true;
		}
	});
	
	//tracks mouse movements on board-------------------------
	$('#BOARD').mousemove(function(e){
		var thisObj = window[this.id];
			
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var row = Math.floor(y/thisObj.cellSize);
		var col = Math.floor(x/thisObj.cellSize);
		
		/*
		if(!DEBUG_PLACE)
			for(var i = 0; i < UNIT_ARRAY.length; i++) {			
				UNIT_ARRAY[i].SetMoveTo(row,col);
				//UNIT_ARRAY[i].PathFind(row,col);		
			}//*/
	});
	
	//tracks where user clicked on board---------------------------------------
	$("#BOARD").click(function(e){
		var thisObj = window[this.id];
		
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var row = Math.floor(y/thisObj.GetCellSize());
		var col = Math.floor(x/thisObj.GetCellSize());
		
		if(DEBUG_PLACE) {
			//console.log('first');
			//DEBUG_PLACE = true;
			//$('#debug-place').is(':checked')
			$("#debug-place").prop("checked", true);
			
			if(thisObj.GetCell(row,col) == 0) {
			
				var size = parseInt($('#debug-building-size').val());
				var unitSize = parseInt($('#debug-building-unitSize').val());
				var spawnSide = $('#debug-building-spawnSide').val();
				var unitType = $('#debug-building-unitType').val();
				var team = $('#debug-building-team').val();
				var spawnDelay = parseInt($('#debug-building-spawnDelay').val());
				var unitSpeed = parseInt($('#debug-building-unitSpeed').val());
				var unitAttack = parseInt($('#debug-building-unitAttack').val());
				var destC = parseInt($('#debug-building-destC').val());
				var destR = parseInt($('#debug-building-destR').val());
				var sight = parseInt($('#debug-building-sight').val());
				var vRange = parseInt($('#debug-building-vRange').val());
				var hp = parseInt($('#debug-building-hp').val());;
				
				var imgPath = './Images/'+unitType+'.png';	
				if(unitType=='sword')
					imgPath = './Images/swordsman.png';
				else if(unitType=='archer'){
					imgPath = './Images/archer.png';
					vRange = 3;
				}
				else if(unitType=='mage')
					imgPath = './Images/mage.png';		
					
				if(DEBUG_PLACE_B){
					//console.log(size, unitSize, spawnSide, unitType, team, imgPath);
					var countId = 'BUILDING_'+team.toUpperCase()+'_COUNT';
					var buildingId = 'building_'+team+window[countId];
					
					new Building({
						id: buildingId,
						board: BOARD,
						unitArray: UNIT_ARRAY,
						buildingArray: BUILDING_ARRAY,
						unitSize: unitSize,
						row: row, 
						col: col, 
						size: size, 
						spawnSide: spawnSide, 
						unitType: unitType, 
						unitImg: imgPath, 
						team: team,
						spawnDelay: spawnDelay,
						unitSpeed: unitSpeed,
						destinationC: destC,
						destinationR: destR,
						maxHP: 100,
						attackWait: unitAttack,
					}); 

					//console.log(buildingId);
					var thisBuilding = window[buildingId];
					BUILDING_ARRAY.push(thisBuilding);
					//thisBulding.CreateUnit();
					
					window[countId]++;
				} else if(DEBUG_PLACE_U) {
				
					var countId = 'UNIT_'+team.toUpperCase()+'_COUNT';					
					var unitId = "unit_"+team+unitType+window[countId];
					window[countId]++; //increment count
					
					new Unit(({
						id: unitId,
						array: UNIT_ARRAY,
						board: BOARD,
						row: row,
						col: col,
						size: unitSize,
						unitImg: imgPath,
						team: team,
						moveWait: unitSpeed,
						maxHP: hp,
						dmg:	2,
						sight:	sight,
						range:	vRange,
						attackWait: unitAttack,
					}));
					UNIT_ARRAY.push(window[unitId]);
					//window[unitId].SetMoveTo(destR, destC);
				}
				
				
				/*$('#box-'+row+'-'+col).click(function(e){
					console.log(unitSize);
					
					if(DEBUG_PLACE) {
						for(var r = 0; r < unitSize; r++)
							for(var c = 0; c < unitSize; c++)
								thisObj.array[row+r][col+c] = 0;
						
						$('#box-'+row+'-'+col).remove();
						DEBUG_REMOVE = true;	
					}
				});		*/	
			} 		
		} else {
			//DEBUG_REMOVE = false;
			$('#debug-building-destR').val(row);
			$('#debug-building-destC').val(col);
		}

		//UNIT_ARRAY[i].SetMoveTo(row,col);
		
		console.log('cell['+row+']['+col+']'+', '+thisObj.GetCell(row,col));
	});
	
	//when user presses a debugkey-------------------------------------------
	$('html').keydown(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		//console.log(code);
		
		//z
		if(code == 90) {
			//console.log(DEBUG_PLACE)
			if(DEBUG_PLACE) {
				DEBUG_PLACE = false;
				$("#debug-place").prop("checked", false);
			}
			else {
				DEBUG_PLACE = true;
				$("#debug-place").prop("checked", true);
			}
			
		}
		
		//a is pressed
		if(code == 65) {
				DEBUG_PLACE_B = true;
				DEBUG_PLACE_U = false;
				$('input:radio[name="radio-place"]').filter('[value="building"]').attr('checked', true);
			
		}
		//if s
		if(code == 83) {
				DEBUG_PLACE_B = false;
				DEBUG_PLACE_U = true;
				$('input:radio[name="radio-place"]').filter('[value="unit"]').attr('checked', true);
			
		}
		
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
/*
	id: player#;
	team: team;
	human: comp/human;
	gold: ;
*/
Player = Class.extend({
	init: function(args){
	
		for (var prop in args)
			this[prop] = args[prop];
			
		window[this.id] = this;
	
	},
	
	Buy: function(type){
		if(this.gold >= Building.prototype.GetPrice(type)){
			PLACE_BUILDING=true;
			BUILDING_TYPE=type;
		}
	},
	
	//validate building placement
	ValidatePlacement: function(row,col,size) {
	
		//var validPlacement = true;
		if(this.team=='red' && col+size >= Math.floor(BOARD.colNum/2))
			return false;
		if(this.team=='blue' && col-size <= Math.ceil(BOARD.colNum/2))
			return false;
		for(var i=0; i<size; i++){
			for(var j=0; j<size; j++){
				//console.log(""+(i+row-Math.floor(size/2))+","+(j+col-Math.floor(size/2)))
				if(BOARD.GetCell(i+row-Math.floor(size/2),j+col-Math.floor(size/2))!=0){
					return false;
				}
			}
		}
		return true;
	},
	
	PlaceBuilding: function(row,col,size){
		var unitType = BUILDING_TYPE;
		var size = 4;
		
		if(this.ValidatePlacement(row,col,size)){
			var spawnSide = this.team=='red'?'right':'left';
			var spawnDelay;
			var destC = this.team=='red'?BOARD.colNum-3:3;
			var destR = Math.floor(BOARD.rowNum/2);
			
			if(unitType=='sword'){
				spawnDelay = 65;
			}
			else if(unitType=='archer'){
				spawnDelay = 90;
			}
			else if(unitType=='mage'){
				spawnDelay = 120;
			}
			
			//console.log(size, unitSize, spawnSide, unitType, team, unitImg);
			var countId = 'BUILDING_'+this.team.toUpperCase()+'_COUNT';
			var buildingId = 'building_'+this.team+window[countId];
				
			var thisBuilding = new Building({
				id: buildingId,
				board: BOARD,
				unitMap: UNIT_MAP,
				buildingMap: BUILDING_MAP,
				row: row-Math.floor(size/2), 
				col: col-Math.floor(size/2), 
				size: size,
				spawnSide: spawnSide, 
				unitType: unitType,  
				team: this.team,
				spawnDelay: spawnDelay,
				destinationC: destC,
				destinationR: destR,
				maxHP: 1000,
			}); 
			BUILDING_MAP[thisBuilding.id] = thisBuilding;
				
			window[countId]++;
			this.gold -= Building.prototype.GetPrice(unitType);
			return true;
		}
		return false
	},
	
});
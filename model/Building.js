/* args
id: buildingId,
board: BOARD,
unitMap: UNIT_MAP,
buildingMap: BUILDING_MAP,
row: row, 
col: col, 
size: size, 
spawnSide: spawnSide, 
unitType: unitType, 
team: team,
spawnDelay: spawnSpeed,
destinationC: this.destinationC,
destinationR: this.destinationR,
maxHP:	x,
*/
var Building = Class.extend({

	init: function(args){
		
		//this.appendTo = '#buildings';
		this.height = args.size*args.board.GetCellSize();
		this.width = args.size*args.board.GetCellSize();
		this.top = args.row*args.board.GetCellSize(); 
		this.left = args.col*args.board.GetCellSize();
		this.css = {'z-index':1, 'background-color': args.team};
		this.spawnDelayCounter = 0;
		this.currHP = args.maxHP;

		//this._super(args);
		for (var prop in args)
			this[prop] = args[prop];
		//window[this.id] = this; 
		
		this.SetPos(this.row,this.col); //sets
		this.AddShape();
	},

	SetPos: function(t_row,t_col){
	
		//clear old pos
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
		
		this.row = t_row;
		this.col = t_col;
		
		//add new to this.board
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, this.id);
	},
	
	AddShape: function() {
	
		var team = this.team;
		var row = this.row;
		var col = this.col;
		var top = this.top;
		var left = this.left;
		var width = this.width;
		var height = this.height;
	
		this.shape = new Kinetic.Shape(function(){
			//console.log(IMAGES[team+'b'], col, row);
                var context = this.getContext();
                context.drawImage(IMAGES[team+'b'], left, top,width, height);
                // draw invisible detectable path for image
                context.beginPath();
                context.rect(left, top, width, height);
				context.stroke();
                context.closePath();
            },this.id);
	
		this.board.buildLayer.add(this.shape);
	},
	
	//overloads remove in super
	Remove: function () {
		//clear old pos
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
		//this.buildingMap.splice(this.buildingMap.indexOf(this),1); //removes from buildingMap
	
		this.board.buildLayer.remove(this.shape);
	
		//calls remove class in super
		//this._super();
		delete this.buildingMap[this.id];
		
	},
	
	CreateUnit: function(){
	
		//creates single unit for debuggin
		//if(UNIT_RED_COUNT+UNIT_BLUE_COUNT > 0)
		//	return;
	
		//'slows' unit creation to spawn speed
		if(this.spawnDelayCounter < this.spawnDelay) {
			this.spawnDelayCounter++;
			return;
		}
		//resets move wait
		this.spawnDelayCounter = 0;
	
		var r;
		var c;
		if(this.spawnSide == 'left'){
			r = this.row+parseInt(this.size/2);
			c = this.col - 2;
		}
		else{
			r = this.row+parseInt(this.size/2);
			c = this.col + this.size + 1;
		}
		
		var countId = 'UNIT_'+this.team.toUpperCase()+'_COUNT';	
		var unitId = "unit_"+this.team+this.unitType+window[countId];
		window[countId]++; //increment count
		var unitMoveRate;
		var unitAttkRate;
		var unitDmg;
		var unitHP;
		var unitSight;
		var unitRange;
		var unitImg;
		var unitSize;
		var unitType;
		
		if(this.unitType=='sword'){
			unitRange = 1;
			unitSight = 3;
			unitMoveRate = 12;
			unitAttkRate = 4;
			unitDmg = 7;
			unitHP = 47;
			unitImg = IMAGES.sword.src;//this.team=='red'?IMAGES.swordred.src:IMAGES.swordblue.src;
			unitSize = 1;
		}
		else if(this.unitType=='archer'){
			unitRange = 3;
			unitSight = 5;
			unitMoveRate = 10;
			unitAttkRate = 8;
			unitDmg = 4;
			unitHP = 35;
			unitImg = './Images/archer.png';
			unitSize = 1;
		}
		else if(this.unitType=='mage'){
			unitRange = 5;
			unitSight = 6;
			unitMoveRate = 12;
			unitAttkRate = 10;
			unitDmg = 5;
			unitHP = 15;
			unitImg = './Images/mage.png';
			unitSize = 1;
		}
		
		var unit = new Unit(({
			id: unitId,
			unitMap: this.unitMap,
			buildingMap: this.buildingMap,
			board: this.board,
			row: r,
			col: c,
			size: unitSize,
			unitImg: unitImg,
			team: this.team,
			moveWait: unitMoveRate,
			maxHP: unitHP,
			dmg:	unitDmg,
			sight:	unitSight,
			range:	unitRange,
			attackWait: unitAttkRate,
			unitType: this.unitType,
		}));
		this.unitMap[unit.id] = unit;
		
		//sends unit off
		unit.SetMoveTo(this.destinationR,this.destinationC);
	},
	
	GetMaxHP: function(){
		return this.maxHP;
	},
	
	GetCurrentHP: function(){
		return this.currHP
	},
	
	TakeDamage: function(dmg){
		this.currHP -= dmg;
		//console.log(this.id, this.currHP);
	},
	
	CheckDead: function(){
		if(this.currHP <= 0) {
			this.Remove();
            this.team=='red'?PLAYER2.gold+=100:PLAYER1.gold+=100;
			return true;
		}
		return false;
	},
	
	GetPrice: function(unitType) {

		if(typeof unitType == "undefined")
			return this.unitType;
		
		if(unitType == 'sword')
			return 100;
		if(unitType == 'archer')
			return 125;
		if(unitType == 'mage')
			return 150;
}
});


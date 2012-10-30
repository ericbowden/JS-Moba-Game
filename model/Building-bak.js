/* args
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
unitImg: unitImg, 
team: team,
spawnSpeed: spawnSpeed,
unitSpeed: unitSpeed,
destinationC: this.destinationC,
destinationR: this.destinationR,
maxHP:	x,
*/
var Building = Class.extend({

	init: function(args){
	
		//sets properties to ones in args
		for (var prop in args) {
			this[prop] = args[prop];
		}
		this.currHP = this.maxHP;
		//this.unitArray = args.array;
		//this.board = args.board
	
		//this.id = args.id; //id of div	
		this.CreateEl();
		//this.row = args.row;
		//this.col = args.col;
		//this.size = args.size;
		//this.spawnSide = args.spawnSide;
		//this.spawnSpeed = args.spawnSpeed;
		//this.unitSpeed = args.unitSpeed;
		//this.unitType = args.unitType;
		//this.imgPath = args.imgPath;
		//this.unitSize = args.unitSize;
		//this.team = args.team;
		this.spawnDelayCounter = 0;
		this.height = this.size*this.board.GetCellSize();
		this.width = this.size*this.board.GetCellSize();
		this.top = this.row*this.board.GetCellSize(); //this.board.GetTop() + 
		this.left = this.col*this.board.GetCellSize();
		$('#'+this.id).css({'background-color':'black','position':'absolute', 'z-index':1});

		this.SetPos(this.row,this.col);
		this.Sync();
	},

	CreateEl: function(){
		window[this.id] = this; //adds element to window
		var el = $('<div></div>').attr('id',this.id);
		
		$('#buildings').append(el);
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
	
	Remove: function () {
		//clear old pos
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
	
		$('#'+this.id).remove(); //removes from document
		this.buildingArray.splice(this.buildingArray.indexOf(this),1); //removes from buildingArray
		delete window[this.id]; //removes from window
	},
	
	CreateUnit: function(){
	
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
			c = this.col - this.unitSize - 1;
		}
		else{
			r = this.row+parseInt(this.size/2);
			c = this.col + this.size + 1;
		}
		
		var countId = 'UNIT_'+this.team.toUpperCase()+'_COUNT';	
		var unitId = "unit_"+this.team+this.unitType+window[countId];
		window[countId]++; //increment count
		
		new Unit(({
			id: unitId,
			array: this.unitArray,
			board: this.board,
			row: r,
			col: c,
			unitSize: this.unitSize,
			unitImg: this.unitImg,
			team: this.team,
			moveWait: this.unitSpeed,
			maxHP: 10,
			dmg:	2,
			sight:	3,
			range:	1,
			attackWait: this.attackWait,
		}));
		this.unitArray.push(window[unitId]);
		
		//sends unit off
		window[unitId].SetMoveTo(this.destinationR,this.destinationC);
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
			return true;
		}
		return false;
	},
	
	Sync: function () {
		$('#'+this.id).css({'top':this.top, 'left':this.left, 'width':this.width, 'height':this.height});
	},
});
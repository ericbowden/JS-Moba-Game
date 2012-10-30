/* args
id: unitId,
array: this.array,
board: this.board,
row: r,
col: c,
unitSize: this.unitSize,
unitImg: this.imgPath,
team: this.team, //and background color
moveWait: this.unitMoveWait //how many ticks before unit moves
maxHP: x;
dmg: x;
sight: x;
range: x; // x > 0
*/
var Unit = Class.extend({
	init: function(args){
	
		//sets properties to passed in args
		for (var prop in args) 
			this[prop] = args[prop];

		this.currHP = this.maxHP;
		//this.array = args.array;
		//this.board = args.board;	
		//this.id = args.id; //id of div	
		this.CreateEl();
		//this.row = args.row;
		//this.col = args.col;
		this.destinationR = this.row;
		this.destinationC = this.col;
		this.tempDestR = -1;
		this.tempDestC = -1;
		this.moveWaitCounter = 0; //wait counter
		this.attackWaitCounter = 0;
		//this.unitSize = args.unitSize; //grid by grid 
		//this.moveSpeed = args.moveSpeed;
		//set initiate pos on board
		this.SetPos(this.row, this.col);
		this.width = this.unitSize*this.board.GetCellSize();
		this.height = this.unitSize*this.board.GetCellSize();
		this.top = this.row*this.board.GetCellSize(); //this.board.GetTop() + 
		this.left = this.col*this.board.GetCellSize();
		$('#'+this.id).css({'background':'url('+args.unitImg+')'+args.team+' no-repeat','position':'absolute', 'z-index':1});
		this.Sync();
	},
	
	CreateEl: function(){
		window[this.id] = this; //adds element to window
		var el = $('<div></div>').attr('id',this.id);
		
		$('#units').append(el);
	},
	
	//this should overload the remove in Element.js
	Remove: function () {
		//clear old pos
		for (var r = 0; r < this.unitSize; r++)
			for (var c = 0; c < this.unitSize; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
	
		this.array.splice(this.array.indexOf(this),1);
		
		$('#'+this.id).remove(); //removes from document
		delete window[this.id]; //removes from window
	},
	
	SetPos: function(t_row,t_col){
	
		//clear old pos
		for (var r = 0; r < this.unitSize; r++)
			for (var c = 0; c < this.unitSize; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
		
		this.row = t_row;
		this.col = t_col;
		
		//add new to this.board
		for (var r = 0; r < this.unitSize; r++)
			for (var c = 0; c < this.unitSize; c++)
				this.board.SetCell(this.row+r, this.col+c, this.id);
	},
	
	Act: function(){
		var unit = this.SeekTarget();
		$('#'+this.id).show(); //makes unit blink when attacking
		if(unit != false && this.TargetInRange(unit)){
			//'slows' unit depending on attackSpeed
			if(this.attackWaitCounter < this.attackWait) {
				this.attackWaitCounter++;			
			}
			else{
				$('#'+this.id).hide(); //makes unit blink when attacking
				this.attackWaitCounter = 0;
				this.DoDamage(unit);
			}
		}
		else{
			//'slows' unit depending on moveSpeed
			if(this.moveWaitCounter < this.moveWait) {
				this.moveWaitCounter++;
			}
			else{
				this.moveWaitCounter = 0;
				this.MoveTo();
			}
		}
	},
	
	Move: function(dir){
			
		var horz = (dir == 'left' || dir == 'right')?1:0;
		var vert = (dir == 'up' || dir == 'down')?1:0;

		for(var i = 0; i < this.unitSize;i++)	 {
			var cellValue = this.board.GetCell(this.row+((vert)?((dir=='down')?this.unitSize:-1):i),this.col+((horz)?((dir=='left')?this.unitSize:-1):i));

			//if cell is occupied or is a boundary
			if(cellValue == 1 || (typeof window[cellValue] != "undefined" && window[cellValue].team == this.team)) {
				return false;
			} 
			
		}
				
		this.SetPos(this.row+((vert)?((dir=='down')?1:-1):0),this.col+((horz)?((dir=='left')?1:-1):0));
		this.top = this.row*this.board.GetCellSize();
		this.left = this.col*this.board.GetCellSize();
		
		return true;
		
		//this might be faster, less comparisions, KEEP IT!
		/*if(dir == 'left'){//left
				for(var i = 0; i < this.unitSize;i++)
					if(this.board.GetCell(this.row+i,this.col+this.unitSize)==1) 
						return false;
				
				this.SetPos(this.row, this.col+1);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		} else if(dir == 'right'){//right
				for(var i = 0; i < this.unitSize;i++)
					if(this.board.GetCell(this.row+i,this.col-1)==1) 
						return false;
					
				this.SetPos(this.row, this.col-1);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		}
		else if(dir == 'down'){//down
				for(var i = 0; i < this.unitSize;i++)
					if(this.board.GetCell(this.row+this.unitSize,this.col+i)==1)
						return false;
						
				this.SetPos(this.row+1, this.col);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		} else if(dir == 'up'){//up
				for(var i = 0; i < this.unitSize;i++)		
					if(this.board.GetCell(this.row-1,this.col+i)==1)
						return false;				
						
				this.SetPos(this.row-1, this.col);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		}*/
	
	},
	
	SetMoveTo: function(r,c){
		this.destinationR = r;
		this.destinationC = c;
	},
	
	SetTempMoveTo: function(r,c){
		this.tempDestR = r;
		this.tempDestC = c;
	},
	
	MoveTo: function(){
		var dx;
		var dy;
		if(this.tempDestR != -1 && this.tempDestC != -1){
			dy = this.tempDestR - this.row;
			dx = this.tempDestC - this.col;
		}
		else{
			dy = this.destinationR - this.row;
			dx = this.destinationC - this.col;
		}
		var vDir = (dy >= 0 ? 'down' : 'up');
		var xDir = (dx >= 0 ? 'left' : 'right');
		if(dy != 0)
			this.Move(vDir);
		if(dx != 0)
			this.Move(xDir);
		if(dy == 0 && dx == 0){
			this.moving = false;
		}
		else
			this.moving = true;
	},
	
	GetMaxHP: function(){
		return this.maxHP;
	},
	
	GetCurrentHP: function(){
		return this.currHP
	},
	
	TakeDamage: function(dmg){
		this.currHP -= dmg;
	},
	
	CheckDead: function(){
		if(this.currHP <= 0) {
			this.Remove();
			return true;
		}
		return false;
	},
	
	DoDamage: function(el){
		el.TakeDamage(this.dmg);
	},
	
	CheckForTarget: function(){
		var target;
		for(var i=1; i <= this.sight; i++){
			for(var j=-i;j<=i;j++){

				/*this.board.SetCell(this.row+i,this.col+j,'orange');
				this.board.SetCell(this.row+j,this.col+i,'orange');
				this.board.SetCell(this.row-i,this.col+j,'orange');
				this.board.SetCell(this.row+j,this.col-i,'orange');*/
				
				target = window[this.board.GetCell(this.row+i,this.col+j)];			
				if(typeof target != 'undefined' && target.team != this.team){
					return target;
				}
				
				target = window[this.board.GetCell(this.row+j,this.col+i)];			
				if(typeof target != 'undefined' && target.team != this.team){
					return target;
				}
				
				target = window[this.board.GetCell(this.row-i,this.col+j)];				
				if(typeof target != 'undefined' && target.team != this.team){
					return target;
				}
				
				target = window[this.board.GetCell(this.row+j,this.col-i)];
				if(typeof target != 'undefined' && target.team != this.team){
					return target;
				}
			}
		}
		
		return false;
	},
	
	SeekTarget: function(){
		var target = this.CheckForTarget()
		if(target) {
			this.SetTempMoveTo(target.row,target.col);
		}
		else{
			this.SetTempMoveTo(-1,-1);
		}
		return target;
	},
	
	TargetInRange: function(target){
		if(Math.abs(target.row-this.row)<=this.range && Math.abs(target.col-this.col)<=this.range)
			return true;
		return false;
	},
	
	Sync: function () {
		$('#'+this.id).css({'top':this.top, 'left':this.left, 'width':this.width, 'height':this.height});
	},
});

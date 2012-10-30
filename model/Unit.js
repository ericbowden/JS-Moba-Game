/* args
id: unitId,
map: this.unitMap, //UNIT_MAP
board: this.board,
row: r,
col: c,
size: this.size,
unitImg: this.imgPath,
team: this.team, //and background color
moveWait: this.unitMoveWait //how many ticks before unit moves
maxHP: x;
dmg: x;
sight: x;
range: x; // x > 0
unitType
*/
var Unit = Class.extend({
	init: function(args){
		
		this.currHP = args.maxHP;
		this.destinationR = args.row;
		this.destinationC = args.col;
		this.tempDestR = -1;
		this.tempDestC = -1;
		this.moveWaitCounter = 0;
		this.attackWaitCounter = 0;
		//this.appendTo = '#units';
		this.width = args.size*args.board.GetCellSize();
		this.height = args.size*args.board.GetCellSize();
		this.top = args.row*args.board.GetCellSize();
		this.left = args.col*args.board.GetCellSize();
		this.css = {'z-index':1, 'background':'url('+args.unitImg+') no-repeat'};
		this.startTop = this.top;
		this.startLeft = this.left;
		
		//this._super(args)
		for (var prop in args)
			this[prop] = args[prop];
		//window[this.id] = this;
		
		this.SetPos(this.row, this.col);
		this.AddShape();
	},
	
	AddShape: function() {
	
		var unitType = this.unitType
		var team = this.team;
		var row = this.row;
		var col = this.col;
		var top = this.top;
		var left = this.left;
		var width = this.width;
		var height = this.height;
		
		var img = IMAGES[unitType];
		//(team=='red')?IMAGES.swordred:IMAGES.swordblue
		this.shape = new Kinetic.Shape(function(){
			//console.log(IMAGES[team+'b'], col, row);
                var context = this.getContext();
                
                // draw invisible detectable path for image
                context.beginPath();
                context.rect(left, top, width, height);
				context.fillStyle = team;
				context.fill();
				context.stroke();
                context.closePath();
				context.drawImage(img, left, top,width, height);
            },this.id);
	
		this.board.unitsLayer.add(this.shape);
	},
	
	SyncShape: function() {
		//this.shape.move(this.left,this.top);
		this.shape.setPosition(this.left-this.startLeft,this.top-this.startTop);
		//console.log(this.left, this.top, this.shape);
	
	},

	Remove: function () {
		//clear old pos
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
	
		//this.unitMap.splice(this.unitMap.indexOf(this),1);
		
		this.board.unitsLayer.remove(this.shape);
		
		//calls remove in super class
		//this._super();
		delete this.unitMap[this.id];
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
	
	Act: function(){
		var obj = this.SeekTarget();
		//$('#'+this.id).show(); //makes unit blink when attacking, drops fps
		//this.shape.show();
		if(obj != false && this.TargetInRange(obj)){
			//'slows' unit depending on attackSpeed
			if(this.attackWaitCounter < this.attackWait) {
				this.attackWaitCounter++;			
			}
			else{
				//$('#'+this.id).hide(); //makes unit blink when attacking/ drops fps
				//this.shape.hide();
				this.attackWaitCounter = 0;
				this.DoDamage(obj.target);
			}
		}
		else{
			this.attackWaitCounter = 0;
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
	
	Move: function(dir1, dir2){
			
		var horz = (dir2 == 'left' || dir2 == 'right')?1:0;
		var vert = (dir1 == 'up' || dir1 == 'down')?1:0;

		for(var i = 0; i < this.size;i++)	 {
			var cellValue = this.board.GetCell(this.row+((vert)?((dir1=='down')?this.size:-1):i),this.col+((horz)?((dir2=='left')?this.size:-1):i));

			//if cell is occupied or is a boundary
			//if(cellValue == 1 || (typeof window[cellValue] != "undefined")) {
			if(cellValue!=0) {
				return false;
			} 
			
		}
				
		this.SetPos(this.row+((vert)?((dir1=='down')?1:-1):0),this.col+((horz)?((dir2=='left')?1:-1):0));
		this.top = this.row*this.board.GetCellSize();
		this.left = this.col*this.board.GetCellSize();
		
		return true;
		
		//this might be faster, less comparisions, KEEP IT!
		/*if(dir == 'left'){//left
				for(var i = 0; i < this.size;i++)
					if(this.board.GetCell(this.row+i,this.col+this.size)==1) 
						return false;
				
				this.SetPos(this.row, this.col+1);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		} else if(dir == 'right'){//right
				for(var i = 0; i < this.size;i++)
					if(this.board.GetCell(this.row+i,this.col-1)==1) 
						return false;
					
				this.SetPos(this.row, this.col-1);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		}
		else if(dir == 'down'){//down
				for(var i = 0; i < this.size;i++)
					if(this.board.GetCell(this.row+this.size,this.col+i)==1)
						return false;
						
				this.SetPos(this.row+1, this.col);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		} else if(dir == 'up'){//up
				for(var i = 0; i < this.size;i++)		
					if(this.board.GetCell(this.row-1,this.col+i)==1)
						return false;				
						
				this.SetPos(this.row-1, this.col);
				this.top = this.row*this.board.GetCellSize();
				this.left = this.col*this.board.GetCellSize();
				
				return true;
		}*/
	
	},
	
	SetMoveTo: function(r,c){this.destinationR = r;this.destinationC = c;},
	
	SetTempMoveTo: function(r,c){this.tempDestR = r;this.tempDestC = c;},
	
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
		
		var yDir = false;
		var xDir = false;
		var yBool = true;
		var xBool = true;
		if(dy*dy+dx*dx > 100){
			if(Math.abs(dy/dx) > 5.0){
				xBool = false;
			}
			else if(Math.abs(dx/dy) > 7.0){
				yBool = false;
			}
		}
		else{
		
		}
		if(dy > 0 && yBool)
			yDir = 'down';
		else if(dy < 0 && yBool)
			yDir = 'up';

		if(dx > 0 && xBool)
			xDir = 'left';
		else if(dx < 0 && xBool)
			xDir = 'right';

		if(dy != 0 || dx != 0){
			this.moving = true;
			if(!this.Move(yDir,xDir)){//try moving whatever direction you're supposed to
				if(yDir!=false && xDir!=false){ // if moving diagonal
					if(Math.floor(Math.random()*2)){ //random
						if(!this.Move(yDir,false)){ // move up or down
							if(!this.Move(false,xDir)){ // move left or right
								if(Math.floor(Math.random()*2)){ // randomly move diagonal another way
									if(yDir == 'up'){
										if(!this.Move('down',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move('up',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
								}
								else{
									if(xDir == 'right'){
										if(!this.Move(yDir,'left')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move(yDir,'right')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
								}
							}
						}
					}
					else{
						if(!this.Move(false,xDir)){
							if(!this.Move(yDir,false)){
								if(Math.floor(Math.random()*2)){
									if(yDir == 'up'){
										if(!this.Move('down',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move('up',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
								}
								else{
									if(xDir == 'right'){
										if(!this.Move(yDir,'left')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move(yDir,'right')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
								}
							}
						}
					}
				}else if(yDir!=false){ // else if up or down
					if(Math.floor(Math.random()*2)){
						if(!this.Move(yDir,'left')){ // move diagonally
							if(!this.Move(yDir,'right')){
								if(Math.floor(Math.random()*2)){
									if(!this.Move(false,'left')){
										if(!this.Move(false,'right'))
											this.moving = false;
									}
								}
								else{
									if(!this.Move(!this.Move(false,'right'))){
										if(!this.Move(false,'left'))
											this.moving = false;
									}
								}
							}
						}
					}
					else{
						if(!this.Move(yDir,'right')){
							if(!this.Move(yDir,'left')){
								if(Math.floor(Math.random()*2)){
									if(!this.Move(false,'left')){
										if(!this.Move(false,'right'))
											this.moving = false;
									}
								}
								else{
									if(!this.Move(!this.Move(false,'right'))){
										if(!this.Move(false,'left'))
											this.moving = false;
									}
								}
							}
						}
					}
				}
				else{
					if(Math.floor(Math.random()*2)){
						if(!this.Move('up',xDir)){
							if(!this.Move('down',yDir)){
								if(Math.floor(Math.random()*2)){
									if(!this.Move('up',false)){
										if(!this.Move('down',false))
											this.moving = false;
									}
								}
								else{
									if(!this.Move('down',false)){
										if(!this.Move('up',false))
											this.moving = false;
									}
								}
							}
						}
					}
					else{
						if(!this.Move('down',xDir)){
							if(!this.Move('up',yDir)){
								if(Math.floor(Math.random()*2)){
									if(!this.Move('up',false)){
										if(!this.Move('down',false))
											this.moving = false;
									}
								}
								else{
									if(!this.Move('down',false)){
										if(!this.Move('up',false))
											this.moving = false;
									}
								}
							}
						}
					}
				}
			}
				
		}
		else
			this.moving = false;
	},
	
	GetMaxHP: function(){return this.maxHP;},
	
	GetCurrentHP: function(){return this.currHP},
	
	TakeDamage: function(dmg){this.currHP -= dmg;},
	
	CheckDead: function(){
		if(this.currHP <= 0) {
			this.Remove();
			this.team=='red'?PLAYER2.gold+=5:PLAYER1.gold+=5;
			return true;
		}
		return false;
	},
	
	DoDamage: function(el){
		el.TakeDamage(this.dmg);
	},
	
	CheckForTarget: function(){
		var target;
		var building = false;
		var obj = {};
		var offset = this.size/2;
		var cellId;
		for(var i=1; i <= this.sight; i++){
			for(var j=-i;j<=i;j++){

				/* THis is for debugging
				this.board.SetCell(this.row+i,this.col+j,'orange');
				this.board.SetCell(this.row+j,this.col+i,'orange');
				this.board.SetCell(this.row-i,this.col+j,'orange');
				this.board.SetCell(this.row+j,this.col-i,'orange');//*/
				
				//
				//look for unit, then building
				cellId = this.board.GetCell(this.row+i,this.col+j);
				target = this.unitMap[cellId] || this.buildingMap[cellId];

				obj.target = target;
				obj.row = this.row+i;
				obj.col =this.col+j;
				if(target instanceof Unit && target.team != this.team){
					return obj;
				}
				else if(target instanceof Building && target.team != this.team){
					if(!building)
						building = $.extend({}, obj);
				}
				//
				cellId = this.board.GetCell(this.row+j,this.col+i);
				target = this.unitMap[cellId] || this.buildingMap[cellId];
				
				obj.target = target;
				obj.row = this.row+j;
				obj.col =this.col+i;				
				if(target instanceof Unit && target.team != this.team){
					return obj;
				}
				else if(target instanceof Building && target.team != this.team){
					if(!building)
						building = $.extend({}, obj);
				}
				//
				cellId = this.board.GetCell(this.row-i,this.col+j);
				target = this.unitMap[cellId] || this.buildingMap[cellId];

				obj.target = target;
				obj.row = this.row-i;
				obj.col =this.col+j;				
				if(target instanceof Unit && target.team != this.team){
					return obj;
				}
				else if(target instanceof Building && target.team != this.team){
					if(!building)
						building = $.extend({}, obj);
				}
				//
				cellId = this.board.GetCell(this.row+j,this.col-i);
				target = this.unitMap[cellId] || this.buildingMap[cellId];

				obj.target = target;
				obj.row = this.row+j;
				obj.col =this.col-i;
				if(target instanceof Unit && target.team != this.team){
					return obj;
				}
				else if(target instanceof Building && target.team != this.team){
					if(!building)
						building = $.extend({}, obj);
				}
			}
		}
		if(building)
			return building;
		return false
	},
	
	SeekTarget: function(){
		var obj = this.CheckForTarget()
		if(obj) {
			this.SetTempMoveTo(obj.row,obj.col);
		}
		else{
			this.SetTempMoveTo(-1,-1);
		}
		return obj;
	},
	
	TargetInRange: function(target){
		if(Math.abs(target.row-(this.row+this.size))<this.range && Math.abs(target.col-(this.col+this.size))<this.range)
			return true;
		if(Math.abs(target.row-this.row)<=this.range && Math.abs(target.col-(this.col+this.size))<this.range)
			return true;
		if(Math.abs(target.row-this.row)<=this.range && Math.abs(target.col-this.col)<=this.range)
			return true;
		if(Math.abs(target.row-(this.row+this.size))<this.range && Math.abs(target.col-this.col)<=this.range)
			return true;
		return false;
	},
});

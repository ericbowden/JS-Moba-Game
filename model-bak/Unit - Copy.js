/* args
id: unitId,
array: this.prop.array,
board: this.prop.board,
row: r,
col: c,
unitSize: this.prop.unitSize,
unitImg: this.imgPath,
color: this.color, //background color
moveSpeed: this.unitMoveSpeed
*/
var Unit = Class.extend({
	init: function(args){
		//console.log(args);
		
		//this.prop.array = args.array;
		//this.prop.board = args.board;
		this.prop = args;
		this.CreateEl();
		
		this.prop.destinationR = this.prop.row;
		this.prop.destinationC = this.prop.col;
		this.prop.moving = false;
		this.prop.arrayPos = this.prop.array.length;
		
		/*this.prop.id = args.id; //id of div		
		this.prop.row = args.row;
		this.prop.col = args.col;
		this.prop.unitSize = args.unitSize; //grid by grid 
		*/
		
		//set initiate pos on board
		this.SetPos(this.prop.row, this.prop.col);
		this.prop.width = this.prop.unitSize*this.prop.board.GetCellSize();
		this.prop.height = this.prop.unitSize*this.prop.board.GetCellSize();
		this.prop.top = this.prop.board.GetTop() + this.prop.row*this.prop.board.GetCellSize();
		this.prop.left = this.prop.board.GetLeft() + this.prop.col*this.prop.board.GetCellSize();
		$('#'+this.prop.id).css({'background':'url('+args.unitImg+')'+args.color+' no-repeat','position':'absolute', 'z-index':1});
		this.Sync();
	},
	
	CreateEl: function(){
		window[this.prop.id] = this; //adds element to window
		var el = $('<div></div>').attr('id',this.prop.id);
		
		$('#units').append(el);
	},
	
	SetPos: function(t_row,t_col){
	
		//clear old pos
		for (var r = 0; r < this.prop.unitSize; r++)
			for (var c = 0; c < this.prop.unitSize; c++)
				this.prop.board.SetCell(this.prop.row+r, this.prop.col+c, 0);
		
		this.prop.row = t_row;
		this.prop.col = t_col;
		
		//add new to this.prop.board
		for (var r = 0; r < this.prop.unitSize; r++)
			for (var c = 0; c < this.prop.unitSize; c++)
				this.prop.board.SetCell(this.prop.row+r, this.prop.col+c, 1);
	},
	
	SetMoveTo: function(r,c){
		this.prop.destinationR = r;
		this.prop.destinationC = c;
		this.prop.moving = true;
	},
	
	MoveTo: function(){
		var dx = this.prop.destinationC - this.prop.col;
		var dy = this.prop.destinationR - this.prop.row;
		var vDir = (dy >= 0 ? 'down' : 'up');
		var xDir = (dx >= 0 ? 'left' : 'right');
		if(dy != 0)
			this.Move(vDir);
		if(dx != 0)
			this.Move(xDir);
		if(dy == 0 && dx == 0)
			this.prop.moving = false;
		else
			this.prop.moving = true;
	},
	
	GetMoving: function() {
		return this.prop.moving;
	},
	
	//this overloads the remove in Element.js
	Remove: function () {
		$('#'+this.prop.id).remove(); //removes from document
		this.prop.array.splice(this.prop.arrayPos,1);
		delete window[this.prop.id]; //removes from window
	},
	
	Move: function(dir){
			
		var horz = (dir == 'left' || dir == 'right')?1:0;
		var vert = (dir == 'up' || dir == 'down')?1:0;

		/*for(var i = 0; i < this.prop.unitSize;i++)	
			if(board.GetCell(this.prop.row+((vert)?((dir=='down')?this.prop.unitSize:-1):i),this.prop.col+((horz)?((dir=='left')?this.prop.unitSize:-1):i))==1) {
				return false;
			}				
				
		this.SetPos(this.prop.row+((vert)?((dir=='down')?1:-1):0),this.prop.col+((horz)?((dir=='left')?1:-1):0));
		this.prop.top = board.GetTop() + this.prop.row*board.GetCellSize();
		this.prop.left = board.GetLeft() + this.prop.col*board.GetCellSize();
		
		return true;*/
		
		//this might be faster, less comparisions
		if(dir == 'left'){//left
				for(var i = 0; i < this.prop.unitSize;i++)
					if(this.prop.board.GetCell(this.prop.row+i,this.prop.col+this.prop.unitSize)==1) 
						return false;
				
				this.SetPos(this.prop.row, this.prop.col+1);
				this.prop.top = this.prop.board.GetTop() + this.prop.row*this.prop.board.GetCellSize();
				this.prop.left = this.prop.board.GetLeft() + this.prop.col*this.prop.board.GetCellSize();
				
				return true;
		} else if(dir == 'right'){//right
				for(var i = 0; i < this.prop.unitSize;i++)
					if(this.prop.board.GetCell(this.prop.row+i,this.prop.col-1)==1) 
						return false;
				
				this.SetPos(this.prop.row, this.prop.col-1);
				this.prop.top = this.prop.board.GetTop() + this.prop.row*this.prop.board.GetCellSize();
				this.prop.left = this.prop.board.GetLeft() + this.prop.col*this.prop.board.GetCellSize();
				
				return true;
		}
		else if(dir == 'down'){//down
				for(var i = 0; i < this.prop.unitSize;i++)
					if(this.prop.board.GetCell(this.prop.row+this.prop.unitSize,this.prop.col+i)==1)
						return false;
				
				this.SetPos(this.prop.row+1, this.prop.col);
				this.prop.top = this.prop.board.GetTop() + this.prop.row*this.prop.board.GetCellSize();
				this.prop.left = this.prop.board.GetLeft() + this.prop.col*this.prop.board.GetCellSize();
				
				return true;
		} else if(dir == 'up'){//up
				for(var i = 0; i < this.prop.unitSize;i++)		
					if(this.prop.board.GetCell(this.prop.row-1,this.prop.col+i)==1)
						return false;				
				
				this.SetPos(this.prop.row-1, this.prop.col);
				this.prop.top = this.prop.board.GetTop() + this.prop.row*this.prop.board.GetCellSize();
				this.prop.left = this.prop.board.GetLeft() + this.prop.col*this.prop.board.GetCellSize();
				
				return true;
		}
	
	},
	
	PathFind: function(end_r,end_c){
		var paths = new Array();
		var temp = new PathElement(({row: end_r, col: end_c, count: 0}));
		paths.push(temp);
		var counter = 1;
		do{
			temp = paths[counter-1];
			for(var i=-1; i<=1; i++){
				for(var j=-1; j<=1; j++){
					if(this.prop.board.GetCell(i+temp.GetRow(),j+temp.GetCol())==false){
						var temp2 = new PathElement(({row: i+temp.GetRow(), col: j+temp.GetCol(), count: counter}));
						if(!this.PathArrayContains(temp2,paths))
							paths.push(temp2);
					}
				}
			}
			counter++;
		}while(temp.GetRow()!= this.prop.row && temp.GetCol()!= this.prop.col);
		paths.splice(counter-2,1);
		this.FindBestOption(temp,paths);
	},

	FindBestOption: function(el,paths){
		var temp;
		var options = new Array();
		for(var i=0; i<paths.length; i++){
			temp = paths[i];
			if(Math.abs(temp.GetRow()-el.GetRow())<2 && Math.abs(temp.GetCol()-el.GetCol())<2 && temp.GetCount() < el.GetCount()){
				options.push(temp);
			}
		}
		var lowest=el.GetCount();
		var index = -1;
		for(var j=0; j<options.length; j++){
			if(options[j].GetCount() < lowest){
				lowest = options[j].GetCount();
				index = j;
			}	
		}
		temp = options[index];
		if(typeof temp != 'undefined')
			this.SetMoveTo(temp.GetRow(),temp.GetCol());
	},

	PathArrayContains: function(el,paths){
		var temp;
		for(var i=0; i<paths.length; i++){
			temp = paths[i];
			if(el.GetRow()==temp.GetRow() && el.GetCol()==temp.GetCol() && el.GetCount() >= temp.GetCount())
				return true;
		}
		return false;
	},
	
	Sync: function () {
		$('#'+this.prop.id).css({'top':this.prop.top, 'left':this.prop.left, 'width':this.prop.width, 'height':this.prop.height});
	},
});

var PathElement = Class.extend({
	init: function(args){
		//this.prop.id = args.id;
		//this.CreateEl();
		this.prop.row = args.row;
		this.prop.col = args.col;
		this.count = args.count;
	},
	
	/*CreateEl: function(){
		window[this.prop.id] = this; //adds element to window
		var el = $('<div></div>').attr('id',this.prop.id);
		$('body').append(el);
	},*/
	
	GetRow: function(){
		return this.prop.row;
	},
	
	GetCol: function(){
		return this.prop.col;
	},
	
	GetCount: function(){
		return this.count;
	},
});
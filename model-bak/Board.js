/* args
id: boardId, //css id
rowNum: r,
colNum: c,
top: top,
left: left,
color: color,
cellSize: cellSize, //px by px
*/
var Board = Class.extend({
	init: function(args){
	
		//sets properties to passed in args
		for (var prop in args) 
			this[prop] = args[prop];
	
		//this.id = args.id; //id of div	
		this.CreateEl();
		this.CreateCanvas(args.colNum*args.cellSize,args.rowNum*args.cellSize);
		
		//this.cellSize = args.cellSize;
		//this.rowNum = args.rowNum;
		//this.colNum = args.colNum;
		
		var css = {};
		css['position'] = 'absolute';
		css['background-color'] = args.color;

		//this.top = args.top;
		css.top = args.top+'px';

		//this.left = args.left;
		css.left = args.left+'px';

		//this.width = args.rowNum;
		css.width = args.colNum*args.cellSize+'px';

		//this.height = args.colNum;
		css.height = args.rowNum*args.cellSize+'px';

		this.SetCss(css);
		
		this.CreateArray();
		 //debugging only
		//this.DrawArray();
	},
	
	GetCell: function(r,c) {
		if(r < 0 || r > this.rowNum-1 || c < 0 || c > this.colNum-1)
			return false;
		return this.array[r][c];
	},
	
	SetCell: function(r,c, t_bool) {
		this.array[r][c] = t_bool;
	},

	GetEl: function(){
		return $('#'+this.id);
	},

	SetCss: function(css){
		$('#'+this.id).css(css);
	},
	
	GetCellSize: function(){
		return this.cellSize;
	},
	
	GetTop: function(){
		return this.top;
	},
	
	GetLeft: function(){
		return this.left;
	},
	
	Remove: function () {
		$('#'+this.id).remove(); //removes from document
		delete window[this.id]; //removes from window
	},
	
	//syncs css with object properties, basically a repaint of the object
	Sync: function () {
		$('#'+this.id).css({'top':this.top, 'left':this.left, 'width':this.width, 'height':this.height});
	},
	
	//-------------------------------------------should be private---------------------------------------------------------
	CreateEl: function(){
		window[this.id] = this; //adds element to window
		var el = $('<div></div>').attr('id',this.id);
		$('body').append(el); //adds to body
	},
	
	//canvas test
	CreateCanvas: function(width, height){
		var canvas = $('<canvas></canvas>').attr({'id':'board-canvas', width: width, height: height});
		$('#board-canvas').css({'position':'absolute'});
		$('body').append(canvas);
	},
	
	CreateArray: function(){
		var array = []
		for (var r = 0; r < this.rowNum; r++)
			for (var c = 0; c < this.colNum; c++) 
				array[r] = new Array(this.colNum);
				

		for (var r = 0; r < this.rowNum; r++)
			for (var c = 0; c < this.colNum; c++) {		
				//assigns values to array
				if(c == 0 || c == this.colNum-1 || r==0 || r==this.rowNum-1) {
					array[r][c] = 1;
				}else {
					array[r][c] = 0;
				}
			}

			this.array = array;
	},
	
});
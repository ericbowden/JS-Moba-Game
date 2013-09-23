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
	
		this.width = args.colNum*args.cellSize;
		this.height = args.rowNum*args.cellSize;
		this.appendTo = args.appendTo||'body';
		//this._super(args);
		for (var prop in args)
			this[prop] = args[prop];
		window[this.id] = this;

		this.CreateCanvas();
		this.CreateArray();
		
		$("#BOARD").click(function(e){
			var thisObj = window['BOARD'];
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			var row = Math.floor(y/thisObj.GetCellSize());
			var col = Math.floor(x/thisObj.GetCellSize());
			
			if(PLACE_BUILDING) {
				if(CURRENT_PLAYER.PlaceBuilding(row,col)){
					PLACE_BUILDING = false;
				}
			}	
			
			//hides outline when board is clicked
			var outline = BOARD.animLayer.getChild('build_outline');
			if(typeof outline != 'undefined' && !PLACE_BUILDING)
				BOARD.animLayer.remove(outline);
				
			//board unclick
			MENU_CLICKED = false;
			$('#MENU div').css({'box-shadow': '0px 0px 0px '});
			
			console.log('cell['+row+']['+col+']'+', '+thisObj.GetCell(row,col));
		});
		
		$("#BOARD").mousemove(function(e){
		
			var outline = BOARD.animLayer.getChild('build_outline');
			if(typeof outline != 'undefined') {
				BOARD.animLayer.remove(outline);
			}	
			
			if(MENU_CLICKED) {
				var thisObj = window['BOARD'];
				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;
				var row = Math.floor(y/thisObj.GetCellSize());
				var col = Math.floor(x/thisObj.GetCellSize());
				var cellSize = thisObj.GetCellSize();
				var size = 4;
				var c = (col-Math.floor(size/2))*cellSize;
				var r = (row-Math.floor(size/2))*cellSize;
				var color = (PLACE_BUILDING && CURRENT_PLAYER.ValidatePlacement(row,col,size))?'green':'red';
				
				outline = new Kinetic.Shape(function(){
					var context = this.getContext();
					context.beginPath();
					context.rect(c, r, size*cellSize, size*cellSize);
					context.strokeStyle = color;
					context.stroke();
					context.closePath();
				},'build_outline');
				
				BOARD.animLayer.add(outline);
			}
		});
	},
	
	GetCell: function(r,c) {
		if(r < 0 || r > this.rowNum-1 || c < 0 || c > this.colNum-1)
			return false;
		return this.array[r][c];
	},
	
	SetCell: function(r,c, t_bool) {
		this.array[r][c] = t_bool;
	},

	GetCellSize: function(){
		return this.cellSize;
	},
	
	CreateCanvas: function(){
		
		var canvas = $('<div></div>').attr({'id':'BOARD', width: this.width, height: this.height});
		$(this.appendTo).append(canvas);
		$('#BOARD').css({'background-color':'gray','position':'absolute', width: this.width, height: this.height,top: this.top, left: this.left});
		
		this.stage = new Kinetic.Stage('BOARD', this.width, this.height);
		//this.backLayer = new Kinetic.Layer('backLayer');
		this.buildLayer = new Kinetic.Layer('buildLayer');
		this.unitsLayer = new Kinetic.Layer('unitsLayer');
		this.animLayer = new Kinetic.Layer('animLayer');
		
		//this.stage.add(this.backLayer);
		this.stage.add(this.buildLayer);
		this.stage.add(this.unitsLayer);
		this.stage.add(this.animLayer);
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
	
	Remove: function () {
		$('#'+this.id).remove();
		delete window[this.id];
	},
	
});
PathFind(start_r,start_c,end_r,end_c){
	var paths = new Array();
	paths.push(new PathElement(({row: end_r, col: end_c, 0})));
	var counter = 1;
	var temp;
	do{
		temp = paths[counter-1];
		for(var i=-1; i<=1; i++){
			for(var j=-1; j<=1l j++){
				if(board.GetCell(i+temp.GetRow(),j+temp.GetCol())==false){
					var temp2 = new PathElement(({row: i+temp.GetRow(), col: j+temp.GetCol(), count: counter}));
					if(!PathArrayContains(temp2))
						paths.push(temp2);
				}
			}
		}
		counter++;
	}(temp.GetRow()!=start_r && temp.GetCol()!=start_c);
	paths.splice(counter-2,1);
	FindBestOption(temp);
}

FindBestOption(el){
	var temp;
	var options = new Array();
	for(var i=0; i<paths.length; i++){
		temp = paths[i];
		if(abs(temp.GetRow()-el.GetRow())<2 && abs(temp.GetCol()-el.GetCol())<2 && temp.GetCount() < el.GetCount()){
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
	SetMoveTo(options[index].GetRow(),options[index].GetCol());
}

PathArrayContains(el){
	var temp;
	for(var i=0; i<paths.length; i++){
		temp = paths[i];
		if(el.GetRow()==temp.GetRow() && el.GetCol()==temp.GetCol() && el.GetCount() >= temp.GetCount())
			return true;
	}
	return false;
}

var PathElement = Class.extend({
	init: function(args){
		//this.id = args.id;
		//this.CreateEl();
		this.row = args.row;
		this.col = args.col;
		this.count = args.count;
	},
	
	/*CreateEl: function(){
		window[this.id] = this; //adds element to window
		var el = $('<div></div>').attr('id',this.id);
		$('body').append(el);
	},*/
	
	GetRow: function(){
		return this.row;
	},
	
	GetCol: function(){
		return this.col;
	},
	
	GetCount: function(){
		return this.count;
	},
});
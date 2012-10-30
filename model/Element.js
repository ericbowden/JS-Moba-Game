/*
	appendTo: id ofmdiv to append element to
	id:
	width:
	height:
	top:
	left:
	css: optional other css rules
*/
var Element = Class.extend({
	init: function(args){

		for (var prop in args)
			this[prop] = args[prop];
		
		this.CreateEl(this.appendTo);
		this.InitCss((this.css)?this.css:{});
		//delete this.css;
	},

	CreateEl: function(appendDiv){
		window[this.id] = this; 
		var el = $('<div></div>').attr('id',this.id);
		$(appendDiv).append(el);
	},
	
	InitCss: function(css) {
		if(!css['position'])
			css['position'] = 'absolute';
		if(this.color)
			css['background-color'] = this.color;
			
		if(this.elImg)
			css['background-image'] = 'url('+this.elImg+') no-repeat';

		css.top = this.top+'px';
		css.left = this.left+'px';
		css.width = this.width+'px';
		css.height = this.height+'px';
		this.SetCss(css);
	},
	
	GetEl: function(){return $('#'+this.id);},

	SetCss: function(css){$('#'+this.id).css(css);},
	
	GetTop: function () {return this.top;},

	GetLeft: function () {return this.left;},

	SetTop: function (t_top) {$('#'+this.id).css('top',t_top);this.top = t_top;},

	SetLeft: function (t_left) {$('#'+this.id).css('left',t_left);this.left = t_left;},
	
	SetHeight: function (t_height) {$('#'+this.id).css('height',t_height);this.height = t_height;},

	SetWidth: function (t_width) {$('#'+this.id).css('width',t_width);this.width = t_width;},

	GetWidth: function () {return this.width;},

	GetHeight: function () {return this.height;},
	
	Remove: function () {$('#'+this.id).remove();delete window[this.id];},
	
	Sync: function () {$('#'+this.id).css({'top':this.top, 'left':this.left, 'width':this.width, 'height':this.height});},
});
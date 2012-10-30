var Element = Class.extend({
	init: function(args){
		this.id = args.id; //id of div	
		this.CreateEl(); //adds element to document

		var css = {};
		css['position'] = 'absolute';
		css['background-color'] = args.color;
		css['background-image'] = 'url('+args.unitImg+')';

		this.top = args.top;
		css.top = args.top+'px';

		this.left = args.left;
		css.left = args.left+'px';

		this.width = args.width;
		css.width = args.width+'px';

		this.height = args.height;
		css.height = args.height+'px';

		this.SetCss(css);
	},

	//should be private
	CreateEl: function(){
		window[this.id] = this; //adds element to window
		//creates div
		var el = $('<div></div>').attr('id',this.id);
		//appends to body
		$('body').append(el);
	},

	GetEl: function(){
		return $('#'+this.id);
	},

	SetCss: function(css){
		$('#'+this.id).css(css);
	},
	
	GetTop: function () {	
		return this.top;
	},

	GetLeft: function () {
		return this.left;
	},

	SetTop: function (t_top) {
		$('#'+this.id).css('top',t_top);
		this.top = t_top;
	},

	SetLeft: function (t_left) {
		
		$('#'+this.id).css('left',t_left);
		this.left = t_left;
		console.log(this.left, t_left);
	},
	
	SetHeight: function (t_height) {
		$('#'+this.id).css('height',t_height);
		this.height = t_height;
	},

	SetWidth: function (t_width) {
		$('#'+this.id).css('width',t_width);
		this.width = t_width;
	},

	GetWidth: function () {
		return this.width;
	},

	GetHeight: function () {
		return this.height;
	},
	
	Remove: function () {
		$('#'+this.id).remove(); //removes from document
		delete window[this.id]; //removes from window
	},
	
	//syncs css with object properties, basically a repaint of the object
	Sync: function () {
		$('#'+this.id).css({'top':this.top, 'left':this.left, 'width':this.width, 'height':this.height});
	},
});
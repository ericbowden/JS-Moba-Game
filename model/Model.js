var Element = Class.extend({
	init: function(args){
		this.id = args.id; //id of div	
		this.CreateEl(); //adds element to document

		var css = {};
		css['position'] = 'absolute';
		css['background-color'] = args.color;

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

var M_Ground = Element.extend({
	init: function(args)	{
		
		this._super(args);
	},
	
	CollisionCheck: function (el) {
		if((el.GetLeft() + el.GetWidth()) > this.left && el.GetLeft() < (this.left + this.width)){
			if(el.GetTop() + el.GetHeight() >= this.top)
				el.Collision(this.top);	
		}
	},
});

var M_Box = Element.extend({
	init: function(args){

		//passes to super
		this._super(args);
		
		this.up = 0;
		this.right = 0;
		//this.top = 200;
		//this.left = 200;
		//this.width = 20;
		//this.height = 20;
		this.horizSpeed = 5;
		this.vertSpeed = 0;
		this.downAccel = 3;
		this.framesPerAccel = 10;
		this.accelCount = 0;
		this.onGround = false;
		 
	},
	
	GetUp: function () {
		return this.up;
	},
	
	SetUp: function (t_up) {
		this.up = t_up;
	},

	SetRight: function (t_right) {
		this.right = t_right;
	},
	
	GetRight: function () {
		return this.right;
	},
	
	Jump: function () {
		if(this.onGround==true){
			this.vertSpeed = -5;
			this.onGround = false;
		}
	},
	
	SetOnGround: function (t) {
		this.onGround = t;
	},
	
	Collision: function (t) {
		if(this.vertSpeed > 0)
			this.vertSpeed = 3;
		if(this.top + this.height > t)
			this.top = t - this.height;
		this.onGround = true;
		this.accelCount = 0;
	},
	
	Move: function () {
		this.top+=this.vertSpeed;
		
		if(this.right==1)
			this.left+=this.horizSpeed;
		else if(this.right==-1)
			this.left-=this.horizSpeed;
			
		if(!this.onGround && this.accelCount == this.framesPerAccel){
			this.vertSpeed += this.downAccel;
			this.accelCount = 0;
		}
		
		if(!this.onGround)
			this.accelCount += 1;
		//console.log(this.vertSpeed);
		if(this.vertSpeed > 15)
			this.vertSpeed = 15;
		else if(this.vertSpeed < -15)
			this.vertSpeed = -15;
	},
});
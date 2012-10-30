var Element = Class.extend({
	init: function(args){
		var me = this;
		//sets private vars
		var props = {};
	
		for (var item in args) {
			props[item] = args[item];
		}
		
		var CreateEl = function(appendDiv){
			window[props.id] = me; //adds element to window
			var el = $('<div></div>').attr('id',props.id);
			$(appendDiv).append(el);
		};
		
		var BuildCss = function() {
			var css = {};
			css['position'] = 'absolute';
			css['background-color'] = props.color;
			if(props.elImg)
				css['background-image'] = 'url('+props.elImg+')';

			css.top = props.top+'px';
			css.left = props.left+'px';
			css.width = props.width+'px';
			css.height = props.height+'px';
			console.log(css);
			return css;
		};

		this.GetEl = function(){return $('#'+props.id);};
		this.GetWidth = function () {return props.width;};
		this.GetHeight = function () {return props.height;};
		this.SetCss = function(css){$('#'+props.id).css(css);};
		this.GetTop = function () {return props.top;};
		this.GetLeft = function () {return props.left;};
		
		this.SetTop = function (t_top) {
			$('#'+props.id).css('top',t_top);
			props.top = t_top;
		};

		this.SetLeft = function (t_left) {
			$('#'+props.id).css('left',t_left);
			props.left = t_left;
		};
		
		this.SetHeight = function (t_height) {
			$('#'+props.id).css('height',t_height);
			props.height = t_height;
		};

		this.SetWidth = function (t_width) {
			$('#'+props.id).css('width',t_width);
			props.width = t_width;
		};
		
		this.Remove = function () {
			$('#'+props.id).remove(); //removes from document
			delete window[props.id]; //removes from window
		};
		
		this.Sync = function () {
			$('#'+props.id).css({'top':props.top, 'left':props.left, 'width':props.width, 'height':props.height});
		};
		
		//constructor

		CreateEl(props.appendTo); //adds element to document
		var css = BuildCss(); 
		this.SetCss(css);
		
	},
});
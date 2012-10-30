var Menu = Element.extend({

	init: function(args){
		
		this.appendTo = 'body';
		this.buttons = new Array();
		this._super(args);
	},
});

var MenuElement = Element.extend({
	
	init: function(args){
		this.appendTo = "#MENU";
		this.css = {'background': 'url('+IMAGES[args.type].src+') center no-repeat','float':'left','position':'static', 'margin':'10px 0px 10px 10px'};
		
		this._super(args);
		
		$("#"+this.id).click(function(){ 
			$('#MENU div').css({'box-shadow': '0px 0px 0px '});//clear shadows
			$(this).css({'box-shadow': '0px 0px 15px yellow'});//add shadow to this el
			
			var thisObj = window[this.id];
			thisObj.Clicked();
			
			MENU_CLICKED = true;
		});
	},
	
	Clicked: function(){
		CURRENT_PLAYER.Buy(this.type);
	},
});
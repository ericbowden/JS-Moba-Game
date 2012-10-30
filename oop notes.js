function Box() {
    var up = 0; //private
    var right = 0;
	this.left = 0; //public, can get and set using it
	
	//public methods------------------------
    this.GetUp = function () {
        return up;
    };
	
	this.GetRight = function () {
        return right;
    };
	
	this.SetUp = function (t_up) {
        up = t_up;
    };
	
	this.SetRight = function (t_right) {
        right = t_right;
    };
	
	//private methods----------------------------------
	var privateMethod = function() {
		
	};
	
	//'constructor'
	privateMethod(); //calls private method
	this.GetUp(); //calls public
	
}

//inheritance
function Square() {

	//'constructor'
	this.box = new Box(); //call methods like this.box.GetUp()
	this.box.up = 2; //Danger! up is private, this creates a new this variable called up if one doesn't exist;
	this.box.left = 2; //OK since left is public(this) variable
}

//Usage
box = new Box();
box2 = new Box();
square = new Square();

box.SetUp(1); //sets private var
box.left = 1; //sets public var
box.SetRight(box.left); //call public var
square.box.SetUp(); //call inherited class method

Box.prototype.left = 2; //changes all left vars for each instance of Box

//ref:
//http://www.webmonkey.com/2010/02/make_oop_classes_in_javascript/
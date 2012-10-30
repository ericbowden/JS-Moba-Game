function OnTimerTick(){
	//console.log(M_Box.GetUp(),M_Box.GetRight());
	//console.log("move");
	box.Move();
	box2.Move();
	ground1.CollisionCheck(box);
	ground2.CollisionCheck(box);
	ground3.CollisionCheck(box);
	
	ground1.CollisionCheck(box2);
	ground2.CollisionCheck(box2);
	ground3.CollisionCheck(box2);
	
	Paint(box);
	Paint(box2);
}

function C_KeyDown(code) {
	if (code == 38) box.Jump();
	if (code == 37) box.SetRight(-1);
	if (code == 39) box.SetRight(1);
	
	if (code == 87) box2.Jump();
	if (code == 65) box2.SetRight(-1);
	if (code == 68) box2.SetRight(1);
}

function C_KeyUp(code) {
	if (code == 38) box.SetUp(0);
	if (code == 37) box.SetRight(0);
	if (code == 39) box.SetRight(0);
	
	if (code == 87) box2.SetUp(0);
	if (code == 65) box2.SetRight(0);
	if (code == 68) box2.SetRight(0);
}

function C_Save(){ 
	localStorage['top'] = box.GetTop();
	localStorage['left'] = box.GetLeft();
	//console.log('save');
}

function C_Load(){ 

	box.SetTop(parseInt(localStorage['top']));
	box.SetLeft(parseInt(localStorage['left']));
}

function C_New(){ 
	//console.log('new');
	box.SetTop(200);
	box.SetLeft(200);
	localStorage.clear();
}

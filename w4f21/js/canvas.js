$(window).ready(function () {
//when the window has loaded
//a random number is generated, this then functions as the type of animation the is going
//to be played in the header canvas
    option = Math.floor(Math.random() * 3);

    setup();
});


//this function initializes the OBJS array by calling the one which relates
//to the random option that was chosen
function setup() {
	//get the canavs element 
    canvas = document.getElementById('canvas');
    c = canvas.getContext("2d");
    objs = [];
    switch (option) {
        case 0:
            objs = initBalls();
            break;
        case 1:
            objs = initRandomWalker();
            break;
        default:
            objs = initRain();
    }
	//once the objs have been set up the draw function is set to be called every 0.002secs
    window.setInterval(draw, 20);
}

//returns an array filled with the 'walker' type 
//which is just an array of Boxes that behave differently
//The walker is set up to add a random force to the box + gravity so it looks like the box
//is alive/ kinda looks like popcorn cooking ... looks cool anyway
function initRandomWalker() {
    var tempArray = [];
    for (var i = 0; i < 10; i++) {
        tempArray.push(new Box(10, 10, 10, 10, 2, 0, "walker"));
    }
    return tempArray;
}

//balls just have a simple behaviour
//they just bounce of the walls of tha canvas with random velocity vectors
function initBalls() {
    var tempArray = [];
    for (var i = 0; i < 10; i++) {
        tempArray.push(new Box(10, 10, 10, 10, (Math.random() * 4 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1)), (Math.random() * 4 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1)), "bounce"));
    }
    return tempArray;
}

//rain is set up so that it looks like rain...
function initRain() {
    var tempArray = [];
    for (var i = 0; i < 50; i++) {
        tempArray.push(new Box(Math.random() * canvas.width, -Math.random() * canvas.height, 1 * Math.random(), 10, 0, 2 + Math.random() * 2, "rain"));
    }
    return tempArray;
}

//the draw loop
//this is called loads of times every second
//it whipes the canvas and draws all the boxes in the objs array by calling obj[i].draw()
//this is a Box.draw function -- goto box.js to the the class definition
function draw() {
    c.fillStyle = "#343A40";
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < objs.length; i++) {
        objs[i].draw(c);
    }
	//calls update loop  
    update();
}

//this function calls the update function of all the boxes in the objs array
function update() {
    for (var i = 0; i < objs.length; i++) {
        objs[i].update(canvas);
    }
}
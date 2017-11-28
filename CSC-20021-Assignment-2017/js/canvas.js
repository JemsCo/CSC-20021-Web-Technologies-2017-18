console.log("Canvas Loading...")
var canvas = document.querySelector('canvas');
//console.log(canvas);

var c = canvas.getContext("2d");
var list = [];
var boxWidth = 10;
initBoxes();
var anim = setInterval(draw, 10);

function initBoxes() {
    list = [];
    for (var i = 0; i < canvas.height / boxWidth; i++) {
        list.push(new Box(0, i * boxWidth, boxWidth, boxWidth, .1 + ((i * 1))/10));
    }
}

function draw() {
    //clear the canvas for each frame
    c.fillStyle = "#00000005";
    c.fillRect(0, 0, canvas.width, canvas.height);
    //display the current frame;
    // c.font = "10px Arial";
    // c.fillText("F: " + frame, canvas.width - 25, 10);
    for (var i = 0; i < list.length; i++) {
        list[i].draw(c);
    }
    c.save();
    update(canvas);
}

function update() {
    for (var i = 0; i < list.length; i++) {
        list[i].update(canvas);
    }
}

function resetAnimation() {
    stopAnimation();
    initBoxes();
    anim = setInterval(draw, 20);
}

function stopAnimation() {
    clearInterval(anim);
}
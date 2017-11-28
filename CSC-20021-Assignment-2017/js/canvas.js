function Canvas(w, h, g) {
    this.w = w;
    this.h = h;
    this.graphics = g;


    this.draw = function () {
        g.font = "30px Arial";
        g.strokeText("Hello World", 10, 50);
    }
}

var canvas = new Canvas(document.getElementById("canvas").getContext("2d"));

canvas.draw();
class Box {
    constructor(x, y, w, h, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xVel = speed;
        this.yVel = 0;
    }

    draw(context) {
        context.fillStyle = "#FFFFFFFF";
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    update(canvas) {
        this.x += this.xVel;
        this.y += this.yVel;
        this.check(canvas);
    }

    check(canvas) {
        if (this.x + this.w > canvas.width) {
            this.xVel *= -1;
            this.x = canvas.width - this.w;
        }
        if (this.x < 0) {
            this.xVel *= -1;
            this.x = 0;
        }
    }
}
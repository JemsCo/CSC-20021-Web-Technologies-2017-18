class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xVel = 0;
        this.yVel = 2 + (this.w*2);
        this.color = "#FFFFFFFF";
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    update(canvas) {
        this.x += this.xVel;
        this.y += this.yVel;
        this.check(canvas);
    }

    check(canvas) {
        // this.bounceXWalls(canvas);
        // this.bounceYWalls(canvas);
        if ((this.y - this.h) > canvas.height) {
            this.y = 0-this.h;
            this.x = (Math.random() * canvas.width) - this.w;
        }
    }

    bounceXWalls(canvas) {
        if (this.x + this.w > canvas.width) {
            this.xVel *= -1;
            this.x = canvas.width - this.w;
        }
        if (this.x < 0) {
            this.xVel *= -1;
            this.x = 0;
        }
    }

    bounceYWalls(canvas) {
        if (this.y + this.h > canvas.height) {
            this.yVel *= -1;
            this.y = canvas.height - this.h;
        }
        if (this.y < 0) {
            this.yVel *= -1;
            this.y = 0;
        }
    }
}
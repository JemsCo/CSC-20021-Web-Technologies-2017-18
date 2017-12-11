class Box {
    constructor(x, y, w, h, xVel, yVel, behavoiur) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xVel = xVel;
        this.yVel = yVel;
        this.xAcc = 0;
        this.yAcc = 0;
        this.behavoiur = behavoiur;
        this.color = "#FFFFFFFF";
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    applyfroce(xFroce, yForce) {
        this.xAcc += xFroce;
        this.yAcc += yForce;
    }

    update(canvas) {
        if (this.behavoiur == "walker") {
            this.applyfroce(0, .5);
            if (this.xVel < .05 && this.yVel < .05) {
                this.applyfroce((Math.round(Math.random() * 2 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1))), (Math.round(Math.random() * -3)));
            }
            this.xVel += this.xAcc;
            this.yVel += this.yAcc;
            this.xAcc = 0;
            this.yAcc = 0;
            this.xVel *= .9;
            this.yVel *= .9;
        }
        
        this.x += this.xVel;
        this.y += this.yVel;
        this.check(canvas);
    }

    check(canvas) {
        if (this.behavoiur == "bounce" || this.behavoiur == "walker") {
            this.bounceXWalls(canvas);
            this.bounceYWalls(canvas);
        } else {
            if ((this.y - this.h) > canvas.height) {
                this.y = 0 - this.h;
                this.x = (Math.random() * canvas.width) - this.w;
            }
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
            this.yVel *= -.9;
            this.y = canvas.height - this.h;
        }
        if (this.y < 0) {
            this.yVel *= -.9;
            this.y = 0;
        }
    }
}
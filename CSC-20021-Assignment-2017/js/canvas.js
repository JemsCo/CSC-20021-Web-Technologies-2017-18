function Canvas(w, h) {
    this.w = w;
    this.h = h;
    console.debug("this is happening");
}

this.getWidth = function(){
    return w;
}

var canvas = new Canvas(100, 100);
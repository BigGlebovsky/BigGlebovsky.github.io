
//controller

function controllerGame() {
    var self = this;

    var myModel = null;
    var myField = null;

    self.start = function (model, field) {
        myModel = model;
        myField = field;

        myField.addEventListener("mousemove", myModel.move);
    
        myField.addEventListener("touchstart", myModel.touchStart);
    
        myField.addEventListener("touchmove", myModel.ftouchMove);
        
        myField.addEventListener("touchstart", myModel.begin);
        
        myField.addEventListener("touchend", myModel.touchEnd);    
    
        myField.addEventListener("click", myModel.begin);
    
        //myField.addEventListener("keydown", myModel.pause);
    }
}

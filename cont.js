
//controller

function controllerGame() {
    var self = this;

    var myModel = null;
    var myField = null;

    self.start = function (model, field) {
        myModel = model;
        myField = field;

        myField.addEventListener("mousemove", myModel.move);    
          
  
        
        myField.ontouchstart = myModel.begin;

        myField.ontouchmove = myModel.touchMove;
    
          
        myField.addEventListener("click", myModel.begin);
    
        //myField.addEventListener("keydown", myModel.pause);
    }
}


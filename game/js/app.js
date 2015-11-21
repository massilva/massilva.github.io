$(document).ready(function() {
    Crafty.init(400,400, document.getElementById('game'));
    Crafty.scene("main", function () {
        var subjectObject, draggableObject;
        var loop_id;
        var solved;
        //lendo objetos da cena
        loadSceneObjects();
        //LOOP para checar se foi encontrado a solução
        loop_id = window.setInterval(checkIsSolved,500);
        function loadSceneObjects(){
            subjectObject = Crafty.e("2D, Canvas, Color")
                                    .attr({x:50, y:150, w:100, h:100})
                                    .color("yellow");
            draggableObject = Crafty.e("2D, Canvas, Mouse, Color, Draggable")
                                    .attr({x:250, y:150, w:100, h:100})
                                    .color("blue")
                                    .enableDrag();
            draggableObject.bind("StopDrag", function() {
                solved = isSolved();
                if(solved){ //se encontrou a solução muda a cor do objeto
                    draggableObject.color("green");
                }
            });
        }
        function isSolved(){
            var step = 3;
            if(Math.abs(draggableObject.x - subjectObject.x) <= step && Math.abs(draggableObject.y - subjectObject.y) <= step){
                draggableObject.x = subjectObject.x;
                draggableObject.y = subjectObject.y;    
            }
            return draggableObject.x === subjectObject.x && draggableObject.y === subjectObject.y;
        }
        function checkIsSolved(){
            if(solved){
                //STOP loop
                clearInterval(loop_id);
                alert("Congratulation, you win!");
                //desabilitando a opção de mover o objeto.
                draggableObject.disableDrag();
            }
        }
    });
    Crafty.scene("main");
});
(function(){
    $(document).ready(function(){
        var breakTime = $("#break-time");
        var sessionTime = $("#session-time");
        var timer = $("#timer");

        //setting default value
        if(breakTime.html() === "")
            breakTime.html("05");

        if(sessionTime.html() === "")
            sessionTime.html("25");

        //button action
        timer.on("click",function(){
            console.log("MASS ");
        });

    });
    var operation = function(id, op){
        id = "#"+id;
        var value = parseInt($(id).html());
        switch(op){
            case '+':
                value++; 
                break;
            case '-':
                value--;
                break;
        }
        if(value <= 0){ 
            value = 1;
        }
        if(value < 10){ 
            value = "0".concat(value);
        } 
        $(id).html(value);
    };
    window.operation = operation;
})();
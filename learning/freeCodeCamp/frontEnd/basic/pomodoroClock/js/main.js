(function(){
    $(document).ready(function(){
        var timer = $("#timer");
        var breakTime = $("#break-time");
        var sessionTime = $("#session-time");
        var sessionStarted = false;
        var timerIntervalID;
        var timerTime = {hour: timer.find("#hour"), min: timer.find("#min"), sec: timer.find("#sec")};

        //setting default value
        if(breakTime.html() === "")
            breakTime.html("05");

        if(sessionTime.html() === "")
            sessionTime.html("25");

        var resetValues = function(){
            var min = sessionTime.html();
            timerTime.hour.html(formatTime(parseInt(min / 60)));
            timerTime.min.html(min % 60);
            timerTime.sec.html("00");
            clearInterval(timerIntervalID);
        };

        resetValues();

        //button action
        timer.on("click",function(){
            if(!sessionStarted){
                timerIntervalID = setInterval(function(){
                    timerUpdate();
                },1000);
            }else{
                clearInterval(timerIntervalID);        
            }
            sessionStarted = !sessionStarted;
        });

        $("#reset-timer").on("click", resetValues);

        function timerUpdate(){
            var sec = timerTime.sec.html() - 1;
            if(sec < 0){
                sec = 59;
                minUpdate();
            }
            timerTime.sec.html(formatTime(sec));
        }

        function minUpdate(){
            var min = timerTime.min.html() - 1;
            if(min < 0){
                min = 59;
                hourUpdate();
            }
            timerTime.min.html(formatTime(min));
        }

        function hourUpdate(){
            var hour = timerTime.hour.html() - 1;
            if(hour < 0){
                clearInterval(timerIntervalID);
            }
            timerTime.hour.html(formatTime(hour));
        }

    });
    var formatTime = function(value){
        return value < 10 ? value = "0".concat(value) : value;
    }
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
        $(id).html(formartTime(value));
    };
    window.operation = operation;
    window.formatTime = formatTime;
})();
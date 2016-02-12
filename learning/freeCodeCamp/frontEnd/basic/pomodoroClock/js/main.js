(function(){

    $(document).ready(function(){

        var timerIntervalID, breakIntervalID;
        var sessionStarted = false, breakStarted = false, sessionPaused = false;
        var timer = $("#timer");
        var breakTime = $("#break-time");
        var sessionTime = $("#session-time");

        var resetValues = function(id){
            var min = $(id).val();
            timerTime.sec.html("00");
            timerTime.min.html(formatTime(min % 60));
            timerTime.hour.html(formatTime(parseInt(min / 60)));
            clearInterval(timerIntervalID);
            clearInterval(breakIntervalID);
        };

        //Add audio
        $("body").append('<audio id="audio"></audio>');
        $("#audio").attr("src","audio/evacuation.mp3");

        var audio = $("#audio")[0];
        var timerTime = {hour: timer.find("#hour"), min: timer.find("#min"), sec: timer.find("#sec")};

        //buttons action

        timer.on("click",function(){
            if(!breakStarted){
                if(!sessionStarted){
                    sessionInterval();
                }else{
                    sessionStarted = false;
                    sessionPaused = true;
                    clearInterval(timerIntervalID);            
                }
            }
        });

        $("#bt-minus").on("click",function(){
            operation('break-time','-',false);
        });

        $("#bt-plus").on("click",function(){
            operation('break-time','+',false);
        });

        $("#st-minus").on("click",function(){
            operation('session-time','-',true);
        });

        $("#st-plus").on("click",function(){
            operation('session-time','+',true);
        });

        $("#reset-timer").on("click",sessionTimeResertValues);
        //finished buttons action

        sessionTimeResertValues();
        
        function operation(id, op, reset){
            id = "#"+id;
            var value = parseInt($(id).val());
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
            $(id).val(formatTime(value));
            if(reset){
                resetValues(id);
            }
        };

        function sessionTimeResertValues(){
            resetValues("#session-time");
        }

        function formatTime(value){
            return value < 10 ? value = "0".concat(value) : value;
        }

        function timerUpdate(sec){
            timerTime.sec.html(formatTime(sec < 0 ? 59 : sec));
            if(sec < 0){
                minUpdate(timerTime.min.html() - 1);
            }
        }

        function minUpdate(min){
            timerTime.min.html(formatTime(min < 0 ? 59 : min));
            if(min < 0){
                hourUpdate(timerTime.hour.html()-1);
            }
        }

        function hourUpdate(hour){
            if(hour >= 0){
               timerTime.hour.html(formatTime(hour));
            } else {
                if(!breakStarted){
                    audio.loop = true;
                    audio.play();
                    breakInterval();
                } else {
                    audio.pause();
                    sessionInterval();
                }
            }
        }

        function breakInterval(){
            clearInterval(timerIntervalID);
            timerIntervalID = undefined;
            breakStarted = true;
            sessionStarted = false;
            resetValues("#break-time");
            breakIntervalID = setInterval(function(){
                timerUpdate(timerTime.sec.html() - 1);    
            },1000);
        }

        function sessionInterval(){
            clearInterval(breakIntervalID);
            breakIntervalID = undefined;
            breakStarted = false;
            sessionStarted = true;
            console.log("sessionPaused", sessionPaused);
            if(!sessionPaused){
                sessionTimeResertValues();                
            }
            timerIntervalID = setInterval(function(){
                timerUpdate(timerTime.sec.html() - 1);
            },1000);
        }

        window.resetValues = resetValues;
    });

})();
$(document).ready(function(){

    $("#header-site").css("height",window.innerHeight - $("#nav").height());
    $(".full-screen").css("height",window.innerHeight);

    var width  = $("#board").width();
    var height = $("#board").height();
    var form = {};
    var uForm = $("#form input");

    for(var i = uForm.length - 1; i >= 0; --i){
        uForm[i].onchange = onChange;
        var input = $(uForm[i]);
        if(input.is(":checked")){
            form[input.attr("name")] = input.val();
        }
    }

    function onChange(){
        var input = $(this);
        form[input.attr("name")] = input.val();
    }

    SimpleGraph(window, "#board", width, height, form).start();
});

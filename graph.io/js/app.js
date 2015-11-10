$(document).ready(function(){

    var form = {};
    var uForm = $("#form input");
    for(var i = uForm.length - 1; i >= 0; --i){
        uForm[i].onchange = onChange;
        var input = $(uForm[i]);
        form[input.attr("name")] = input.val();
    }

    function onChange(){
        var input = $(this);
        form[input.attr("name")] = input.val();
    }

    var width  = $("#board").width(),height = 400;
    var simpleGraph = new SimpleGraph(window, "#board", width, height, form);
    simpleGraph.start();

});
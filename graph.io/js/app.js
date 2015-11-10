$(document).ready(function(){
    var width  = $("#board").width(),height = 400;
    var vertexIsLabeled = $("#vertexLabeled").is(":checked");
    var edgeIsLabeled = $("#edgeIsLabeled").is(":checked");
    var simpleGraph = new SimpleGraph(window, "#board", width, height, edgeIsLabeled, vertexIsLabeled);
    simpleGraph.start();
});
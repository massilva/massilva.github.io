var SimpleGraph = function(window, content_id, width, height, uForm){

    var _public = {};
    var _private = {};

    _private.options = {r: 12};
    _private.window = window;
    _private.colors = d3.scale.category10();
    _private.lastIdx = 0;
    _private.nodes = [];
    _private.links = [];
    _private.edgepaths = [];
    _private.edgelabels = [];
    _private.lastKeyDown = -1; // only respond once per keydown
    _private.mouseEvent = {selected_node: null, selected_link: null, mousedown_link: null, mousedown_node: null, mouseup_node: null};

    // update force layout (called automatically each iteration)
    _private.tick = function() {

        // draw directed edges with proper padding from node centers
        _private.path.attr('d', function(d) {
            var deltaX = d.target.x - d.source.x,
                deltaY = d.target.y - d.source.y,
                dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                normX = deltaX / dist,
                normY = deltaY / dist,
                sourcePadding = d.left ? 17 : 12,
                targetPadding = d.right ? 17 : 12,
                sourceX = d.source.x + (sourcePadding * normX),
                sourceY = d.source.y + (sourcePadding * normY),
                targetX = d.target.x - (targetPadding * normX),
                targetY = d.target.y - (targetPadding * normY);
            return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
        });

        _private.circle.attr('transform', function(d) {
            var st = 3;
            var dx = d.x < 0 ? _private.options.r + st : d.x + _private.options.r >= width ? width - _private.options.r - st : d.x;
            var dy = d.y < 0 ? _private.options.r + st : d.y + _private.options.r >= height ? height - _private.options.r - st : d.y;
            return 'translate(' + dx + ',' + dy + ')';
        });

        for(var i = _private.edgepaths.length - 1; i >= 0; i--){
            _private.edgepaths[i].attr('d', function(d) { return 'M'+d.source.x+','+d.source.y+' L'+ d.target.x +','+d.target.y; });
        }

        for(var i = _private.edgelabels.length - 1; i >= 0; i--){
            _private.edgelabels[i].attr('transform',function(d,i){
                if (d.target.x<d.source.x){
                    bbox = this.getBBox();
                    rx = bbox.x+bbox.width/2;
                    ry = bbox.y+bbox.height/2;
                    return 'rotate(180 '+rx+' '+ry+')';
                }
                return 'rotate(0)';
            });
        }   

    };

    // update graph (called when needed)
    _private.restart = function(){

        // path (link) group
        _private.path = _private.path.data(_private.links);

        // update existing links
        _private.path
                .classed('selected', function(d) { return d === _private.mouseEvent.selected_link; })
                .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
                .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });

        // add new links
        _private.path
            .enter()
            .append('svg:path')
            .attr('class', 'link')
            .classed('selected', function(d) { return d === _private.mouseEvent.selected_link; })
            .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
            .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
            .on('mousedown', function(d) {
                if(d3.event.ctrlKey) return;
                _private.mouseEvent.mousedown_link = d;
                if(_private.mouseEvent.mousedown_link === _private.mouseEvent.selected_link) _private.mouseEvent.selected_link = null;
                else _private.mouseEvent.selected_link = _private.mouseEvent.mousedown_link;
                _private.mouseEvent.selected_node = null;
                _private.restart();
            });

        // remove old links
        _private.path.exit().remove();

        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        _private.circle = _private.circle.data(_private.nodes, function(d) { return d.id; });

        // update existing nodes (reflexive & selected visual states)
        _private.circle
                .selectAll('circle')
                .style('fill', function(d) { return (d === _private.mouseEvent.selected_node) ? d3.rgb(_private.colors(d.id)).brighter().toString() : _private.colors(d.id); })
                .classed('reflexive', function(d) { return d.reflexive; });

        // add new nodes
        var g = _private.circle.enter().append('svg:g');

        g.append('svg:circle')
            .attr('class', 'node')
            .attr('r', _private.options.r)
            .style('fill', function(d) { return (d === _private.mouseEvent.selected_node) ? d3.rgb(_private.colors(d.id)).brighter().toString() : _private.colors(d.id); })
            .style('stroke', function(d) { return d3.rgb(_private.colors(d.id)).darker().toString(); })
            .classed('reflexive', function(d) { return d.reflexive; })
            .on('mouseover', function(d) {
                if(!_private.mouseEvent.mousedown_node || d === _private.mouseEvent.mousedown_node) return;
                // enlarge target node
                d3.select(this).attr('transform', 'scale(1.1)');
            })
            .on('mouseout', function(d) {
                if(!_private.mouseEvent.mousedown_node || d === _private.mouseEvent.mousedown_node) return;
                // unenlarge target node
                d3.select(this).attr('transform', '');
            })
            .on('mousedown', function(d) {
                if(d3.event.ctrlKey) return;

                // select node
                _private.mouseEvent.mousedown_node = d;
                if(_private.mouseEvent.mousedown_node === _private.mouseEvent.selected_node) _private.mouseEvent.selected_node = null;
                else _private.mouseEvent.selected_node = _private.mouseEvent.mousedown_node;
                _private.mouseEvent.selected_link = null;

                // reposition drag line
                _private.drag_line.style('marker-end', 'url(#end-arrow)').classed('hidden', false).attr('d', 'M' + _private.mouseEvent.mousedown_node.x + ',' + _private.mouseEvent.mousedown_node.y + 'L' + _private.mouseEvent.mousedown_node.x + ',' + _private.mouseEvent.mousedown_node.y);
                _private.restart();
            })
            .on('mouseup', function(d) {
                if(!_private.mouseEvent.mousedown_node) return;

                // needed by FF
                _private.drag_line.classed('hidden', true).style('marker-end', '');

                // check for drag-to-self
                _private.mouseEvent.mouseup_node = d;
                if(_private.mouseEvent.mouseup_node === _private.mouseEvent.mousedown_node) { _private.mouseEvent.resetMouseVars(); return; }

                // unenlarge target node
                d3.select(this).attr('transform', '');

                // add link to graph (update if exists)
                // NB: links are strictly source < target; arrows separately specified by booleans
                var source, target, direction;
                if(_private.mouseEvent.mousedown_node.id > _private.mouseEvent.mouseup_node.id) {
                    source = _private.mouseEvent.mouseup_node;
                    target = _private.mouseEvent.mousedown_node;
                    direction = 'left';
                } else {
                    source = _private.mouseEvent.mousedown_node;
                    target = _private.mouseEvent.mouseup_node;
                    direction = 'right';
                }

                var link = _private.links.filter(function(l) {
                    return (l.source === source && l.target === target);
                })[0];

                if(link) {
                    link[direction] = true;
                } else {
                    var edgeIsLabeled = uForm.edgelabeled == '1';
                    var label = " ";
                    if(edgeIsLabeled){
                        label = prompt("Set the edge label","");
                    }
                    link = {source: source, target: target, left: false, right: false, value: _private.isNumeric(label) ? parseFloat(label) : label};
                    link[direction] = true;
                    _private.links.push(link);
                    _private.updateEdge();
                    _private.restart();
                }

                console.log(_private.links);
                // select new link
                _private.mouseEvent.selected_link = link;
                _private.mouseEvent.selected_node = null;
                _private.restart();
            });

        // show node IDs
        g.append('svg:text').attr('x', 0).attr('y', 4).attr('class', 'id').text(function(d) { return d.name; });

        // remove old nodes
        _private.circle.exit().remove();

        // set the graph in motion
        _private.force.start();

    };

    _private.isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    _private.updateEdge = function(){

        var ePaths = _private.svg.selectAll(".edgepath")
            .data(_private.links)
            .enter()
            .append('path')
            .attr({//'d': function(d,i) { console.log(d); return 'M '+d.source.x+', '+d.source.y+' L '+ d.target.x +', '+d.target.y},
                   'class':'edgepath',
                   'fill-opacity':0,
                   'stroke-opacity':0,
                   'id':function(d,i) {return 'edgepath'+i}})
            .style("pointer-events", "none");

        _private.edgepaths.push(ePaths);
        var eLabels = _private.svg.selectAll(".edgelabel")
            .data(_private.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr({ 'class':'edgelabel',
                    'id':function(d,i){return 'edgelabel'+i},
                    'dx':65,
                    'dy':15,
                    'font-size':10,
                    'fill':'#F90'});

        eLabels.append('textPath').attr('xlink:href',function(d,i) {return '#edgepath'+i}).text(function(d,i){return d.value});
        _private.edgelabels.push(eLabels);

    };

    _private.mouseEvent.resetMouseVars = function() {
        _private.mouseEvent.mousedown_node = null;
        _private.mouseEvent.mouseup_node = null;
        _private.mouseEvent.mousedown_link = null;
    };

    _private.mouseEvent.mousedown = function() {

        // prevent I-bar on drag
        d3.event.preventDefault();

        // because :active only works in WebKit?
        _private.svg.classed('active', true);

        if(d3.event.ctrlKey || _private.mouseEvent.mousedown_node || _private.mouseEvent.mousedown_link) return;

        // insert new node at point
        var vertexIsLabeled = uForm.vertexlabeled == '1';
        var label = "";
        if(vertexIsLabeled){
            label = prompt("Set the vertex label","");
        }
        label = label || _private.lastIdx + 1;
        var point = d3.mouse(this);
        var node = {id: _private.lastIdx++, name: label, reflexive: true, x: point[0], y: point[1]};

        _private.nodes.push(node);
        _private.restart();

    };

    _private.mouseEvent.mousemove = function() {
        if(!_private.mouseEvent.mousedown_node) return;
        // update drag line
        _private.drag_line.attr('d', 'M' + _private.mouseEvent.mousedown_node.x + ',' + _private.mouseEvent.mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
        _private.restart();
    };

    _private.mouseEvent.mouseup = function() {
        if(_private.mouseEvent.mousedown_node) {
            _private.drag_line.classed('hidden', true).style('marker-end', '');
        }
        // because :active only works in WebKit?
        _private.svg.classed('active', false);
        // clear mouse event vars
        _private.mouseEvent.resetMouseVars();
    };

    _private.spliceLinksForNode = function(node) {
        var toSplice = _private.links.filter(function(l) {
            return (l.source === node || l.target === node);
        });
        toSplice.map(function(l) {
            _private.links.splice(_private.links.indexOf(l), 1);
        });
    };

    _private.keydown = function() {
        d3.event.preventDefault();

        if(_private.lastKeyDown !== -1) return;
        _private.lastKeyDown = d3.event.keyCode;

        // ctrl
        if(d3.event.keyCode === 17) {
            _private.circle.call(_private.force.drag);
            _private.svg.classed('ctrl', true);
        }

        if(!_private.mouseEvent.selected_node && !_private.mouseEvent.selected_link) return;
        switch(d3.event.keyCode) {
            case 8: // backspace
            case 46: // delete
                if(_private.mouseEvent.selected_node) {
                    _private.nodes.splice(_private.nodes.indexOf(_private.mouseEvent.selected_node), 1);
                    _private.spliceLinksForNode(_private.mouseEvent.selected_node);
                } else if(_private.mouseEvent.selected_link) {
                    _private.links.splice(_private.links.indexOf(_private.mouseEvent.selected_link), 1);
                }
                _private.mouseEvent.selected_link = null;
                _private.mouseEvent.selected_node = null;
                _private.restart();
                break;
            case 66: // B
                if(_private.mouseEvent.selected_link) {
                    // set link direction to both left and right
                    _private.mouseEvent.selected_link.left = true;
                    _private.mouseEvent.selected_link.right = true;
                }
                _private.restart();
                break;
            case 76: // L
                if(_private.mouseEvent.selected_link) {
                    // set link direction to left only
                    _private.mouseEvent.selected_link.left = true;
                    _private.mouseEvent.selected_link.right = false;
                }
                _private.restart();
                break;
            case 82: // R
                if(_private.mouseEvent.selected_node) {
                    // toggle node reflexivity
                    _private.mouseEvent.selected_node.reflexive = !_private.mouseEvent.selected_node.reflexive;
                } else if(_private.mouseEvent.selected_link) {
                    // set link direction to right only
                    _private.mouseEvent.selected_link.left = false;
                    _private.mouseEvent.selected_link.right = true;
                }
                _private.restart();
                break;
        }
    };

    _private.keyup = function() {
        _private.lastKeyDown = -1;
        // ctrl
        if(d3.event.keyCode === 17) {
            _private.circle.on('mousedown.drag', null).on('touchstart.drag', null);
            _private.svg.classed('ctrl', false);
        }
    };

    // app starts here
    _public.start = function(){    

        _private.force = d3.layout.force()
            .nodes(_private.nodes)
            .links(_private.links)
            .size([width, height])
            .linkDistance([150])
            .charge(-500)
            .theta(0.1)
            .gravity(0.05)
            .on('tick', _private.tick);

        _private.svg = d3.select(content_id)
                          .append('svg')
                          .attr('oncontextmenu', 'return false;')
                          .attr('width', width)
                          .attr('height', height);

        // define arrow markers for graph links
        _private.svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000');

        _private.svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 4)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M10,-5L0,0L10,5')
            .attr('fill', '#000');

        // line displayed when dragging new nodes
        _private.drag_line = _private.svg.append('svg:path').attr('class', 'link dragline hidden').attr('d', 'M0,0L0,0');

        // handles to link and node element groups
        _private.path = _private.svg.append('svg:g').selectAll('path');
        _private.circle = _private.svg.append('svg:g').selectAll('g');

        _private.updateEdge();
        _private.restart();    
        _private.svg.on('mousedown',_private.mouseEvent.mousedown).on('mousemove', _private.mouseEvent.mousemove).on('mouseup', _private.mouseEvent.mouseup);
        d3.select(_private.window).on('keydown', _private.keydown).on('keyup', _private.keyup);
    };

    return _public;
};

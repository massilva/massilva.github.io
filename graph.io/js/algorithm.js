var Algorithm = function(){
    var _private = {};
    _private.merge = function(left, right, arr, field){
        var idx = 0;
        while(left.length && right.length){
            if(field){
                arr[idx++] = (right[0][field] < left[0][field]) ? right.shift() : left.shift();
            }else{
                arr[idx++] = (right[0] < left[0]) ? right.shift() : left.shift();            
            }
        }
        while(left.length){
            arr[idx++] = left.shift();
        }
        while(right.length){
            arr[idx++] = right.shift();
        }
    };
    _private.recursionSort = function(arr, temp, len, field){
        if (len === 1) { return arr; }
        var middle = Math.floor(len / 2);
        var tmp_l = temp.slice(0, middle), tmp_r = temp.slice(middle);
        _private.recursionSort(tmp_l, arr.slice(0, middle), middle, field);
        _private.recursionSort(tmp_r, arr.slice(middle), len - middle, field);
        _private.merge(tmp_l, tmp_r, arr, field);
    };
    _private.isEqualsInOrder = function(arr1, arr2, field){
        if(arr1.length != arr2.length){
            return false;
        }
        var  i = 0;
        while(i < arr1.length){
            var auxA = (field) ? arr1[i][field] : arr1[i];
            var auxB = (field) ? arr2[i][field] : arr2[i];
            if(auxA != auxB){
                break;
            }
            i++;
        }
        return i == arr1.length;
    };
    _private.showAssert = function(src, target, flag){
        console.log(JSON.stringify(src).toString() + " is" + (flag ? " " : " not " ) + "equals to " + JSON.stringify(target).toString());
    };
    _private.objectIsEmpty = function(obj){
        return Object.keys(obj).length == 0;
    };
    // Find and remve item from an array
    _private.remove = function(array, element){
        var i = 0;
        while(i < array.length && array[i].value != element.value && array[i].id != element.id){
            console.log(array[i]);
            i++;
        }
        if(i != array.length) {
            array.splice(i, 1);
        }
    };
    var _public = {};
    /**
     * Merge Sorting algorithm
     * based in : http://rosettacode.org/wiki/Sorting_algorithms/Merge_sort#JavaScript
     * @param  {Number or Object} | arr      | array with content data
     * @param  {String}           | field    | IF array of objects this indicate the field for to be comparated
     * @return {Number or Object} |          | copy array sorted 
     */
    _public.msort = function(arr, field){
        var cpyArr = arr.slice();
        _private.recursionSort(cpyArr, cpyArr.slice(), cpyArr.length, field);
        return cpyArr.slice();
    };
    /**
     * Quick Sorting Algorithm
     * based in : https://en.wikibooks.org/wiki/Algorithm_Implementation/Sorting/Quicksort#JavaScript
     * @param  {Number or Object} | arr      | array with content data              
     * @param  {String}           | field    | IF array of objects this indicate the field for to be comparated
     * @return {Number or Object} |          | copy array sorted 
     */
    _public.qsort = function(arr, field){
        if (arr.length == 0) return [];
        var left = [], right = [], pivot = (field) ? arr[0][field] : arr[0];
        for (var i = 1; i < arr.length; i++){
            var value = (field) ? arr[i][field] : arr[i];
            value < pivot ? left.push(arr[i]) : right.push(arr[i]);
        }
        return _public.qsort(left, field).concat(arr[0], _public.qsort(right, field));
    };
    /**
     * Algorithm Dijkstra
     * @param  {Array of objects} links  | Array of nodes with links between nodes
     * @param  {init} posInitNode        | Initial node
     * @param  {boolean} isShortestPath  | Flag when TRUE : minimal cost FALSE : maximal cost
     * @param  {int} countVertex         | The amount nodes or vertex 
     * @return {Array}                   | Distances (min or max, isShortestPath flag dependecy) of the initial node until all node
     */
    _private.dijkstra = function(linksArr, posInitNode, isShortestPath, countVertex){
        var distances = []; //array 
        var queue = [];
        var minDistance = isShortestPath && true;
        var limit = minDistance ? Infinity : -1;
        //Construct the array of distances until vertex.
        //Each position of the array distance is equal the vertex, 
        //position 0 is the vertex of id equals 0.
        for(var i = countVertex - 1; i >= 0; --i){
            distances[i] = limit;
        }
        // console.log(linksArr);
        distances[posInitNode] = 0;
        queue.push({target: posInitNode, value: 0});
        while(queue.length)
        {
            var top = queue.shift();
            var v_source = linksArr[top.target];
            for(var i = v_source.length - 1; i >= 0; --i){
                var new_v_target = v_source[i].target;
                var cost = v_source[i].value;
                var compare = minDistance ? distances[new_v_target] > distances[top.target] + cost : distances[new_v_target] < distances[top.target] + cost;
                if(compare){
                    if(distances[new_v_target] != limit){
                        _private.remove(queue, {target: new_v_target, value: distances[new_v_target]});
                    }
                    distances[new_v_target] = distances[top.target] + cost;
                    queue.push({target: new_v_target, value: distances[new_v_target]});
                }
            }
        }
        return distances;
    };

    _public.shortestPath = function(nodes, links, posInitNode){
        return _private.dijkstra(links, 0, true, nodes.length);
    }

    _public.longestPath = function(nodes, links, posInitNode){
        return _private.dijkstra(links, 0, false, nodes.length);
    }

    /**
     * Test Algorithms
     **/
    _public.test = function(){
        var algorithm = new Algorithm();

        console.log("/** MERGE SORT TEST **/");
        var testArraySol = [2,3,4,5];
        var testArray = [4,3,2,5];
        var testArrayCopy = algorithm.msort(testArray);

        var testArrayObjSol = [{"id":2},{"id":3},{"id":4},{"id":5}];
        var testArrayObj = [{"id":4},{"id":3},{"id":2},{"id":5}];
        var testArrayObjCopy = algorithm.msort(testArrayObj,"id");

        _private.showAssert(testArray,testArrayCopy,_private.isEqualsInOrder(testArray,testArrayCopy));
        _private.showAssert(testArrayCopy,testArraySol,_private.isEqualsInOrder(testArrayCopy,testArraySol));

        _private.showAssert(testArrayObj,testArrayObjCopy,_private.isEqualsInOrder(testArrayObj,testArrayObjCopy,"id"));
        _private.showAssert(testArrayObjCopy,testArrayObjSol,_private.isEqualsInOrder(testArrayObjCopy,testArrayObjSol,"id"));

        console.log("/** QUICK SORT TEST **/");
        testArrayCopy = algorithm.qsort(testArray);

        _private.showAssert(testArray,testArrayCopy,_private.isEqualsInOrder(testArray,testArrayCopy));
        _private.showAssert(testArrayCopy,testArraySol,_private.isEqualsInOrder(testArrayCopy,testArraySol));

        testArrayObjCopy = algorithm.qsort(testArrayObj,"id");

        _private.showAssert(testArrayObj,testArrayObjCopy,_private.isEqualsInOrder(testArrayObj,testArrayObjCopy,"id"));
        _private.showAssert(testArrayObjCopy,testArrayObjSol,_private.isEqualsInOrder(testArrayObjCopy,testArrayObjSol,"id"));

        console.log("/** DIJKSTRA TEST **/");
        var idx = 0;
        var nodes = [
                    {"name":"A","group":1,"id":idx++},
                    {"name":"B","group":1,"id":idx++},
                    {"name":"C","group":1,"id":idx++},
                    {"name":"D","group":1,"id":idx++},
                    {"name":"E","group":1,"id":idx++},
                    {"name":"F","group":1,"id":idx++},
                    {"name":"G","group":1,"id":idx++},
                    {"name":"H","group":1,"id":idx++},
                    {"name":"I","group":1,"id":idx++}
                    ];

        var links = [
                    {"source": nodes[0],"target": nodes[1],"value": 5 , right : true},
                    {"source": nodes[0],"target": nodes[2],"value": 5 , right : true},
                    {"source": nodes[0],"target": nodes[3],"value": 5 , right : true},
                    {"source": nodes[0],"target": nodes[4],"value": 5 , right : true},
                    {"source": nodes[1],"target": nodes[5],"value": 20, right : true},
                    {"source": nodes[2],"target": nodes[7],"value": 25, right : true},
                    {"source": nodes[3],"target": nodes[6],"value": 15, right : true},
                    {"source": nodes[4],"target": nodes[6],"value": 25, right : true},
                    {"source": nodes[5],"target": nodes[7],"value": 15, right : true},
                    {"source": nodes[6],"target": nodes[7],"value": 10, right : true},
                    {"source": nodes[7],"target": nodes[8],"value": 15, right : true}
                    ];
        
        var linksArr = [];

        for(var i = nodes.length - 1; i >= 0; --i){
            linksArr[i] = [];
        }

        //Graph in array notation
        for(var i = links.length - 1; i >= 0; --i){
            linksArr[links[i].source.id].push({target: links[i].target.id, value: links[i].value});
        }

        var minD = [0, 5, 5, 5, 5, 25, 20, 30, 45];
        var distances = algorithm.shortestPath(nodes, linksArr, 0);
        _private.showAssert(minD,distances,_private.isEqualsInOrder(minD,distances));

        var maxD = [0, 5, 5, 5, 5, 25, 30, 40, 55];
        distances = algorithm.longestPath(nodes, linksArr, 0);
        _private.showAssert(maxD,distances,_private.isEqualsInOrder(maxD,distances));

    }
    return _public;
};

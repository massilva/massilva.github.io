(function () {
    'use strict';
    var
        select = function (selector) { return document.querySelector(selector); }, //Alias
        selectAll = function (selector) { return document.querySelectorAll(selector); }, //Alias
        body = select('body'),
        container = select('.container'),
        paths = [],
        pathLen = [],
        rowHasPath = [],
        rows = selectAll('.row'),
        rowsLen =  document.documentElement.clientHeight,
        maxHeight;

    for (var idx = 0; idx < rows.length; ++idx) {
        paths[idx] = [];
        pathLen[idx] = [];
        if (rows.hasOwnProperty(idx)) {
            rowHasPath[idx] = false;
            if (rows[idx].id) {
                paths[idx] = selectAll('#' + rows[idx].id + ' path');
                rowHasPath[idx] = paths[idx].length !== 0;
                for (var i = 0; i < paths[idx].length; ++i) {
                    pathLen[idx][i] = Math.ceil(paths[idx][i].getTotalLength());
                    paths[idx][i].style.strokeDasharray = pathLen[idx][i];
                    paths[idx][i].style.strokeDashoffset = pathLen[idx][i];
                }
            }
        }
    }

    maxHeight = rowsLen * rows.length;
    // container.style.height = maxHeight + 'px';
    // body.style.height = ( maxHeight * 1.25 ) + 'px';
    body.style.height = maxHeight + 'px';

    window.addEventListener('scroll', function () {
        var scrollPos = window.scrollY + rowsLen * 0.5, rowPos = Math.floor(scrollPos / rowsLen);
        if ( rowHasPath[rowPos] ) {
            updateDrawPathsInRow(rowPos, scrollPos);
        }
    });

    function updateDrawPathsInRow(pos, scrollPos) {
        var scrollPercentage, drawLength;
        for (var i = 0; i < paths[pos].length; ++i) {
            scrollPercentage  = scrollPos % rowsLen / rowsLen;
            drawLength = pathLen[pos][i] * scrollPercentage;
            paths[pos][i].style.strokeDashoffset = pathLen[pos][i] - drawLength;
        }
    }

}());

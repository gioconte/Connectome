/**
 * Created by giorgioconte on 19/02/15.
 */

init2Dgraph = function (){
    var i,
        j, x, y,
        N = 100,
        E = 500;
        g = {
            nodes: [],
            edges: []
        };

    var data = getDataset();
    var scale = createLinearScale(data);

// Generate a random graph:
    for (i = 0; i < data.length; i++) {
        x = scale(data[i].x);
        y = scale(data[i].y);
        g.nodes.push({
            id: 'n' + i,
            label: data[i].name,
            x: x,
            y: y,
            size: Math.random(),
            color: scaleColorGroup(getRegionByNode(i))
        });
    }


    var matrix = getConnectionMatrix();
    for (i = 0; i < matrix.length; i++) {
        for(j=0; j < i; j++)
            if(matrix[i][j] > getThreshold())
                g.edges.push({
                    id: 's' + i+'t'+j,
                    source: 'n' + i,
                    target: 'n' + j,
                    size: Math.random(),
                    color: '#ccc',
                    hover_color: '#f00'
                });
    }
// Instantiate sigma:
    /*s = new sigma({
        graph: g,
        container: 'graph-container'
    });*/

    s = new sigma({
        graph: g,
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        },
        settings: {
            enableEdgeHovering: true,
            edgeHoverColor: 'edge',
            defaultEdgeHoverColor: '#f00',
            edgeHoverSizeRatio: 1,
            edgeHoverExtremities: true
        }
    });


};



createLinearScale = function (d) {
    var allCoordinates = [];

    for(var i=0; i < d.length; i++) {
        allCoordinates[allCoordinates.length] = d[i].x;
        allCoordinates[allCoordinates.length] = d[i].y;
    }

    centroidScale = d3.scale.linear().domain(
        [
            d3.min(allCoordinates, function(element){
                return element;
            })
            ,
            d3.max(allCoordinates, function(element){
                return element;
            })
        ]
    ).range([0,1]);

    return centroidScale;
}


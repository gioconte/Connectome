/**
 * Created by giorgioconte on 19/02/15.
 */
var s, g, scale;


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
    scale = createLinearScale(data);
/*
// Generate the graph:
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
    */
// Instantiate sigma:
/*    s = new sigma({
        graph: g,
        container: 'graph-container'
    });
*/

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


    //s.startForceAtlas2({worker: true, barnesHutOptimize: true});

    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

    dragListener.bind('startdrag', function(event) {
    });
    dragListener.bind('drag', function(event) {
    });
    dragListener.bind('drop', function(event) {
    });
    dragListener.bind('dragend', function(event) {
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
};



updateGraph = function(){
    var i,row, j, node, edge;

    // s.graph.clear();

    for(i=0; i < nodesSelected.length; i++){
        row = getConnectionMatrixRow(nodesSelected[i]);
        node = {
            id:'n'+nodesSelected[i],
            label:'node'+ nodesSelected[i],
            x: Math.random(),
            y: Math.random(),
            size: 0.5,
            color: scaleColorGroup(getRegionByNode(nodesSelected[i]))
        };

        if(!containsNode(node))
            s.graph.addNode(node);


        s.graph.edges().forEach( function(edge){
            if(edge.value < getThreshold() ){
                s.graph.dropEdge(edge.id);
            }

            }

        );

        for(j=0; j < row.length; j++){
            if(row[j] > getThreshold()){
                node = {
                    id:'n'+j,
                    label: "node"+j,
                    x: Math.random(),
                    y: Math.random(),
                    size: 0.5,
                    color: scaleColorGroup(getRegionByNode(j))
                };



                edge ={
                    id: 's' + nodesSelected[i]+'t'+j,
                    source: 'n' + nodesSelected[i],
                    target: 'n' + j,
                    size: row[j]/10,
                    color: "#f00",
                    type: 'curve',
                    value: row[j]

                };

                if(!containsNode(node)) {
                    s.graph.addNode(node);
                }
                if(!containsEdge(edge))
                    s.graph.addEdge(edge);
            }
        }
    }


    //removing useless nodes

    s.graph.nodes().forEach( function(node){
            if(s.graph.degree(node.id) == 0){
                s.graph.dropNode(node.id)
            }
        }

    )


    s.refresh();
};


containsNode = function (node){
    var nodes = s.graph.nodes();


    for(var el in nodes){
        if(nodes[el].id === node.id){
            return true;
        }
    }

    return false;
};


containsEdge = function (edge){
    var edges = s.graph.edges();


    for(var el in edges){
        if((edges[el].source === edge.source && edges[el].target === edge.target ) || (edges[el].source === edge.target && edges[el].target === edge.source) ){
            return true;
        }
    }

    return false;

};

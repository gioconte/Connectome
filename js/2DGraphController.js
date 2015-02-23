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
            edgeHoverSizeRatio: 3,
            edgeHoverExtremities: true,
            borderSize: 1,
            defaultHoverLabelBGColor: "beige",
            labelHoverShadowColor: "rgba(0,0,0,0)",
            font: "Open Sans",
            edgeColor: "default"

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
    var i,row, j, node, nodeRegion;


    for(i=0; i < nodesSelected.length; i++){
        //row = getConnectionMatrixRow(nodesSelected[i]);
        nodeRegion = getRegionByNode(nodesSelected[i]);
        node = {
            id:nodesSelected[i],
            label:getRegionNameByIndex(nodesSelected[i]),
            x: Math.random(),
            y: Math.random(),
            size: 0.5,
            color: scaleColorGroup(getRegionByNode(nodesSelected[i]))
        };

        if(!containsNode(node) && isRegionActive(nodeRegion))
            s.graph.addNode(node);


        s.graph.edges().forEach( function(edge){
            if(edge.value < getThreshold() ){
                s.graph.dropEdge(edge.id);
            }

            }

        );

        if(thresholdModality)
            drawEdgesGivenNode2d(nodesSelected[i]);
        else
            drawTopNEdgesByNode2D(nodesSelected[i], getNumberOfEdges());
    }


    cleanDisconnetedNodes();

    s.graph.edges().forEach(function (edge){
        edge.color = "rgba(0,0,0,"+ edgeOpacityScale(edge.value)+")"
    })

    s.refresh();
};


cleanDisconnetedNodes = function(){
    s.graph.nodes().forEach( function(node){
            if(s.graph.degree(node.id) == 0 || !isRegionActive(getRegionByNode(node.id))){
                s.graph.dropNode(node.id)
            }
        }
    );

}


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


removeNodeFromGraph = function(nodeIndex) {
    s.graph.dropNode(nodeIndex);

    cleanDisconnetedNodes();

    s.refresh();
};



updateNodesColor = function(){

    s.graph.nodes().forEach( function(node){
       node.color = scaleColorGroup(getRegionByNode(node.id));
    });

    s.refresh();
}


drawEdgesGivenNode2d = function(nodeIndex){
    var j, edge, node, distance,angle, rand;

    node = s.graph.nodes(nodeIndex);


    var row = getConnectionMatrixRow(nodeIndex);
    for(j=0; j < row.length; j++){
        if(row[j] > getThreshold() && isRegionActive(getRegionByNode(j))){
            distance = 1/row[j]*100;
            rand = Math.random();
            angle = rand*2*Math.PI;

            node = {
                id:j,
                label: getRegionNameByIndex(j),
                x: node.x + distance*Math.cos(angle),
                y: node.y + distance*Math.sin(angle),
                size: 0.5,
                color: scaleColorGroup(getRegionByNode(j))
            };

            edge ={
                id: 's' + nodeIndex +'t'+j,
                source: nodeIndex,
                target: j,
                size: row[j]/10,
                color: "rgba(255,0,0,0.5)",
                //type: 'curve',
                value: row[j]

            };

            if(!containsNode(node)) {
                s.graph.addNode(node);
            }
            if(!containsEdge(edge))
                s.graph.addEdge(edge);
        }
    }
};

drawTopNEdgesByNode2D = function (nodeIndex, n) {
    s.graph.edges().forEach(function(edge){
        s.graph.dropEdge(edge.id);
    });

    var row = getTopConnectionsByNode(nodeIndex, n);
    var node,edge;
    for(obj in row){
        if(isRegionActive(getRegionByNode(obj)) && visibleNodes[obj]){
            node = {
                id:parseInt(obj),
                label: getRegionNameByIndex(obj),
                x: Math.random(),
                y: Math.random(),
                size: 0.5,
                color: scaleColorGroup(getRegionByNode(obj))
            };

            edge ={
                id: 's' + nodeIndex +'t'+obj,
                source: nodeIndex,
                target: parseInt(obj),
                size: 10,
                edgeColor: "rgba(0,255,0,0.5)",
                //type: 'curve',
                value: row[obj]

            };

            if(!containsNode(node)) {
                s.graph.addNode(node);
            }
            if(!containsEdge(edge))
                s.graph.addEdge(edge);
        }
    }

};
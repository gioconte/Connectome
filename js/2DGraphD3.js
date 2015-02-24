/**
 * Created by giorgioconte on 21/02/15.
 */

var force;


var linkG, nodeG, labelG, g;

init2Dg = function () {
    force = d3.layout.force()
        .charge(-120)
        .linkDistance(function (d){ return (1/ d.value) *10000;})
        .size([640, 486]);

    g = d3.select("#graph-container").append("svg")
        .attr("id","graph-svg")
        .append("g");


    linkG = g.append("g").classed("links", true);
    nodeG = g.append("g").classed("nodes", true);
    labelG = g.append("g").classed("labels", true);

    update();
};


update = function(){
    var i,el, j,row, rootIndex, targetIndex, k, found;
    var color = scaleColorGroup;

    var data = nodesSelected;

    var nodes = [];
    var links = [];

    for(i=0; i < data.length; i++){

        for(k = 0, found = false; k < nodes.length && !found; k++){
            if(nodes[k].id == data[i]){
                found = true;
                rootIndex = k;
            }
        }

        if(!found){
            el = [];
            el['id'] = data[i];
            el['name'] = getRegionNameByIndex(data[i]);
            el['group'] = getRegionByNode(data[i]);
            rootIndex = nodes.length;
            nodes[nodes.length] = el;
        }

        row = getConnectionMatrixRow(data[i]);
        for(j=0; j < row.length; j++){
            if(row[j] > getThreshold()){

                for(k = 0, found = false; k < nodes.length && !found; k++){
                    if(nodes[k].id == j){
                        found = true;
                        targetIndex = k;
                    }
                }

                if(!found){
                    el = [];
                    el['id'] = j;
                    el['name'] = getRegionNameByIndex(j);
                    el['group'] = getRegionByNode(j);
                    targetIndex = nodes.length;
                    nodes[nodes.length] = el;
                }

                if(j < data[i]) {
                    link = [];
                    link['source'] = rootIndex;
                    link['target'] = targetIndex;
                    link['value'] = row[j];
                }else{
                    link = [];
                    link['source'] = targetIndex;
                    link['target'] = rootIndex;
                    link['value'] = row[j];
                }

                links.push(link);

            }
        }
    }


    //force
    //    .nodes(nodes)
    //    .links(links);

    var link = linkG.selectAll(".link")
        .data(links);

    link.exit().remove();

    link.enter().append("line")
        .attr("class", "link");


    var node = nodeG.selectAll(".node")
        .data(nodes);


    node.exit().remove();

    node.enter().append("circle")
        .attr('id',function(node){
            return node.id;
        })
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function (d) {
            return scaleColorGroup(d.group);
        })
        .call(force.drag)
        .on('mouseover', nodeMouseOver)
        .on('mouseout',nodeMouseOut);

        /*.append("text")
        .attr("text-anchor", "middle")
        .style("fill","#000")
        .text(function (d) {
            return d.name;
        });*/

        /*.append('label')
        .attr('id',function(node){
            return 'l'+node.id;
        })
        .attr('for',function(node){
            return node.id;
        })
        .text(function (node) {
            return node.name;
        });*/

    node.append("title")
        .text(function (d) {
            return d.name;
        });


    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
    });

    nodeG.selectAll('circle').style('fill', function(circle){
            return scaleColorGroup(getRegionByNode(circle.id));
        }
    )
    /*
    var label = labelG.selectAll('label').data(nodes);

    label.exit().remove();

    label.enter().append('label')
        .attr('id',function(node){
            return 'l'+node.id;
        })
        .attr('z-index','2')
        .attr('for',function(node){
            return node.id;
        })
        .text(function (node) {
            return node.name;
        });

    label.exit().remove();*/



    linkG.selectAll('line').style('opacity', function(line){
        return edgeOpacityScale(line.value);
        }
    );


    force.nodes(node.data()).links(link.data());
    force.start();

};



updateHierarchy = function(){
    var el, i,j, hierarchy = [], children;
    var sp = shortestPath;

    var tree = d3.layout.tree()
        .size([640, 486])
        .children(function(d) { return d.children; });


    for(i in sp){
        if(visibleNodes[i]){
            el = {};
            el.id = parseInt(i);
            children = [];
            for(j in previousMap){
                if( visibleNodes[j] && previousMap[j] == parseInt(i) ){
                    children.push(j);
                    console.log("figlio!!");
                }
            }

            el.chidren = children;
            hierarchy.push(el);
        }
    }


    debug = hierarchy;
};



function nodeMouseOver(){
    d3.select(this).attr('r','10');

    setNodeInfoPanel(getRegionByNode(this.id), this.id);
}

function nodeMouseOut(){
    d3.select(this).attr('r','5');
}






/**
 * Created by giorgioconte on 21/02/15.
 */

var force;


var linkG, nodeG, g;

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


                link = [];
                link['source'] = rootIndex;
                link['target'] = targetIndex;
                link['value'] = row[j];

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
        .attr("class", "link")
        .style("stroke-width", '1');

    var node = nodeG.selectAll(".node")
        .data(nodes);


    node.exit().remove();

    node.enter().append("circle")
        .attr('id',node.id)
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function (d) {
            return scaleColorGroup(d.group);
        })
        .call(force.drag);

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
    );

    force.nodes(node.data()).links(link.data());
    force.start();

};






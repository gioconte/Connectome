/**
 * Created by giorgioconte on 21/02/15.
 */

var force;
dummyDataA = [52,63]
dummyDataB = [16, 34]
var dummyData = dummyDataA;

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


/*init2Dg = function() {
        var i,el, j,row, rootIndex, targetIndex, k, found;
        var color = scaleColorGroup;

        force = d3.layout.force()
            .charge(-120)
            .linkDistance(function (d){ return (1/ d.value) *10000;})
            .size([640, 486]);

        var g = d3.select("#graph-container").append("svg")
            .attr("id","graph-svg")
            .append("g");


        var data = dummyData;


        linkG = g.append("g").classed("links", true);
        nodeG = g.append("g").classed("nodes", true);

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

                    //link['source'] = data[i];
                    //link['target'] = j;

                    link['value'] = row[j];

                    links.push(link);

                }
            }
        }



            force
                .nodes(nodes)
                .links(links);

            var link = linkG.selectAll("g.link")
                .data(links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", '1');

            var node = nodeG.selectAll("g.node")
                .data(nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function (d) {
                    return color(d.group);
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

        force.start();

    };*/

/*
updateGraphD3 = function(){
    var nodes;
    var links;

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([640, 486])
        .nodes(nodes)
        .links(links);

    var svg = d3.select("#graph-container").append("svg")
        .attr("id","graph-svg");


    var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class','link');

    var node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('circle')
        .attr('class','node');

    node.attr('r', width/25)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });


    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

};
*/

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

    
    node.enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function (d) {
            return scaleColorGroup(d.group);
        })
        .call(force.drag);

    node.exit().remove();

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

    console.log(node.data());
    force.nodes(node.data()).links(link.data());
    force.start();

}

/*
dummyDataA = [52,63];
dummyDataB = [16];


window.setInterval(switchData, 2000);

function switchData() {
    dummyData = (dummyData == dummyDataA) ? dummyDataB : dummyDataA;
    update();
}*/





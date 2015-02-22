/**
 * Created by giorgioconte on 21/02/15.
 */

    init2Dg = function() {
        var i,el,j;
        var color = scaleColorGroup;



        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([640, 486]);;

        var svg = d3.select("#graph-container").append("svg")
            .attr("id","graph-svg");
        var data = getDataset();

        var nodes = [];
        var links = [];

        for(i=0; i < data.length; i++){
            el = [];
            el['name'] = data[i].name;
            el['group'] = data[i].group;
            nodes.push(el);
        }


        var matrix = getConnectionMatrix();


        for(i=0; i < matrix.length; i++){
            for(j=0;  j < i; j++){
                el = [];
                if( matrix[i][j] > 200){
                    el['source'] = i;
                    el['target'] = j;
                    el['value'] = matrix[i][j];
                    links.push(el);
                }
            }
        }
        debug = links;

            force
                .nodes(nodes)
                .links(links)
                .start();

            var link = svg.selectAll(".link")
                .data(links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

            var node = svg.selectAll(".node")
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

    }

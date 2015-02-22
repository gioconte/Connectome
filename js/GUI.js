/**
 * Created by giorgioconte on 31/01/15.
 */


initGUI = function() {
    var uploadMenu = d3.select("#upload");

    uploadMenu.append("button")
        .text("Upload Centroids")
        .attr("id", "centroidUploadBtn")
        .append("input")
        .attr("type", "file")
        .attr("id", "centroids")
        .on("change", function () {
            var f = document.getElementById("centroids");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                console.log("complete uploading centroids");
                                setCentroids(results);
                                //updateScene();
                            }
                        }
                    )};
                reader.readAsDataURL(f.files[0]);
            }
        });


    uploadMenu.append("button")
        .text("Upload labelKey")
        .attr("id", "labelKeyUploadBtn")
        .append("input")
        .attr("type", "file")
        .attr("id","labelKey")
        .on("change", function () {
            var f = document.getElementById("labelKey");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log("On load event");
                    console.log(e);
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            dynamicTyping: true,
                            header: false,
                            complete: function (results) {
                                console.log("complete Uploading Label Keys ");
                                setLabelKeys(results);
                            }
                        }
                    );
                };
                reader.readAsDataURL(f.files[0]);
            }
        });
    /*
    uploadMenu.append("button")
        .text("Upload LookUpTable")
        .attr("id", "groupUploadButton")
        .append("input")
        .attr("type","file")
        .attr("id","lookUpTable")
        .on("change", function(){
            console.log("on Change Event look up table");

            var f = document.getElementById("lookUpTable");

            if(f.files && f.files[0]){
                var reader = new FileReader();
                reader.onload = function(e){
                    console.log("On load event LookUpTable");
                    v = e.target.result;

                    console.log("Parsing LookUpTable");
                    Papa.parse(v, {
                        download: true,
                        delimiter: ",",
                        dynamicTyping: true,
                        header: false,
                        complete: function(results){
                            setLookUpTable(results);
                            console.log("look Up Table Uploaded");
                        }
                    })

                };
                reader.readAsDataURL(f.files[0]);
            }
        });*/
    
    /*uploadMenu.append("button")
        .text("Upload Regions Group")
        .attr("id", "groupUploadButton")
        .append("input")
        .attr("type", "file")
        .attr("id", "group")
        .on("change", function () {
            var f = document.getElementById("group");

            if(f.files && f.files[0]){
                var reader = new FileReader();
                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                        download: true,
                        delimiter: ',',
                        dynamicTyping: true,
                        header: false,
                        complete: function(results){
                            setGroup(results);
                        }
                    })
                }
                reader.readAsDataURL(f.files[0]);
            };

        });*/

    uploadMenu.append("button")
        .text("Upload Connections")
        .attr("id","uploadConnectionsButton")
        .append("input")
        .attr("type","file")
        .attr("id","connections")
        .on("change", function() {
            f = document.getElementById("connections");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                        download: true,
                        delimiter:',',
                        dynamicTyping: true,
                        header: false,
                        complete: function (results) {
                            console.log("Connection Matrix uploaded");
                            setConnectionMatrix(results);
                        }
                    })
                };
                reader.readAsDataURL(f.files[0]);
            }
        });

    uploadMenu.append("button")
        .text("Start Visualization")
        .attr("id", "startVisualization")
        .on("click", function() {
            if(lookUpTable && labelKeys && centroids && connectionMatrix){
                initCanvas();
            } else
            {
                console.log("data are missing");
            }

        });




};

/*
 * This method removes the start button so that is not possible to create more than one scene and
 * renderer.
 */
removeStartButton = function(){
    var elem = document.getElementById('startVisualization');
    elem.parentNode.removeChild(elem);
};

setNodeInfoPanel = function (regionName, index){
    var panel = document.getElementById('nodeInfoPanel');

    while (panel.firstChild) {
        panel.removeChild(panel.firstChild);
    }

    var connectionRow = getConnectionMatrixRow(index);

    var nodalStrength = computeNodalStrength(connectionRow);

    nodalStrength = Math.floor(nodalStrength*100)/100;
    var para = document.createElement("p");
    var node = document.createTextNode(index+ " " + regionName + " " + nodalStrength);
    panel.appendChild(para)
        .appendChild(node);

};


addThresholdSlider = function (){

    var menu = d3.select("#edgeInfoPanel");
    menu.append("label")
        .attr("for", "thresholdSlider")
        .attr("id", "thresholdSliderLabel")
        .text("Threshold");

    menu.append("input")
        .attr("type", "range")
        .attr("value", "30")
        .attr("id", "thresholdSlider")
        .attr("min","0")
        .attr("max", getMaximumWeight())
        .on("change", function () {

            var slider = document.getElementById("thresholdSlider");
            setThreshold(slider.value);
            updateScene();
            updateGraph();
        });

    menu.append("output")
        .attr("for","thresholdSlider")
        .attr("id", "thresholdOutput")

    document.getElementById("thresholdOutput").value = getThreshold();


};


setInfoLabel = function(regionName, index){

    var nodalStrength = computeNodalStrength(getConnectionMatrixRow(index));

    var body = document.body;

    var canvas = document.getElementsByTagName("canvas");

    var label = document.createElement("div");


    label.setAttribute("width", "100px");
    label.setAttribute("height", "100px");
    label.setAttribute("background-color", "white");
    label.setAttribute("position", "fixed");
    label.setAttribute("left", "100px");
    label.setAttribute("z-index", "9");
    label.setAttribute("bottom", "200px");

    var para = document.createElement("p");
    var node = document.createTextNode("CIAO");


    body.appendChild(label).appendChild(para).appendChild(node);


/*
    canvas.append('div')
        .attr("width", "100px")
        .attr("height", "50px")
        .attr("z-index", "2")
        .attr("class", "menu")
        .attr("position", "absolute")
        .attr("left", "100px")
        .attr("bottom", "400px");*/



};




/*
 * This method is used to create the legend panel.
 */
var createLegend = function () {
    var legendMenu = document.getElementById("legend");

    while(legendMenu.hasChildNodes()){
        legendMenu.removeChild(legendMenu.childNodes[0]);
    }


    //var scaleColorGroup = d3.scale.category20();
    legendMenu = d3.select("#legend");




    var activeGroup = getActiveGroup();
    var l = activeGroup.length;
    document.getElementById("legend").style.height = 25*l+"px";
    for(var i=0; i < l; i++){
        var elementGroup = legendMenu.append("g")
            .attr("transform","translate(10,"+i*25+")")
            .attr("id",activeGroup[i])
            .on("click", function(){
                toggleRegion(this.id);
            });
        elementGroup.append("circle")
            .attr("cx",5)
            .attr("cy",10)
            .attr("fill",scaleColorGroup(activeGroup[i]))
            .attr("r",8);

        //choose color of the text
        var textColor;
        if(regionsActivated[activeGroup[i]]){
            textColor = "rgb(191,191,191)";
        } else{
            textColor = "rgb(0,0,0)";
        }

        elementGroup.append("text")
            .text(activeGroup[i])
            .attr("font-family","'Open Sans',sans-serif")
            .attr("font-size","15px")
            .attr("x",20)
            .attr("y",10)
            .attr("text-anchor","left")
            .attr("dy",5)
            .attr("fill",textColor);
    }
};


var updateEdgeLegend = function(){

};



var addDistanceSlider = function (distances) {
    var menu = d3.select("#edgeInfoPanel");

    menu.append("br");

    menu.append("label")
        .attr("for", "distanceThresholdSlider")
        .attr("id", "distanceThresholdSliderLabel")
        .text("Max Distance");

    var meanDistance = d3.mean(distances);

    var maxDistance = d3.max(distances);


    menu.append("input")
        .attr("type", "range")
        .attr("value", meanDistance)
        .attr("id", "distanceThresholdSlider")
        .attr("min","0")
        .attr("max", maxDistance)
        .attr("step", maxDistance/1000)
        .on("change", function () {
            var slider = document.getElementById("distanceThresholdSlider");

            //console.log("on Change distance threshold value:" + slider.value);
            setDistanceThreshold(slider.value);
            drawShortestPath(root);
        });


    menu.append("output")
        .attr("for","distanceThresholdSlider")
        .attr("id", "distanceThresholdOutput");

    setDistanceThreshold(meanDistance);
};


removeThresholdSlider = function(){

    var elem = document.getElementById('thresholdSlider');

    if(elem) {
        elem.parentNode.removeChild(elem);
    }


    elem = document.getElementById('thresholdOutput');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

    elem = document.getElementById('thresholdSliderLabel');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
};

addModalityButton = function () {
    console.log("modality btn added");
    var menu = d3.select("#upload");

    menu.append("button")
        .text("Change Modality")
        .attr("id", "changeModalityBtn")
        .append("input")
        .attr("type","checkbox")
        .attr("id","changeModalityInput")
        .attr("checked", "true")
        .on("change", function () {
            changeModality(this.checked);
            updateScene();
        });

}


changeModality = function(modality){
    thresholdModality = modality;

    if(modality){
        //if it is thresholdModality
        removeTopNSlider();
        addThresholdSlider();

    } else{
        //top N modality
        removeThresholdSlider();
        addTopNSlider();
    }

};

addTopNSlider = function(){
    var menu = d3.select("#edgeInfoPanel")


    menu.append("label")
        .attr("for", "topNThresholdSlider")
        .attr("id", "topNThresholdSliderLabel")
        .text("Number of Edges");

    menu.append("input")
        .attr("type", "range")
        .attr("value", getNumberOfEdges())
        .attr("id", "topNThresholdSlider")
        .attr("min","0")
        .attr("max", "20")
        .attr("step", "1")
        .on("change", function () {
            setNumberOfEdges(this.value);
            updateScene();
        });

    menu.append("output")
        .attr("for","topNThresholdSlider")
        .attr("id", "topNThresholdSliderOutput")
        .text(getNumberOfEdges());

};


removeTopNSlider= function () {

    var elem = document.getElementById('topNThresholdSlider');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

    elem = document.getElementById('topNThresholdSliderOutput');

    if(elem) {
        elem.parentNode.removeChild(elem);
    }


    elem = document.getElementById('topNThresholdSliderLabel');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
};


removeElementsFromEdgePanel = function(){
    removeThresholdSlider();
    removeTopNSlider();
};


removeUploadButtons= function (){
    var menu = document.getElementById("upload");
    while(menu.hasChildNodes()){
        menu.removeChild(menu.children[0]);
    }
};


addGroupList = function () {
    var menu = d3.select("#upload");

    menu.append("input")
        .attr("type", "radio")
        .attr("name","colorGroup")
        .attr("id","anatomy")
        .attr("value","0")
        .attr("checked","true")
        .on("change", function () {
            changeColorGroup(this.value);
        });
    menu.append("label")
        .attr("for","anatomy")
        .text("Anatomy");

    menu.append("br")

    menu.append("input")
        .attr("type", "radio")
        .attr("name","colorGroup")
        .attr("id","place")
        .attr("value","1")
        .on("change", function () {
            changeColorGroup(this.value);
        });


    menu.append("label")
        .attr("for","place")
        .text("Place");

    menu.append("br")

    menu.append("input")
        .attr("type", "radio")
        .attr("name","colorGroup")
        .attr("value","2")
        .attr("id","richClub")
        .on("change", function () {
            changeColorGroup(this.value);
        });

    menu.append("label")
        .attr("for","richClub")
        .text("Rich Club");

    menu.append("br");
};
// Defining the URL
const url = "samples.json";


// Reading D3
d3.json(url).then(function(data)
{
    console.log(data);
    var metadata = data.metadata;
    console.log(metadata);
    var names = data.names;
    console.log(names);
    var samples = data.samples;
    console.log(samples);

// populate dropdownbar

    var ddMenu = d3.select("#selDataset");
    ddMenu.on("change",updateAll);
    ddMenu.selectAll("option").remove();
    names.forEach(function(id){
        var option=ddMenu.append("option").text(id);
        option.attr("value",id);
    });

    updateAll();

    function updateAll() {
        var name= d3.select("#selDataset").property("value");
        var selectID = {}
        for(i=0;i<names.length;i++) {
            if ( names[i] == name) {
                selectID = names[i];
                break;
            }
        }
        console.log(selectID);

// calling the demographics, bargraph and bubble graph
        DemoInfo(selectID,metadata);
        bargraph(selectID,samples);
        bubblegraph(selectID,samples);
    }

// Function for demographic info
    function DemoInfo(selectID,metadata) {
        var demo = d3.select("#sample-metadata");
        demo.html("");
        var meta=demo.append("ul").classed("list-group", true);
        metadata.forEach(item => {
            if(item.id == parseInt(selectID)){
                Object.entries(item).forEach( KV => {
                    meta.append("li").classed("list-group-item",true).text(`${KV[0]}:${KV[1]}`);
                });
            }
        });
    }

// Function for bar graph
    function bargraph(selectID,samples) {

          // Sort the data by search results
    var sample1=[];
    samples.forEach(sample => {
        if ( sample.id == selectID) {
            sample1 = sample;
        }
    });

    dict_id = [];

    for (i=0;i<80;i++) {
    var otu_id = sample1.otu_ids[i] + " OTU";
    var sample_value= sample1.sample_values[i];
    var otu_label=sample1.otu_labels[i];

    dict_id.push({"otu_id":otu_id, "Sample_Value": sample_value, "otu_label":otu_label });
    }

    console.log(dict_id);

    var sortedBySamplevalues = dict_id.sort((a, b) => b.sample_value - a.sample_value);
    console.log(sortedBySamplevalues)

    // Slice the first 10 objects for plotting
    slicedData = sortedBySamplevalues.slice(0, 10);
    console.log(slicedData)

    // Reverse the array to accommodate Plotly's defaults
    reversedData = slicedData.reverse();
    //reversedData = slicedData;

    var x= reversedData.map(object => object.Sample_Value);
    console.log(x);
    var y = reversedData.map(object => object.otu_id);
    console.log(y);
    var text = reversedData.map(object => object.otu_label);
    console.log(text);

// Trace1 for the Horizontal Data
    var trace1 = {
    x: reversedData.map(object => object.Sample_Value),
    y: reversedData.map(object => object.otu_id),
    text: reversedData.map(object => object.otu_label),
    name: "Top 10 OTUs",
    type: "bar",
    orientation: "h"
    };

// data
    var data = [trace1];

// Apply the group bar mode to the layout
    var layout = {
    title: "Top 10 OTUs in the Individual - Horizontal Bar Chart",
    xaxis: { title: 'Sample Values'},
    yaxis: { title: 'OTU IDs'},
    margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
    }
    };

// Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", data, layout);
 }

 // Function for bubble graph
 function bubblegraph(selectID,samples) {

    var sample1=[];
    samples.forEach(sample => {
        if ( sample.id == selectID) {
            sample1 = sample;
        }
    });

// Defining the trace for bubble graph

    var trace1 = {
        x: sample1.otu_ids,
        y: sample1.sample_values,
        text: sample1.otu_labels,
        mode: 'markers',
        marker: {
        color: sample1.otu_ids,
        size: sample1.sample_values
        }
      };
      
      var bubble_data = [trace1];

// Defining the layout for bubble graph

      var bubble_layout = {
        title: 'OTU IDs vs Sample Values - Bubble Graph',
        xaxis: { title: 'OTU IDs'},
        yaxis: { title: 'Sample Values'},
        showlegend: false,
        height: 600,
        width: 1200
      };

// Render the plot to the bubble tag
      Plotly.newPlot('bubble', bubble_data, bubble_layout);

  }

});
const url = "samples.json";

d3.json(url).then(function(data)
{
    console.log(data);
    var metadata = data.metadata;
    console.log(metadata);
    var names = data.names;
    console.log(names);
    var samples = data.samples;
    console.log(samples);
    var sample1 = data.samples[0];
    console.log(sample1);
    var id = sample1.id;
    console.log(id);
    var otu_ids= sample1.otu_ids;
    console.log(otu_ids);
    var values= sample1.sample_values;
    console.log(values);

  var trace1 = {
    x: otu_ids,
    y: values,
    mode: 'markers'
  };
  
  var bubble_data = [trace1];
  
  var bubble_layout = {
    title: 'Marker Size and Color',
    showlegend: false,
    height: 600,
    width: 800
  };
  
  Plotly.newPlot('bubble', bubble_data, bubble_layout);


  // Sort the data by search results
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
  title: "Top 10 OTUs in the Individual ",
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  }
};

// Render the plot to the div tag with id "bar"
Plotly.newPlot("bar", data, layout);
});


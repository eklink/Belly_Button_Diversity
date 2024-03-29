var plotData = [];

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`
    d3.json(url).then(function(response){
      console.log(response)
        
      var table = d3.select("#sample-metadata").html("")
      
      var cell = table.append("td");
      Object.entries(response).forEach(([key, value]) => {
        var row = cell.append("tr");
        row.text(`${key}: ${value}`);
      });  
  
    // Use `.html("") to clear any existing metadata
    // PANEL.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    //Object.defineProperties(sampleData).forEach(([key, value]) => {
    //  PANEL.append('h6').text(`${key}: ${value}`);
    //  })
    });
    console.log("build metdata");

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  
  var plotDataset = `/samples/${sample}`
  console.log("plotDataset=", plotDataset);
  d3.json(plotDataset).then(function(plotData){
    console.log("plotData=", plotData);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
//d3.json('/samples/${sample}').then((sampleData)=> {
 // console.log(sampleData)
  //const otu_ids = sampleData.otu_ids;
  //const otu_labels = sampleData.otu_labels;
 // const sample_values = sampleData.sample_values;
//})
    // @TODO: Build a Bubble Chart using the sample data

    var bubbleChart = {
      x: plotData.otu_ids,
      y: plotData.sample_values,
      mode: "markers",
      marker: {
        color: plotData.otu_ids,
        size: plotData.sample_values
        
        
      },
      text: plotData.otu_labels
    };

    var bubbleLayout = {
      height: 600,
      width: 1200,
      
  };

    var bubbleData = [bubbleChart]

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart

    var pieChart = {
      values: plotData.sample_values.slice(0,10),
      labels: plotData.otu_ids.slice(0,10),
      text: plotData.otu_labels.slice(0,10),
      hoverinfo: plotData.otu_labels.slice(0,10),
      type: "pie"
    };

    var pieData = [pieChart];
    var pieLayout = {
      height: 500,
      width: 600,
    };

    Plotly.newPlot("pie", pieData, pieLayout);

  });
    console.log("build charts function");
};
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log("in the end of init function");
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  console.log("optionchanged function");
  
}

// Initialize the dashboard
init();

var prevTabIdx = 0;
const SCRIPT_ROOT = 'http://127.0.0.1:5000/';
var margin = { top: 30, right: 30, bottom: 50, left: 40 },
    width = 660 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
var categories = ['cluster 1', 'cluster 2', 'cluster 3'];

let clusterNoURL = `${SCRIPT_ROOT}/clusterNo`;
let DataURL = `${SCRIPT_ROOT}/data`;

var clusterNo =[], features=['fixed acidity','volatile acidity','citric acid','residual sugar','chlorides','free sulfur dioxide','total sulfur dioxide','density','pH','sulphates','alcohol'];
var selectedFeature = [];

async function fetchData(URL) {
  const response = await fetch(URL);
  const jsonData = await response.json();
  return jsonData;
}

async function storeData(URL) {
  let data = await fetchData(URL);
  // Do something with the data
  return data;
}

function openTask(evt, idx) {
  const navbar = document.getElementsByClassName("navbar");
  const content = document.getElementsByClassName("tab");

  navbar[prevTabIdx].classList.toggle("active-btn")
  content[prevTabIdx].classList.toggle("active-tab")
  navbar[idx].classList.toggle("active-btn")
  content[idx].classList.toggle("active-tab")

  prevTabIdx = idx;
  if(idx===0){
    selectedFeature = [];
  }else if (idx ===2){
    fetch(DataURL).then(res=>res.json()).then(
    data=>{
        // console.log(data, selectedFeature);
        PCP("#pcp-2", data, selectedFeature);
    }
)
  }
}

function addChartLabels(container, xLabel, yLabel, title){
    container.append("text")
    .attr("class", "chart-title")
    .attr("transform", `translate(${width/2},${-10})`)
    .attr("text-anchor", "middle")
    .attr('font-size', '24px')
    .text(title);

  // Append the x-axis label
  container.append("text")
    .attr("class", "x-label")
    .attr("transform", `translate(${width/2},${height+margin.bottom})`)
    .attr("text-anchor", "middle")
    .text(xLabel);

  // Append the y-axis label
  container.append("text")
    .attr("class", "y-label")
    .attr("transform", `translate(${-margin.left},${height/2}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yLabel);
}

function addLegend(svg) {
  // Define the legend size and position
  const legendWidth = 100;
  const legendHeight = 20 * categories.length+10;
  const legendX = 10;
  const legendY = 10;

  // Create a group element for the legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width-margin.right-margin.left-legendX) + "," + legendY + ")");

  // Add a rectangle to the legend for the background
  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "#ffffff")
    .style("stroke", "#000000");

  // Add a circle and label for each color
  const legendItems = legend.selectAll(".legend-item")
    .data(categories)
    .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", function(d, i) { return "translate(10," + (20 * i+10) + ")"; });

  legendItems.append("circle")
    .attr("cx", 5)
    .attr("cy", 5)
    .attr("r", 5)
    .style("fill", function(d, i) { return colorScale(i); });

  legendItems.append("text")
    .attr("x", 15)
    .attr("y", 9)
    .text(function(d, i) { return categories[i]; });
}

storeData(clusterNoURL).then(
  (data) =>{
    clusterNo = data;
    // console.log(data);
  }
);

var prevTabIdx = 0;
var originX=0;
var originY = 0;
function openTask(evt, idx) {
    const navbar = document.getElementsByClassName("navbar");
    const content = document.getElementsByClassName("tab");

    navbar[prevTabIdx].classList.toggle("active-btn")
    content[prevTabIdx].classList.toggle("active-tab")
    navbar[idx - 1].classList.toggle("active-btn")
    content[idx - 1].classList.toggle("active-tab")

    prevTabIdx = idx - 1;
}
const SCRIPT_ROOT = 'http://127.0.0.1:5000/';

var margin = { top: 30, right: 30, bottom: 50, left: 40 },
    width = 660 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var output = document.getElementById("demo");

var d_i = 2;
output.innerHTML = d_i;

function addChartLabels(container, xLabel, yLabel, title){
    container.append("text")
    .attr("class", "chart-title")
    .attr("transform", `translate(${width/2},${-margin.top})`)
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
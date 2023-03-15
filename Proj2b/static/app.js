var prevTabIdx = 0;
const SCRIPT_ROOT = 'http://127.0.0.1:5000/';
var margin = { top: 30, right: 30, bottom: 50, left: 40 },
    width = 660 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;



var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
var categories = ['cluster 1', 'cluster 2', 'cluster 3'];
var clusterNoURL = `${SCRIPT_ROOT}/clusterNo`;
var clusterNo =[];

async function getCluster() {
  const res = await fetch(clusterNoURL)
  clusterNo = await res.json();
  // console.log(clusterNo)
}
getCluster();

function openTask(evt, idx) {
    const navbar = document.getElementsByClassName("navbar");
    const content = document.getElementsByClassName("tab");

    navbar[prevTabIdx].classList.toggle("active-btn")
    content[prevTabIdx].classList.toggle("active-tab")
    navbar[idx].classList.toggle("active-btn")
    content[idx].classList.toggle("active-tab")

    prevTabIdx = idx;
}
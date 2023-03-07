function scatterPlot(id, data, x, y){
    d3.select(id).selectAll('*').remove()
    const margin = { top: 20, right: 0, bottom: 20, left: 30 },
    width = 310 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;
    const svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => +d[x]), d3.max(data, d => +d[x])])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => +d[y]), d3.max(data, d => +d[y])])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(+d[x]))
        .attr("cy", d => yScale(+d[y]))
        .attr("r", 3)
        .style("fill", (d, i) =>{ return colorScale(clusterNo[i]); });

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);
}

function updateTask2(){
    const SSLoading = `${SCRIPT_ROOT}/SumSquareLoadings/${d_i}`;
    
    fetch(SSLoading).then( res=>res.json())
    .then(
        data=>{
            table = JSON.parse(data.table);
            scatter = JSON.parse(data.scatter);
            // console.log(table);
            // console.log(scatter);

            createTable('#table-container', table);
            createScatter(scatter)

        }
    )

}

function createTable(id, data){
    const container = d3.select(id);
    container.selectAll('*').remove();

    const table = container.append('table')

    const headers = table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(Object.keys(data[0]))
        .enter()
        .append("th")
        .text(d => d);


    const rows = table.append("tbody")
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    
    rows.selectAll("td")
        .data(function(d) { return Object.values(d); })
        .enter()
        .append("td")
        .text(function(d) { return d; });

}

function createScatter(data){
    const names = Object.keys(data[0]);
    d3.selectAll('.diagonal')
        .html( (d,i)=> `<p>${names[i]}</p>`);
    
    const diag = ['a', 'f', 'k', 'p']
    const row =[['b', 'c', 'd'],
    ['e', 'g', 'h'],
    ['i', 'j', 'l'],
    ['m', 'n', 'o']]

    for (let i = 0; i < diag.length; i++) {
        const feature1 = names[i];
        const curDia = diag[i];
        // console.log('ID', curDia);
        for (let j = 0, k=0; j < row[0].length; j++, k++) {
            const curID = row[i][j];
            let feature2 = names[k];
            if(k===i){
                k++;
                feature2=names[k];
            }
            scatterPlot('.'+curID, data, feature1, feature2);
            // console.log(`rowID:${curID}, feature1: ${feature1}, feature2: ${feature2}`);
        }        
    }

}

updateTask2();


const legendCont=d3.select('#legend-container')
    .append("svg")
    .style("width", 100 + 'px')
    .style("height", 70 + 'px')
    .append("g");


legendCont.append("rect")
    .attr("width", 100)
    .attr("height", 70)
    .style("fill", "#ffffff")
    .style("stroke", "#000000")
    .style("margin", "0")
    .style("display", "inline-block");

const legendItems = legendCont.selectAll(".legend-item")
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
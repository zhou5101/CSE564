const pca_url = `${SCRIPT_ROOT}/PCA`

var margin = { top: 10, right: 30, bottom: 90, left: 40 },
    width = 660 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;


fetch(pca_url).then(
    response => response.json()
).then(
    data => {
        // console.log(data);
        // append the svg object to the body of the page
        var svg = d3.select("#scree")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) { return d.FeatureName; }))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("font-size", "14px")
            .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.EigenValue; }) + 0.5])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.FeatureName); })
            .attr("y", function (d) { return y(d.EigenValue); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.EigenValue); })
            .attr("fill", "#69b3a2");
        //tool tip
        var div = d3.select("#scree").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("width", `${100}px`)
            .style("height", `${20}px`)
            .style("text-align", "center")
            .style("vertical-align", "middle");
        //circles
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function (d) { return x(d.FeatureName) + 20; })
            .attr("cy", function (d) { return y(d.EigenValue); })
            .attr("fill", "royalblue")
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<p>${d.EigenValue}</p>`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        var line = d3.line()
            .x(function (d) { return x(d.FeatureName) + 20; })
            .y(function (d) { return y(d.EigenValue); });

        svg.append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", "royalblue")
            .attr("stroke-width", 2);

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Red Wine Quality Scree Plot");
    }
)
const biplotUrl = `${SCRIPT_ROOT}/biPlot`
fetch(biplotUrl).then(response=>response.json)
.then(data=>{
    loadingData = data.loadings;
    pcaData = data.pca;
    const svg = d3.select("#biplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .range([height, 0]);
})


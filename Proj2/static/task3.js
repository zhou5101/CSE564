const elbowURL = `${SCRIPT_ROOT}/elbow`;
fetch(elbowURL).then(res => res.json())
.then(
    data=>{
        // console.log(data);
        screePlot('#k-mean-elbow',data);
    }
);

function screePlot(id, data){
    const svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .range([0, width])
        .domain([1,10])

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "14px")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)*1.1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
        
    const line = d3.line()
        .x(function (d,i) { return x(i+1); })
        .y(function (d) { return y(d); });
    
    svg.append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "royalblue")
        .attr("stroke-width", 2);
    //circles
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d, i) { return x(i+1); })
        .attr("cy", function (d) { return y(d); })
        .attr("fill", function(d,i){ return i==3?"red":"royalblue";});

    svg.append("line")
        .attr('x1', x(1))
        .attr('y1', y(data[0]))
        .attr('x2', x(10))
        .attr('y2', y(data[9]))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 2);

    svg.append("line")
        .attr('x1', x(4))
        .attr('y1', y(data[3]))
        .attr('x2', x(6.1))
        .attr('y2', y(859000))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 3);

    addChartLabels(svg, 'Value of K', "Inertia", "The Elbow Method Using Inertia");
};

const cluster =`${SCRIPT_ROOT}/cluster`;
fetch(cluster).then(res => res.json())
.then(
    data=>{
        const svg = d3.select('#k-mean-cluster')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        const minx = d3.min(data, d => d.PC1), maxx = d3.max(data, d => d.PC1);
        const x = d3.scaleLinear()
            .range([0, width])
            .domain([minx,maxx])

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "14px")
            .style("text-anchor", "end");

        // Add Y axis
        const miny = d3.min(data, d => d.PC2), maxy = d3.max(data, d => d.PC2);
        const y = d3.scaleLinear()
            .domain([miny, maxy])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        svg.selectAll(".data-point")
            .data(data)
            .enter().append("circle")
            .attr("class", "data-point")
            .attr("cx", function(d) { return x(d.PC1); })
            .attr("cy", function(d) { return y(d.PC2); })
            .attr("r", 3)
            .style("fill", function(d) { return colorScale(d.cluster); });

        addChartLabels(svg, "PC1", 'PC2', 'K-Mean Clutering')
    }
)
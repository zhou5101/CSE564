//scree plot
const pca_url = `${SCRIPT_ROOT}/eigenvalue`;
fetch(pca_url).then(
    response => response.json()
).then(
    data => {
        // console.log(data);
        // append the svg object to the body of the page
        const Eigenval = JSON.parse(data.eigen_vals);
        const EigenRatio = JSON.parse(data.eigen_ratios);
        // console.log(Eigenval);
        // console.log(EigenRatio);

        var svg = d3.select("#scree")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([0, width])
            .domain(Eigenval.map((x, index)=>index+1))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            // .attr("transform", "translate(-10,0)rotate(-45)")
            .style("font-size", "14px")
            .style("text-anchor", "end");

        var div = d3.select("#scree").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("width", `${100}px`)
            .style("height", `${20}px`)
            .style("text-align", "center")
            .style("vertical-align", "middle");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
            .data(Eigenval)
            .enter()
            .append("rect")
            .attr("x", function (d, i) { return x(i+1); })
            .attr("y", function (d) { return y(d.Eigenval); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.Eigenval)})
            .attr("fill", "#69b3a2")
            .style("cursor", "pointer")
            .on("click", (evt, d)=>{
                console.log(Eigenval.indexOf(d));
                d_i = Eigenval.indexOf(d)+1;
                output.innerHTML = d_i;
                updateBiplot();
                updateTask2();
            })
            .on("mouseover", function (event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<p>${d.Eigenval}</p>`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        //circles
        svg.selectAll("dot")
            .data(EigenRatio)
            .enter().append("circle")
            .attr("r", 2)
            .attr("cx", function (d, i) { return x(i+1)+20; })
            .attr("cy", function (d) { return y(d.EigenRatio); })
            .attr("fill", "royalblue")
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<p>${d.EigenRatio}</p>`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        var line = d3.line()
            .x(function (d,i) { return x(i+1)+20; })
            .y(function (d) { return y(d.EigenRatio); });

        svg.append("path")
            .attr("d", line(EigenRatio))
            .attr("fill", "none")
            .attr("stroke", "royalblue")
            .attr("stroke-width", 2);

        addChartLabels(svg, 'Principal Component', 'Variance Explained(%)', 'Red Wine PCA');
    }
)


//biplot
const biplotUrl = `${SCRIPT_ROOT}/biplot`
fetch(biplotUrl).then(response=>response.json())
.then(data=>{
    loadings = JSON.parse(data.loadings);
    pca = JSON.parse(data.pca);
    feature = JSON.parse(data.feature);
    loadings = loadings.slice(0, d_i);

    const svg = d3.select('#biplot')
        .append("svg")
        .attr("class", "biplotG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('overflow', 'visible')
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const minx = d3.min(pca, d => d.PC1), maxx = d3.max(pca, d => d.PC1);
    const miny = d3.min(pca, d => d.PC2), maxy = d3.max(pca, d => d.PC2);
    
    const scaleX = 1/(maxx-minx);
    const scaleY = 1/(maxy-miny);

    const xScale = d3.scaleLinear()
        .domain([minx*scaleX, maxx*scaleX])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([miny*scaleY, maxy*scaleY])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll("circle")
        .data(pca)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.PC1*scaleX))
        .attr("cy", d => yScale(d.PC2*scaleY))
        .attr("r", 3)
        .style("fill", "#69b3a2");
    originX = xScale(0);
    originY = yScale(0);
    svg.selectAll("line")
        .data(loadings)
        .enter()
        .append("line")
        .attr("class", "biplot-line")
        .attr("x1", xScale(0))
        .attr("y1", yScale(0))
        .attr("x2", d=> xScale(0)+width*d.x*0.6)
        .attr("y2", d=> yScale(0)+height*d.y*0.6)
        .attr("stroke-width", 2)
        .attr("stroke", "royalblue");
        // .attr("marker-end", "url(#arrowhead)");

    svg.selectAll("text")
        .data(loadings)
        .enter().append("text")
        .attr("class", "biplot-label")
        .attr("x", d=> xScale(0)+width*d.x*0.6)
        .attr("y", d=> yScale(0)+height*d.y*0.6)
        .style("text-anchor", "middle")
        .text((d,i)=>feature[i].feature);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        // .attr("transform", `translate(${width}, 0)`)
        .call(yAxis);

    addChartLabels(svg, 'PC1', 'PC2', 'Biplot of Red Wine PCA');
})

function updateBiplot(){
    fetch(biplotUrl).then(
        res => res.json()
    ).then(
        data=>{
            let loadings = JSON.parse(data.loadings);
            let features = JSON.parse(data.feature);
            loadings = loadings.slice(0, d_i);

            d3.selectAll(".biplot-line").remove();
            d3.selectAll(".biplot-label").remove();

            let  plot = d3.select('.biplotG').select('g');
            console.log(feature);
            console.log(loadings);
            for (let index = 0; index < loadings.length; index++) {
                const ele = loadings[index];
                plot.append('line')
                    .attr("class", "biplot-line")
                    .attr("x1", originX)
                    .attr("y1", originY)
                    .attr("x2", d=> originX+(width*ele.x)*0.6)
                    .attr("y2", d=> originY+(height*ele.y)*0.6)
                    .attr("stroke-width", 2)
                    .attr("stroke", "royalblue");
                
                plot.append('text')      
                    .attr("class", "biplot-label")
                    .attr("x", d=> originX+(width*ele.x)*0.6)
                    .attr("y", d=> originY+(height*ele.y)*0.6)
                    .style("text-anchor", "middle")
                    .text(d=> features[index].feature); 
            }
           
        }
    )
}
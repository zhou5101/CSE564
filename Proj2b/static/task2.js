fetch(DataURL).then(res=>res.json()).then(
    data=>{
        // console.log(data, selectedFeature);
        PCP("#pcp-1", data, features);
    }
)

function PCP(id, data, keys){
    d3.selectAll(`${id} > *`).remove();
    let curwidth= 1000;
    let brushHeight = 30; 
    const selections = new Map();

    const svg = d3.select(id)
        .append("svg")
        .attr("width", curwidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    let x = d3.scalePoint(keys, [0, curwidth]);

    let y = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [ height, 0])]));


    const  highlight = function(event, d){
        let selected_cluster = d.ID;

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        // Second the hovered specie takes its color
        d3.selectAll(".cluster" + selected_cluster)
            .transition().duration(200)
            .style("stroke", colorScale(selected_cluster))
            .style("opacity", "1")
    }

    const doNotHighlight = function(event, d){
    d3.selectAll(".line")
      .transition().duration(100).delay(100)
      .style("stroke", function(d){ 
        if(d3.select(this).classed("selected")||selections.size===0)
            return colorScale(d.ID);
        else 
            return "gray";
        } )
      .style("opacity", "1")
    }
    
    const line = d3.line()
        .defined(([, value]) => value != null)
        .y(([key, value]) => y.get(key)(value))
        .x(([key]) => x(key))
    
    const brush = d3.brushY()
      .extent([
        [-brushHeight/2, 0],
        [brushHeight/2, height]
      ])
      .on("start brush end", brushed);


    const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.5)
    .selectAll("myPath")
    .data(data)
    .join("path")
      .attr("stroke", d => colorScale(d.ID))
      .attr("class", d => "line " + `cluster${d.ID}`)
      .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight);

    svg.append("g")
    .selectAll("myAxis")
    .data(keys)
    .enter()
    .append("g")
      .attr("class", "axis")
      .attr("transform", d => `translate(${x(d)})`)
      .each(function(d) { d3.select(this).call(d3.axisLeft(y.get(d))); })
      .call(g => g.append("text")
                .attr("y", -9)
                .attr("text-anchor", "middle")
                .attr("fill", "currentColor")
                .text(d => d)
                .style("fill", "black")
            )
        .call(brush);


    function brushed({selection}, key){
        // console.log(selection, key);
        if (selection === null) 
            selections.delete(key);
        else 
            selections.set(key, selection.map(y.get(key).invert));

        // console.log(selections);
        
        path.each(function(d) {
            // console.log(d);
            const active = Array.from(selections).every(([key, [max, min]]) => d[key] >= min && d[key] <= max);
            // console.log(active);
            d3.select(this)
                .style("stroke", active ? colorScale(d.ID) : "gray")
                .attr("class", "selected");
            if (active) {
                d3.select(this).raise();
                // selected.push(d);
            }
            });
        // svg.property("value", selected).dispatch("input");
    }
}


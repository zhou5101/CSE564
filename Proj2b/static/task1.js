// console.log("task 1");
let mdsURL = `${SCRIPT_ROOT}/mds`;
let mdsCorrURL = `${SCRIPT_ROOT}/mds_corr`;

fetch(mdsURL).then(res => res.json())
.then(
    data => {
        // console.log(data);
        let svg = d3.select("#mds")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        let x = d3.scaleLinear()
            .domain([d3.min(data, d=>d[0]), d3.max(data, d=>d[0])])
            .range([ 0, width ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([d3.min(data, d=>d[1]), d3.max(data, d=>d[1])])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        // console.log("task1", y);
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 2)
            .style("fill", function (d, i) { return colorScale(clusterNo[i])})

        addChartLabels(svg, 'Coordinate1', 'Coordinate2', 'Red Wine Quality MDS');
        addLegend(svg);
    }
)

let clickedFeature = [];
let i = 0;
fetch(mdsCorrURL).then(res => res.json())
.then(
    data => {
        // console.log(data);
        let svg = d3.select("#mds")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        let x = d3.scaleLinear()
            .domain([d3.min(data, d=>d[0])-0.1, d3.max(data, d=>d[0])+0.1])
            .range([ 0, width ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([d3.min(data, d=>d[1])-0.1, d3.max(data, d=>d[1])+0.1])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("text")
            .style("cursor", "pointer")
            .attr('name', (d,i)=>features[i])
            .attr("x", function (d) { return x(d[0]); } )
            .attr("y", function (d) { return y(d[1]); } )
            .text((d,i)=>features[i])
            .on('click', function (evt, d){
                let index = evt.target.getAttribute('index');
                let name = evt.target.getAttribute('name');
                // console.log(index);
                if(selectedFeature.length==features.length)
                    selectedFeature.shift();

                if(index){
                    d3.select(this).attr('index', null);
                    d3.select(this).text(name);
                    selectedFeature.pop();
                    i--;
                }else{
                    selectedFeature.push(name);
                    d3.select(this).attr('index', i);
                    d3.select(this).text(`${name}: ${i+1}`);
                    i++;
                    if(i==features.length)
                    i=0;
                }
                
                console.log(selectedFeature);
            });


        addChartLabels(svg, 'Coordinate1', 'Coordinate2', 'Red Wine Correlation MDS');
    }
)
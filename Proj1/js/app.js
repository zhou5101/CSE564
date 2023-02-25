var margin = {top: 50, right: 30, bottom: 90, left: 100},
    width = 480 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var race={
        Hispanic:0,
        White:0,
        Black:0,
        Native:0,
        Asian:0,
        Pacific:0}, 
    party={
        GOP:0,
        DEM:0}, 
    gender={
        Men:0, 
        Women:0}, 
    work={
        Professional:0,
        Service:0,
        Office:0,
        Construction:0,
        Production:0
    }, 
    transportation={
        Drive:0,
        Carpool:0,
        Transit:0,
        Walk:0,
        OtherTransp:0,
        WorkAtHome:0
    }
    employed ={
        Employed:0,
        Unemployed:0
    };
var csvData;
var allCate;
function parseCategoricalData(data){
    const aggs =[race, party, gender, work, transportation, employed];
    for(let agg of aggs){
        for(const k in agg){
            agg[k]+=Number.parseInt(data[k]);
         }
    }
}

var featureData;
var isHor = false;

toggleHor = ()=>{
    isHor = !isHor;
    updateGraph();
}

d3.csv('./data.csv', function(data){
    // let race = ['Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific']
    // let part = ['GOP', 'DEM']
    // let gender = ['Male', 'Female']
    // let work = ['Professional', 'Service', 'Office', 'Construction', 'Production']
    // let transportation = ['Drive','Carpool','Transit','Walk','OtherTransp', 'WorkAtHome']
    csvData = data;

    data.forEach(element => {
        parseCategoricalData(element);
    });
    allCate = {race, party, gender, work, transportation, employed};
    featureData = data.map(d=>Number.parseInt(d.MeanCommute))
    // var test  = true;
    Bar(race, '#chart1', 'Race', isHor);
    Histo(featureData, '#chart2','Mean Commute Time', isHor);
    Scatter(data, 'Poverty', 'Income');
    // Scatter2(csvData, 'race', 'total_votes');
    // Scatter2(csvData, 'total_votes', 'race');

    
});

Bar = (data, id, name, isHor) => {
    d3.selectAll(id+" > *").remove();

    let svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(`${name}`);

    if(isHor){


        var x = d3.scaleLinear()
            .domain([0, d3.max(Object.values(data))])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "absolute");
    
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${width/2}, ${height+margin.top})`)
            .text('Frequencies');

        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(Object.keys(data))
            .padding(0.2);
    
        svg.append("g")
            .call(d3.axisLeft(y));
        
        //   // create a toolti
        // var mouseover = function(d) {
        //     Tooltip
        //     .style("opacity", 1)
        //     d3.select(this)
        //     .style("stroke", "black")
        //     .style("opacity", 1)
        // }

        // var mousemove = function(d) {
        //     Tooltip
        //     .html(`x:${d[0]}, y:${d[1]}`)
        //     .style("left", (200) + "px")
        //     .style("top", (d3.mouse(this)[1]+150) + "px")
        // }
        // var mouseleave = function(d) {
        //     Tooltip
        //     .style("opacity", 0)
        //     d3.select(this)
        //     .style("stroke", "none")
        //     .style("opacity", 1)
        // }


        svg.selectAll("rect")
        .data(Object.entries(data))
        .enter()
        .append("rect")
            .attr("x", d=> x(0) )
            .attr("y", d=>y(d[0]))
            .attr("height", y.bandwidth()) // always equal to 0
            .attr("width", d=>x(d[1]))
            .attr("fill", "royalblue");
    
    }
    else {
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(Object.keys(data))
            .padding(0.2);
    
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('font-size', '14px');
    
        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));
    
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-75}, ${(height)/2})rotate(-90)`)
            .text('Frequencies')
        // Bars
        svg.selectAll("rect")
        .data(Object.entries(data))
        .enter()
        .append("rect")
            .attr("x", d=> x(d[0]) )
            .attr("y", d=>y(d[1]))
            .attr("height", d=>y(0)-y(d[1])) // always equal to 0
            .attr("width", x.bandwidth())
            .attr("fill", "royalblue");
    }
}

Histo = (data, id, name, isHor) => {
    //console.log('histo func:', data);
    d3.selectAll(id+" > *").remove();
    let svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(`${name}`);
    
    if(isHor){
        var y = d3.scaleLinear()
            .domain([d3.min(data), d3.max(data)])
            .range([0,width]);
    
        svg.append("g")
            .call(d3.axisLeft(y))
        
        var histogram = d3.histogram()
            .value(d => d)   // I need to give the vector of value
            .domain(y.domain())  // then the domain of the graphic
            .thresholds(y.ticks(20));
            
        var bins = histogram(data);
        //console.log("bins"+ bins);
    
        var x = d3.scaleLinear()
            .range([0,height])
            .domain([0,d3.max(bins, d=>d.length)]);
        svg.append('g')
            .attr("transform", "translate(0," + (height+40)+ ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    
        // svg.append("text")
        //     .attr("text-anchor", "middle")
        //     .attr('transform', `translate(${width/2}, ${height + margin.top})`)
        //     .text('Frequencies');

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-55}, ${(height)/2})rotate(-90)`)
            .text(name)

        svg.selectAll('rect')
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", (d) => `translate(${0},${y(d.x0)})`)
            .attr("width", (d) => x(d.length)  )
            .attr("height", (d) => y(d.x1) - y(d.x0) )
            .style("fill", "royalblue");
    }
    else{
        var x = d3.scaleLinear()
            .domain([d3.min(data), d3.max(data)])
            .range([0,width]);
    
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        
        var histogram = d3.histogram()
            .value(d => d)   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(20));
            
        var bins = histogram(data);
        //console.log("bins"+ bins);
    
        var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0,d3.max(bins, d=>d.length)]);
        svg.append('g')
            .call(d3.axisLeft(y));
    
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr('transform', `translate(${width/2}, ${height + margin.top})`)
            .text(name);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-55}, ${(height)/2})rotate(-90)`)
            .text('Frequencies')
    
        svg.selectAll('rect')
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", (d) => `translate(${x(d.x0)},${y(d.length)})`)
            .attr("width", (d) => x(d.x1) - x(d.x0)  )
            .attr("height", (d) => height - y(d.length) )
            .style("fill", "royalblue");
    }
}

Scatter = (raw, feature1, feature2) => {
    let data = raw.map(d=>[d[feature1], d[feature2]]); 
    let ele1 = raw.map(d=>Number.parseInt(d[feature1]));
    let ele2 = raw.map(d=>Number.parseInt(d[feature2]));
    d3.selectAll("#chart3 > *").remove();

    let svg = d3.select('#chart3')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(`${feature1} vs ${feature2} Graph`);

    let x = d3.scaleLinear()
        .domain([0, d3.max(ele1)])
        .range([0,width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    let y = d3.scaleLinear()
        .domain([0, d3.max(ele2)])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr('transform', `translate(${width/2}, ${height + margin.top})`)
        .text(feature1);

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-55}, ${(height)/2})rotate(-90)`)
        .text(feature2)

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[0]); } )
        .attr("cy", function (d) { return y(d[1]); } )
        .attr("r", 2.5)
        .style("fill", "royalblue")
    
}

var selected = [document.getElementById('check1'), document.getElementById('check12')];
function menu(ele){
    if(ele.checked){
        //const chart = ele.dataset.chart, feature = ele.dataset.feature, title = ele.dataset.title;
        //console.log(chart, feature, title);
        //let matches = document.querySelectorAll(".inputContainer input:checked");
        selected.push(ele);
        console.log(selected);
        if(selected.length > 2){
            selected[0].checked = false;
            selected.shift();
            console.log(selected);
            updateGraph()
        }
    }
}

function updateGraph(){
    console.log(selected);
    console.log('update Graph func');
    const chart1 = selected[0].dataset.chart, feature1 = selected[0].dataset.feature, title1 = selected[0].dataset.title;
    console.log(chart1, feature1,title1);
    if(chart1 ==='bar'){
        Bar(allCate[feature1], '#chart1', title1, isHor);
    }else{
        featureData = csvData.map(d=>Number.parseInt(d[feature1]))
        Histo(featureData, '#chart1', title1, isHor);
    }

    const chart2 = selected[1].dataset.chart, feature2 = selected[1].dataset.feature, title2 = selected[1].dataset.title;
    console.log(chart2, feature2,title2);
    if(chart2 ==='bar'){
        Bar(allCate[feature2], '#chart2', title2, isHor);
    }else{
        featureData = csvData.map(d=>Number.parseInt(d[feature2]))
        console.log('updateGraph func ' + feature2,featureData);
        Histo(featureData, '#chart2', title2, isHor);
    }
}


var scatterX = 'Income', scatterY = 'Poverty';

function getScatterX(val, valType){
    console.log('scatter x: ',val);

    scatterX = val;
    
    if(scatterX in allCate || scatterY in allCate)
        Scatter2(csvData, scatterX, scatterY);
    else
        Scatter(csvData, scatterX, scatterY);
}

function getScatterY(val, valType){
    console.log('scatter y:',val);
    scatterY = val;
    
    if(scatterX in allCate || scatterY in allCate)
        Scatter2(csvData, scatterX, scatterY);
    else
        Scatter(csvData, scatterX, scatterY);

}

function Scatter2(csvData, feature1, feature2){
    d3.selectAll("#chart3 > *").remove();

    let svg = d3.select('#chart3')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(`${feature1} vs ${feature2} Graph`);

    let x = d3.scaleLinear()
            .range([0, width]);

    let y = d3.scaleLinear()
        .range([height, 0]);

    let z;

    if(feature1 in allCate){

        z = d3.scaleOrdinal().domain(d3.keys(allCate[feature1])).range(d3.schemeSet2);
        // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
        var seriesNames = d3.keys(allCate[feature1]);
        // console.log(feature1, feature2);
        // console.log(seriesNames);
        // Map the data to an array of arrays of {x, y} tuples.
        var series = seriesNames.map(function (series) {
            return csvData.map(function (d) {
                return { name:series, x: +d[feature2], y: +d[series] };
            });
        });
    
        // console.log(series);
    
        // Compute the scales’ domains.
        x.domain(d3.extent(d3.merge(series), function (d) { return d.y; })).nice();
        y.domain(d3.extent(d3.merge(series), function (d) { return d.x; })).nice();
    
        // Add the x-axis.
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    
        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));
    
        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr('transform', `translate(${width/2}, ${height + margin.top})`)
            .text(feature1);
    
        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-55}, ${(height)/2})rotate(-90)`)
            .text(feature2)
    
        // Add the points!
        svg.selectAll(".series")
            .data(series)
            .enter().append("g")
            .attr("class", "series")
            .style("fill", function (d, i) { return z(i); })
            .selectAll(".point")
            .data(function (d) { return d; })
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2.5)
            .attr("cx", function (d) { return x(d.y); })
            .attr("cy", function (d) { return y(d.x); });

        svg.selectAll("myLegend")
            .data(seriesNames)
            .enter()
            .append('g')
            .attr('transform', `translate(${0},${0})`)
            .append("text")
                .attr('x', width-margin.right)
                .attr('y', function(d,i){ return 50 + i*20})
                .text(function(d) { 
                // console.log(d);
                return d; })
                .style("fill", function(d, i){ return z(i) })
                .style("font-size", 15);

    }else{
        z = d3.scaleOrdinal().domain(d3.keys(allCate[feature2])).range(d3.schemeSet2);
        // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
        var seriesNames = d3.keys(allCate[feature2]);
        console.log(feature1, feature2);
        console.log(seriesNames);
        // Map the data to an array of arrays of {x, y} tuples.
        var series = seriesNames.map(function (series) {
            return csvData.map(function (d) {
                return {name:series, x: +d[feature1], y: +d[series] };
            });
        });
    
        console.log(series);
    
        // Compute the scales’ domains.
        x.domain(d3.extent(d3.merge(series), function (d) { return d.x; })).nice();
        y.domain(d3.extent(d3.merge(series), function (d) { return d.y; })).nice();
    
        // Add the x-axis.
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    
        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));
    
        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr('transform', `translate(${width/2}, ${height + margin.top})`)
            .text(feature1);
    
        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-55}, ${(height)/2})rotate(-90)`)
            .text(feature2)
    
        // Add the points!
        svg.selectAll(".series")
            .data(series)
            .enter().append("g")
            .attr("class", "series")
            .style("fill", function (d, i) { return z(i); })
            .selectAll(".point")
            .data(function (d) { return d; })
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2.5)
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { return y(d.y); });

        svg.selectAll("myLegend")
            .data(seriesNames)
            .enter()
            .append('g')
            .attr('transform', `translate(${0},${0})`)
            .append("text")
                .attr('x', width-margin.right)
                .attr('y', function(d,i){ return 50 + i*20})
                .text(function(d) { 
                // console.log(d);
                return d; })
                .style("fill", function(d, i){ return z(i) })
                .style("font-size", 15);
    }

}
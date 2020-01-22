// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 660;

const chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

const chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("/assets/data/data.csv").then(journalismData => {
    
    // Print the tvData
    console.log(journalismData);
    
    // Cast the hours value to a number for each piece of tvData
    journalismData.forEach(data => {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });
    let xLinearScale = d3.scaleLinear()
        .domain(d3.extent(journalismData, d => d.poverty))
        .range([0, chartWidth]);
    
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(journalismData, d => d.healthcare)])
        .range([chartHeight, 0]);

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    let circlesGroup = chartGroup.selectAll("circle")
        .data(journalismData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", '#3196f2')
        .attr("opacity", ".8");

    chartGroup.selectAll(".label")
       .data(journalismData)
       .enter()
       .append("text")
       .attr("class", "label")
       .text(d => d.abbr)
       .attr("text-anchor", "middle")
       .attr("x", d => xLinearScale(d.poverty))
       .attr("y", d => yLinearScale(d.healthcare));

    svg.append("text")
       .attr("text-anchor", "middle")
       .attr("x", svgWidth/2)
       .attr("y", svgHeight -3)
       .text("In Poverty (%)");
    
   svg.append("text")
       .attr("text-anchor", "middle")
       .attr("transform", "rotate(-90)")
       .attr("x", -svgHeight/2)
       .attr("y", 10)
       .text("Lacks Healthcare (%)");
});
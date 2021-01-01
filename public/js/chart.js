/**
 *  Check data presence
 */
//console.log(data);
/**
 * PARSE DATA
 */
data = JSON.parse(data);
let dataLength = data.length;
// Test Loop
// data.forEach(t => console.log(t.time, t.value))
// Check d3 presence
// d3.select('div.res').style('color', 'red');

// Set margins
const margin = {
    top: 80,
    bottom: 100,
    left: 60,
    right: 10
}
/**
 * DEFINE SVG AREA
 */
const width = 420 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

/**
 * CREATE SVG
 */
const svg = d3.select('div.res')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('background', '#f2eded')
    .append('g') // append group to the svg
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

/**
 * RECTANGLES
 */
const rects = svg.selectAll('rect')
    .data(data) // use the data to create rectangles


/**
 * Y SCALE
 */
const yScale = d3.scaleLinear()
    // domain definition, max and min y values
    .domain([d3.min(data, d => +d.value), d3.max(data, d => +d.value)]) // use d3.min and .max to find values inside the array
    .range([height, 0]) // min and max value of the svg container 

/**
 * X SCALE
 */
let sum = 0
let min = d3.min(data, d => +d.value)
let max = d3.max(data, d => +d.value)
let media = 0;
data.forEach(t => {
    // console.log(t.time)
    if (t.value >= min) {
        // console.log(t.value)
        sum = sum + +t.value;
    }
});
media = sum / data.length;
// console.log('DataLength ' + dataLength);
// console.log('Max ' + min);
// console.log('Min ' + max);
// console.log('Sum ' + sum);
// console.log('Media ' + Math.round(media));

// Show average of values
const xScale = d3.scaleBand()
    .domain(data.map(d => d.time)) // This is what is written on the Axis:
    .range([0, width]) // This is where the axis is placed: 
    .padding(.001) // Goes between 0 and 1. Default is 0

/**
 * COLORS
 */
const colour = d3.scaleOrdinal(d3['schemeSet3'])
/**
 * DRAW RECTANGLES ENTER METHOD
 */
rects.enter().append('rect')
    // .style('fill', d => colour(d.value))
    .style('fill', '#e3dede')
    .style('stroke', "grey")
    .attr('width', xScale.bandwidth) // bar width
    // .attr('height', d => height - yScale(d.value))
    .attr('height', 0) // HEIGHT START WITH ZERO THEN TRANSITION
    .attr('x', width)
    .attr('y', height)
    .style("filter", "url(#drop-shadow)") // Apply shadow filter
    // .attr('fill-opacity', 0)
    // .attr('y', function (d) { // bar y position
    //     return yScale(d.value);
    // })                                       // y set bottom for transition
    .attr('x', function (d, indx) { // bar x position
        // return indx * (barWidth + barOffset);
        return xScale(d.time)
    })
    /**
     * EVENTS BEFORE TRANSITIONS
     */

    .on('mouseover', function (d, i) {
        tooltip.transition()
            .style('opacity', 1)
        tooltip.html(`Time:${d.time} Value:${d.value}`)
            .style('left', d3.event.pageX + 'px') // x axis positioning
            .style('top', d3.event.pageY + 'px')
        d3.select(this).style('opacity', 0.5) // fadein effect for bar
    })
    .on('mouseout', function (d, i) {
        tooltip.transition().style('opacity', 0)
        d3.select(this).style('opacity', 1) // fadeout bar effect
    })

    /**
     * THE CHART TRANSITION MUST BE AFTER THE EVENTS 
     */
    .transition()
    .attr('height', function (d) {
        return height - yScale(d.value)
    })
    .attr('y', function (d) { // bar y position
        return yScale(d.value);
    })
    // .attr('fill-opacity', 1)
    .duration(3000)
    .delay(function (d, i) {
        return i * 2
    })

/**
 * AXIS VISUALIZATION
 */
// X
// let xAxis = d3.axisBottom(xScale)
let xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(function (d, i) {
        return !(i % 6);
    }))
    .tickFormat(d => '-' + d);;

svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .transition().duration(2000)
    .call(xAxis)
    .attr('opacity', 1)
    .selectAll("text")
    .style('font-size', '9.0px')
    .style("text-anchor", "end")
    .attr("color", "rgb(129,129,129)")
    .style("transform", "rotate(-65deg) translate(-10px, -10px)")
    .style('text-shadow', '1px 1px 4px rgba(0, 0, 0, .5),-1px -1px 4px rgba(255, 255, 255, .5)')

// .attr('tickPadding', '.5')

svg.selectAll("line")
    .style("stroke", "grey")

    .selectAll("path")
    .style("stroke", "blue")

// .selectAll("text")
// .style("stroke", "blue")
// Y
let yAxis = d3.axisLeft(yScale)
    .ticks(10)
    .tickFormat(d => 'Val ' + d);

svg.append('g')
    .transition().duration(2000)
    .call(yAxis)
    .attr('opacity', 1)
    .selectAll("text")
    .style('font-size', '10px')
    .style("text-anchor", "end")
    .style("color", "rgb(129,129,129)")
    .attr("transform", "rotate(0)")
    .style('text-shadow', '1px 1px 4px rgba(0, 0, 0, .5),-1px -1px 4px rgba(255, 255, 255, .5)')

// .attr('tickPadding', '2')
svg.selectAll("line")
    .style("stroke", "grey")
/**
 * LABELs INFO
 */
// KEYWORD
svg.append('text')
    .attr('x', width - 100)
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgb(129,129,129)')
    .attr('opacity', 0)
    .text(``)
    .transition().duration(6000)
    .text(`${data[0].keyword}`)
    .attr('opacity', 1)
    .style('text-transform', 'uppercase')
    .style('text-shadow', '1px 1px 4px rgba(0, 0, 0, .5),-1px -1px 4px rgba(255, 255, 255, .5)')
// VALUE READ INFO
svg.append('text')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('fill', 'rgb(129,129,129)')
    .attr('opacity', 0)
    .text(``)
    .transition().duration(6000)
    .text(`100 is the peak popularity for the term.`)
    .style('color', 'rgb(129,129,129)')
    .style('text-decoration', 'underline')
    .attr('opacity', 1)
    .style('text-shadow', '1px 1px 4px rgba(0, 0, 0, .5),-1px -1px 4px rgba(255, 255, 255, .5)')


/**
 *  Add X AND Y axis label:
 */
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 10)
    .attr("y", height + 30)
    .style('fill', 'rgb(129,129,129)')
    .text("Time");


// Y axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .style('fill', 'rgb(129,129,129)')
    .attr("transform", "rotate(0)")
    .attr("y", -20)
    .attr("x", 5)
    .text("Value")


/**
 * TOOLTIP
 */
let tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('background', 'linear-gradient(145deg, #fffefe, #dad5d5)')
    .style('box-shadow', '20px 20px 60px #cec9c9,-20px -20px 60px #ffffff')
    .style('color', 'black')
    .style('padding', '5px 10px')
    // .style('border', '1px solid #purple')
    .style('border-radius', '4px')
    .style('opacity', '0')
    .style('z-index', 1)

// In order to work you need to create some events on rect append above

/**
 * FILTER FOR SHADOW EFFECT
 */

// filters go in defs element
var defs = svg.append("defs");

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "120%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 5)
    .attr("dy", 5)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");
// Browserify entry point for the page.js bundle (yay JavaScript!)
var d3 = require('d3');
var _ = require('lodash');
// global.js already contains jQuery, so in our config.js file, we
// are exposing it to other files like this one in the `require` array.
// Also in config.js, jquery is listed in `external` array for this bundle.
// This combination lets this file use the jquery module bundled with
// global.js, instead including it twice!

var barData = (function() {
    var randomValues = [];
    for (var i = 0; i < 50; i++) {
        var max = 1000,
            min = 5;
        randomValues.push(Math.floor(Math.random() * (max + 1 - min)) + min);
    }
    return randomValues;
}());

barData = _.sortBy(barData, function(n) {
    return n;
});

var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

var yScale = d3.scale.linear()
    .domain([0, d3.max(barData)])
    .range([0, height]);


var xScale = d3.scale.ordinal()
    .domain(d3.range(0, barData.length))
    .rangeBands([0, width], 0.1, 0.5);

var colors = d3.scale.linear()
    .domain([0, barData.length * 0.5, barData.length])
    .range(['#0000ff', '#00ff00', '#ff0000']);


console.log('barData', barData);
var theChart = d3.select('#content')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .style('background', '#eeeeee')
    .append('g')
    .selectAll('rect')
    .data(barData)
    .enter()
    .append('rect')
    .attr('width', xScale.rangeBand())
    .attr('x', function(d, i) {
        return xScale(i);
    })
    .attr('height', 0)
    .attr('y', height)
    .attr('rx', 0)
    .attr('ry', 0)
    .style('fill', function(d, i) {
        return colors(i);
    })
    .on('mouseenter', function(d, i) {
        d3.select('#info')
            .text(d);
        d3.select(this)
            .style('opacity', 0.5);
    })
    .on('mouseleave', function(d, i) {
        d3.select('#info')
            .text(d);
        d3.select(this)
            .style('opacity', 1);
    });

theChart.transition()
    .duration(500)
    .attr('height', function(d) {
        return yScale(d);
    })
    .attr('y', function(d) {
        return height - yScale(d);
    })
    .delay(100)
    .delay(function(d, i) {
        return i * 10;
    })
    .duration(1000)
    .ease('elastic');


var vGuideScale = d3.scale.linear()
    .domain([0, d3.max(barData)])
    .range([height - 10, 0]);

var vAxis = d3.svg.axis()
    .scale(vGuideScale)
    .orient('left')
    .ticks(10);

var vGuide = d3.select('svg')
    .append('g');
vAxis(vGuide);
vGuide.attr('transform', 'translate(35,0)');
vGuide.selectAll('path')
    .style({
        fill: 'none',
        stroke: "#000"
    });

var hAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickValues(xScale.domain()
        .filter(function(d, i) {
            return (i % (barData.length / 20)) === 0;
        }));

var hGuide = d3.select('svg')
    .append('g');

hAxis(hGuide);
hGuide.attr('transform', 'translate(0, ' + (height - 30) + ')');
hGuide.selectAll('path')
    .style({
        fill: 'none',
        stroke: "#000"
    });

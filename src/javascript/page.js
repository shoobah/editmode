// Browserify entry point for the page.js bundle (yay JavaScript!)
var d3 = require('d3');
// global.js already contains jQuery, so in our config.js file, we
// are exposing it to other files like this one in the `require` array.
// Also in config.js, jquery is listed in `external` array for this bundle.
// This combination lets this file use the jquery module bundled with
// global.js, instead including it twice!

var barData = (function() {
  var randomValues = [];
  for (var i = 0; i < 100; i++) {
    var max = 100,
      min = 5;
    randomValues.push(Math.floor(Math.random() * (max - min)) + min);
  }
  return randomValues;
}());

var width = 900,
  height = 500;

var yScale = d3.scale.linear()
  .domain([0, d3.max(barData)])
  .range([0, height]);

var xScale = d3.scale.ordinal()
  .domain(d3.range(0, barData.length))
  .rangeBands([0, width], 0.2);

var colors = d3.scale.linear().domain([0, barData.lenth]).range(['#0000ff', '#ff0000']);

console.log('barData', barData);
d3.select('#content')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', '#eeeeee')
  .selectAll('rect').data(barData)
  .enter().append('rect')
  .attr('x', function(d, i) {
    return xScale(i);
  })
  .attr('y', function(d) {
    return height - yScale(d);
  })
  .attr('width', xScale.rangeBand())
  .attr('height', function(d) {
    return yScale(d);
  })
  .attr('rx', 0)
  .attr('ry', 0)
  .style('fill', function(d, i) {
    return colors(i);
  });

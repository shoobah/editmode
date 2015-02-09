// Browserify entry point for the page.js bundle (yay JavaScript!)
var d3 = require('d3'),
    _ = require('lodash');
// global.js already contains jQuery, so in our config.js file, we
// are exposing it to other files like this one in the `require` array.
// Also in config.js, jquery is listed in `external` array for this bundle.
// This combination lets this file use the jquery module bundled with
// global.js, instead including it twice!

// var barValues = (function() {
//     var randomValues = [];
//     for (var i = 0; i < 10; i++) {
//         var max = 1000,
//             min = 10;
//         randomValues.push(Math.floor(Math.random() * (max + 1 - min)) + min);
//     }
//     return randomValues;
// }());

d3.csv('BE0101N1.csv', function(error, data) {
    var barValues = [];
    var barKeys = [];
    data = _.sortBy(data, function(d) {
        return d.region.replace(/\d[^ ]* /ig, "");
    });
    _.forEach(data, function(d) {
        barValues.push(+d.population);
        barKeys.push(d.region.replace(/\d[^ ]* /ig, ""));
    });
    console.log('barValues', barValues);
    console.log('barKeys', barKeys);

    var margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 100
        },
        width = 1260 - margin.left - margin.right,
        height = 640 - margin.top - margin.bottom;

    var yScale = d3.scale.log()
        .domain([1000, d3.max(barValues)])
        .range([0, height]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0, barValues.length))
        .rangeBands([0, width], 0);

    var colors = d3.scale.linear()
        .domain([0, barValues.length])
        .range(['#80CCFF', '#004C80']);

    var theChart = d3.select('#content')
        .append('svg')
            .style('background', '#FFFFD6')
            .style('border', 'solid 1px #ccc')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .selectAll('rect')
                .data(barValues)
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
                            .text(barKeys[i] + ': ' + d);
                        d3.select(this)
                            .style('opacity', 0.5);
                    })
                    .on('mouseleave', function() {
                        d3.select('#info')
                            .text('');
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
        .delay(function(d, i) {
            return i * 2;
        })
        .duration(300)
        .ease('elastic');


    var vGuideScale = d3.scale.log()
        .domain([1, d3.max(barValues)])
        .range([height, 0]);

    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10);

    var vGuide = d3.select('svg')
        .append('g');

    vAxis(vGuide);
    vGuide.attr('transform', 'translate(' + margin.left + ',' + (margin.bottom) + ')');
    vGuide.selectAll('path')
        .style({
            fill: 'none',
            stroke: "#000"
        });


    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(function(d, i) {
            return barKeys[i];
        });

    var hGuide = d3.select('svg')
        .append('g');

    hAxis(hGuide);
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.bottom) + ')');
    hGuide.selectAll('path')
        .style({
            fill: 'none',
            stroke: "#000"
        });
    hGuide.selectAll('.tick text')
        .style({
            fill: 'red',
            'text-anchor': 'end',
            transform: 'rotate(-90deg) translateY(-10px)',
            'font-size': '6px'
        });

    d3.xml("images/Bubbla-assets/Bubbla.svg", "image/svg+xml", function(xml) {
        d3.select('#content svg').append(xml.documentElement);
    });
});

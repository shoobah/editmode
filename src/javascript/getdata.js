var d3 = require('d3'),
    _ = require('lodash');

var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 100
    },
    width = 1060 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

var renderStuff = function(data) {
    var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
            return d.value;
        })])
        .range([0, width]);

    var yScale = d3.scale.ordinal()
        .domain(d3.range(0, data.length))
        .rangeBands([0, width], 0.2, 0.5);

    var myChart = d3.select('#content')
        .append('svg')
        .style('background', '#FFF')
        .style('border', 'solid 1px #ccc')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g');

    var bars = myChart.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', margin.left)
        .attr('y', function(d, i) {
            return yScale(i);
        })
        .attr('width', function(d) {
            if (d.value) {
                return xScale(d.value);
            }
        })
        .attr('height', yScale.rangeBand())
        .style('fill', '#295266');

    var texts=myChart.selectAll('text')
        .select('g')
        .append('text')
        .style({
            'font-size': '10px',
            'fill': 'red'
        })
        .text(function(d) {
            return d.label;
        });
};

var url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/TK/TK1001/TK1001A/Fordon";
var query = {
    "query": [{
        "code": "Tid",
        "selection": {
            "filter": "item",
            "values": [
                "2015M01"
            ]
        }
    }],
    "response": {
        "format": "json"
    }
};

d3.json(url)
    //.header("Content-Type", "application/json")
    .post(JSON.stringify(query), function(err, data) {
        if (err) {
            console.error('FEL:', err);
            return {};
        }
        var myData = [];
        _.forEach(data.data, function(d) {
            myData.push({
                label: d.key[0] + ' ' + d.key[1] + ' ' + d.key[2],
                value: +d.values[0]
            });
        });
        renderStuff(myData);
    });

"use strict"
// js for csv

var mydata;
var radius = 1000;
var canvas_width = 1000;
var canvas_height = 500;
var categories = [];
var types = [];

var current_layout = "center";
var highlight = "none";

var colors = ['#1FB6ED', '#FDC840', '#C283B5', '#6E92B9', '#204765', 
                '#E99FC0', '#C9D850', '#68A349', '#208495', '#F27B31', 
                '#4E2669', '#6EC7C4'];
var byTypeCenters = {
    "Unexpected" : {
        "x" : -200,
        "y" : canvas_height / 2
    },
    "Purposed" : {
        "x" : 500,
        "y" : canvas_height / 2
    },
    "Regular" : {
        "x" : 1200,
        "y" : canvas_height / 2
    },
};

var svg = d3.select("#svg-wrap").append("svg")
    .attr("width", canvas_width)
    .attr("height", canvas_height);

d3.csv("../data/data.csv", function (d) {
    if (categories.indexOf(d.Category) < 0) {
        categories.push(d.Category);
        // console.log(categories);
    }
    if (types.indexOf(d.Type) < 0) {
        types.push(d.Type);
    }
    return {
        date: d.Date,
        category: d.Category,
        amount: +d.Amount,// convert "amount" to number
        type: d.Type,
        descript: d.Description
    };
    }, function(error, rows) {
        mydata = rows;
        start();//call start
    });

function start() {

    // prepare d3 tips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<div class='tip-cate'>" + d.category + "</div> <div class='tip-date'>" + d.date + "</div> <div class='tip-amount'>" + "$" + d.amount + "</div> <div class='tip-desc'>" + d.descript + "</div>";
        });

    // call d3.tip.js
    svg.call(tip);

    // add click callbacks to navigate buttons
    d3.select(".nav-left")
        .on("click", function(){
            current_layout = "center";
            force.resume();
            switch_view("center");
            d3.select(".nav-right").style("color","orange").style("background-color", "white");
            d3.select(".nav-left").style("color","white").style("background-color", "orange");
        });

    d3.select(".nav-right")
        .on("click", function(){
            current_layout = "byType";
            force.resume();
            switch_view("byType");
            d3.select(".nav-right").style("color","white").style("background-color", "orange");
            d3.select(".nav-left").style("color","orange").style("background-color", "white");
            set_highlight("none");
    });

    function switch_view(view) {
        var type_dis;
        var cate_dis;
        if (view == "byType") {
            type_dis = "block";
            cate_dis = "none";
        }
        else {
            type_dis = "none";
            cate_dis = "block";
        }
        d3.select("#type-wrap").style("display", type_dis);
        d3.select("#type-title-wrap").style("display", type_dis);
        d3.select("#legend-wrap").style("display", cate_dis);
        d3.select("#label-wrap").style("display", "none");
    }

    // add click callbacks to categories
    var cate_boxes = d3.selectAll(".cate-box")
        .on("click", function(){
            var cate = d3.select(this).attr("id");
            if (highlight == "none" && current_layout == "center") {
                set_highlight(cate);
                d3.select(this).style("opacity", 1)
                                .style("background-color", "white");
                d3.select("#label-wrap").style("display", "block");
            } else if (highlight == "none" && current_layout == "byType") {
                set_highlight(cate);
                d3.select(this).style("opacity", 1)
                                .style("background-color", "white");
                d3.select("#label-wrap").style("display", "none");
            }else {
                set_highlight("none");
                d3.select("#label-wrap").style("display", "none");
            }
        });

    var labels = d3.selectAll(".label-content");

    function set_highlight(cate) {
        if (cate == "none") {
            highlight = "none";
            circles.style("fill", function(d) {return colors[categories.indexOf(d.category)];});
            cate_boxes.style("opacity", 1)
                        .style("background-color", "transparent");
            labels.style("display", "none");
        } else {
            highlight = cate;
            circles.style("fill", function(d) {
                if (d.category == cate) {
                    return colors[categories.indexOf(d.category)];                    
                } else {
                    return "#eee";
                }
            });
            cate_boxes.style("opacity", 0.3);
            d3.select("#l-"+cate).style("display", "block");
        }
    }

    // create circle selection
    var circles = svg.selectAll('circle')
        .data(mydata).enter().append("circle");

    var force = d3.layout.force()
        .nodes(mydata)
        .links([])
        .size([canvas_width, canvas_height])
        .gravity(0.1)
        .friction(0.8)
        .charge(function(d) {return - Math.pow(d.amount, 0.8) * 10;})
        .on("tick", function(e) {
            var k = 0.1 * e.alpha;
            if (current_layout == "byType") {
                mydata.forEach(function (o, i) {
                    o.y += (byTypeCenters[o.type].y - o.y) * k;
                    o.x += (byTypeCenters[o.type].x - o.x) * k;
                    force.chargeDistance(220);
                });
            } else {
                mydata.forEach(function (o, i) {
                    o.y += (canvas_height / 2 - 20 - o.y) * k;
                    o.x += (canvas_width / 2 + 400 - o.x) * k;
                    force.chargeDistance(9999999999);
                });
            }

            circles
                .attr("cx", function(d) {return d.x;})
                .attr("cy", function(d) {return d.y;});
        });

    circles.attr("cx", function(d,i){return d.x;})
        .attr("cy", function(d,i){return d.y;})
        .attr("r", function(d) {return Math.sqrt(d.amount) * 3;})
        .attr("class",function(d){return d.type;})
        .attr("class",function(d){return d.category;})
        .style("fill", function(d) {return colors[categories.indexOf(d.category)];})
        .style("stroke", "white")
        .style("stroke-width", "2px")
        .style("cursor", "all-scroll")
        .on('mouseenter', function(d) {
            var current_opacity = d3.select(".d3-tip").style("opacity");
            tip.show(d);
            d3.select(".d3-tip")
            .style("opacity", current_opacity)
            .transition()
                .duration(300)
                .style("opacity",1)
                .style('pointer-events', 'none');
        })
        .on('mouseleave', function() {
            d3.select(".d3-tip")
            .transition()
                .delay(100)
                .duration(600)
                .style("opacity",0)
                .style('pointer-events', 'none');
        })
        .call(force.drag);

    switch_view("center");

    force.start();

};// end of function start
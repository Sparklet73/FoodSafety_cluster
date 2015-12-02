"use strict"
// js for csv

var mydata_dic = [];
var radius = 500;
//var canvas_width = window.innerWidth - 200;
//var canvas_height = window.innerHeight - 100;
var canvas_width = 1340 - 200;
var canvas_height = 600 - 100;
var categories = ['化學', '農產', '飼料', '食品', '飲料', '藥品', '其他'];
var types = ["1", "2", "3"];

var current_layout_dic = "center";
//var highlight = "none";
var clicked_cate_dic = new Set();

var colors = ['#F0C808', '#F694C1', '#B79CED', '#1787A0', '#15B097', '#542E71', '#5BC0EB'];
var byTypeCenters = {
    "1": {
        "x": -190,
        "y": canvas_height / 2
    },
    "2": {
        "x": 610,
        "y": canvas_height / 2
    },
    "3": {
        "x": 1310,
        "y": canvas_height / 2
    }
};

var svg_dic = d3.select("#svg-wrap-dic").append("svg")
        .attr("width", canvas_width)
        .attr("height", canvas_height);

//d3.csv("data/data.csv", function (d) {
////    var arrCate = d.Category.split(/,/);
////    for (var c in arrCate) {
////        if (categories.indexOf(arrCate[c]) < 0) {
////            categories.push(arrCate[c]);
//////            console.log(categories);
////        }
////    }
//    if (types.indexOf(d.Type) < 0) {
//        types.push(d.Type);
//    }
//    return {
//        uniNum: d.UniNum,
//        comName: d.Name,
//        category: d.Category.split(/,/),
//        amount: +d.Amount, // convert "amount" to number
//        type: d.Risk
//    };
//}, function (error, rows) {
//    mydata_dic = rows;
//    console.log(mydata_dic);
//    start();//call start
//});

d3.json("Dichloromethane.json", function (error, data) {
    if (error) {
        return console.error(error);
    } else {
        for (var k in data) {
            var k_data = data[k];
            mydata_dic.push(k_data);
        }
        start_dic();
    }
});

function start_dic() {

    // prepare d3 tips
    var tip_dic = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                var nodetip = "<div class='tip-cate'>" + d.ComName + "<br>" + d.Uninum +
                        "</div> <div class='tip-capital'>" + "資本額: " + d.Capital + " 萬" +
                        "</div> <div class='tip-amount'>" + "運作量: " + d.Amount + " 公噸 </div>";
                for (var t in d.SubCate) {
                    nodetip += "<div class='tip-SubCate-title'>" + t + "</div>";
                    nodetip += "<div class='tip-SubCate-content'>" + d.SubCate[t] + "</div>";
                }
                return nodetip;
            });

    // call d3.tip.js
    svg_dic.call(tip_dic);

    // add click callbacks to navigate buttons
    d3.select("#dic-nav-left")
            .on("click", function () {
                current_layout_dic = "center";
                force_pla.resume();
                switch_view("center");
                d3.select("#dic-nav-right").style("color", "#00AE68").style("background-color", "white");
                d3.select("#dic-nav-left").style("color", "white").style("background-color", "#00AE68");
            });

    d3.select("#dic-nav-right")
            .on("click", function () {
                current_layout_dic = "byType";
                force_pla.resume();
                switch_view("byType");
                d3.select("#dic-nav-right").style("color", "white").style("background-color", "#00AE68");
                d3.select("#dic-nav-left").style("color", "#00AE68").style("background-color", "white");
//                set_highlight("none");
            });

    function switch_view(view) {
        var type_dis_dic;
        var cate_dis_dic;
        if (view == "byType") {
            type_dis_dic = "block";
            cate_dis_dic = "none";
        }
        else {
            type_dis_dic = "none";
            cate_dis_dic = "block";
        }
        d3.select("#type-wrap-dic").style("display", type_dis_dic);
        d3.select("#type-title-wrap-dic").style("display", type_dis_dic);
        d3.select("#legend-wrap-dic").style("display", cate_dis_dic);
        d3.select("#label-wrap-dic").style("display", "none");
    }

    // add click callbacks to categories
    var cate_boxes_dic = d3.selectAll(".cate-box-dic")
            .on("click", function () {
                var temp1 = d3.select(this).attr("id");
                var temp2 = temp1.split("-");
                var cate = temp2[3];
                if (current_layout_dic == "center") {
                    d3.selectAll(".label-content-dic").style("display", "none");
                    d3.select("#label-wrap-dic").style("display", "block");
                } else if (current_layout_dic == "byType") {
                    d3.select("#label-wrap-dic").style("display", "none");
                }
                var strSummary = "";
                if (clicked_cate_dic.has(cate)) {
                    clicked_cate_dic.delete(cate);
                    cancel_highlight(clicked_cate_dic);
                    d3.select("#cate-box-dic-" + cate).style("opacity", 0.3).style("background-color", "transparent");
                    d3.select("#label-wrap-dic").style("display", "none");
                } else {
                    clicked_cate_dic.add(cate);
                    set_highlight(clicked_cate_dic);
                    mydata_dic.forEach(function (o, i) {
                        o.Category.forEach(function (j) {
                            if (j == cate) {
                                strSummary += o.ComName + "<br>";
                            }
                        })
                    });
                    $("#dic-" + cate + "-summary").html(strSummary);
                    d3.select("#l-dic-" + cate).style("display", "block");
                    clicked_cate_dic.forEach(function (c) {
                        d3.select("#cate-box-dic-" + c).style("opacity", 1)
                                .style("background-color", "white");
                    });
                }

                if (clicked_cate_dic.size <= 0) {
                    d3.selectAll(".cate-box-dic").style("opacity", 1)
                            .style("background-color", "transparent");
                    circles_dic.style("fill", function (d) {
                        return colors[categories.indexOf(d.Category[0])];
                    });
                    d3.select("#label-wrap-dic").style("display", "none");
                }
            });
    function cancel_highlight(catelist) {
        circles_dic.style("fill", function (d) {
            return "#eee";
        });
        circles_dic.style("fill", function (d) {
            var mixedcnt = 0;
            var col;
            catelist.forEach(function (cate) {
                if (d.Category.indexOf(cate) > -1) {
                    col = colors[categories.indexOf(d.Category[d.Category.indexOf(cate)])];
                    mixedcnt += 1;
                }
            });
            if (mixedcnt == 0) {
                col = "#eee";
            }
            if (mixedcnt == catelist.size && mixedcnt != 1) {
                col = "red";
            }
            return col;
        });
    }
    function set_highlight(catelist) {
        circles_dic.style("fill", function (d) {
            var mixedcnt = 0;
            var col;
            catelist.forEach(function (cate) {
                if (d.Category.indexOf(cate) > -1) {
                    col = colors[categories.indexOf(d.Category[d.Category.indexOf(cate)])];
                    mixedcnt += 1;
                }
            });
            if (mixedcnt == 0) {
                col = "#eee";
            }
            if (mixedcnt == catelist.size && mixedcnt != 1) {
                col = "red";
            }
            return col;
        });
        cate_boxes_dic.style("opacity", 0.3);
    }

    // create circle selection
    var circles_dic = svg_dic.selectAll('circle')
            .data(mydata_dic).enter().append("circle");

    var force_pla = d3.layout.force()
            .nodes(mydata_dic)
            .links([])
            .size([canvas_width, canvas_height])
            .gravity(0.1)
            .friction(0.8)
            .charge(function (d) {
                return -Math.pow(d.Capital, 0.4);
            })
            .on("tick", function (e) {
                var k = 0.1 * e.alpha;
                if (current_layout_dic == "byType") {
                    mydata_dic.forEach(function (o, i) {
                        o.y += (byTypeCenters[o.Risk].y - o.y) * k;
                        o.x += (byTypeCenters[o.Risk].x - o.x) * k;
                        force_pla.chargeDistance(220);
                    });
                } else {
                    mydata_dic.forEach(function (o, i) {
                        o.y += (canvas_height / 2 - 20 - o.y) * k;
                        o.x += (canvas_width / 2 + 400 - o.x) * k;
                        force_pla.chargeDistance(9999999999);
                    });
                }

                circles_dic.attr("cx", function (d) {
                    return d.x;
                })
                        .attr("cy", function (d) {
                            return d.y;
                        });
            });

    circles_dic.attr("cx", function (d, i) {
        return d.x;
    })
            .attr("cy", function (d, i) {
                return d.y;
            })
            .attr("r", function (d) {
                return Math.log(d.Amount * 100000000);
            })
            .attr("class", function (d) {
                return d.Risk;
            })
            .attr("class", function (d) {
//                console.log(d.Category[1]);
                return d.Category[0];
            })
            .style("fill", function (d) {
                return colors[categories.indexOf(d.Category[0])];
            })
            .style("stroke", "white")
            .style("stroke-width", "2px")
            .style("cursor", "all-scroll")
            .on('mouseenter', function (d) {
                var current_opacity = d3.select(".d3-tip").style("opacity");
                tip_dic.show(d);
                d3.select(".d3-tip")
                        .style("opacity", current_opacity)
                        .transition()
                        .duration(300)
                        .style("opacity", 1)
                        .style('pointer-events', 'none');
            })
            .on('mouseleave', function () {
                d3.select(".d3-tip")
                        .transition()
                        .delay(100)
                        .duration(600)
                        .style("opacity", 0)
                        .style('pointer-events', 'none');
            })
            .call(force_pla.drag);

    switch_view("center");

    force_pla.start();

}
;// end of function start
"use strict"
// js for csv

var mydata_dic = [];
//var radius = 500;
//var canvas_width = window.innerWidth - 200;
//var canvas_height = window.innerHeight - 100;
//var canvas_width = 1028 - 200;
//var canvas_height = 600 - 100;
//var categories = ['化學', '農產', '飼料', '食品', '飲料', '藥品', '其他'];
//var types = ["1", "2", "3"];

var current_layout_dic = "center";
//var highlight = "none";
var clicked_cate_dic = new Set();

//var colors = ['#7D5174', '#F096CA', '#A894BF', '#247BA0', '#02C39A', '#5CCFF9', '#FFB400'];
//var byTypeCenters = {
//    "1": {
//        "x": -190,
//        "y": canvas_height / 2
//    },
//    "2": {
//        "x": 610,
//        "y": canvas_height / 2
//    },
//    "3": {
//        "x": 1310,
//        "y": canvas_height / 2
//    }
//};

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

function colororder_dic(d) {
    var color = "";
    if ($.inArray('化學', d.Category) > -1) {
        color = colors[categories.indexOf('化學')];
    } else if ($.inArray('飲料', d.Category) > -1) {
        color = colors[categories.indexOf('飲料')];
    } else if ($.inArray('食品', d.Category) > -1) {
        color = colors[categories.indexOf('食品')];
    } else if ($.inArray('藥品', d.Category) > -1) {
        color = colors[categories.indexOf('藥品')];
    } else if ($.inArray('飼料', d.Category) > -1) {
        color = colors[categories.indexOf('飼料')];
    } else if ($.inArray('農產', d.Category) > -1) {
        color = colors[categories.indexOf('農產')];
    } else if ($.inArray('其他', d.Category) > -1) {
        color = colors[categories.indexOf('其他')];
    }
    console.log(d.ComName + " " + color);
    return color;
}

function start_dic() {

    // prepare d3 tips
    var tip_dic = d3.tip()
            .attr('class', 'd3-tip-dic')
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
            if($(window).width()<=1024){//窄螢幕
                var setWidth=$(window).width()/2-280;
                d3.select("#svg-wrap-dic").style("position","relative").style("top","40px").style("left","-10px");//test
                d3.select("#menu-wrap-dic")
                .style("position","relative").style("top","-80px").style("left",setWidth+"px")
                .style("height","50px").style("width","600px");
            }else{//寬螢幕
                var setWidth=$(window).width()/2-480;
                d3.select("#svg-wrap-dic").style("position","relative").style("top","30px").style("left","-280px");//test
                d3.select("#menu-wrap-dic")
                .style("position","relative").style("top","-120px").style("left",setWidth+"px")
                .style("height","50px").style("width","600px");
            }
        }
        else {
            type_dis_dic = "none";
            cate_dis_dic = "block";
            d3.select("#svg-wrap-dic").style("position","static");//解圖層覆蓋無法點擊其他div、svg的問題
            if($(window).width()<=1024){//窄螢幕
                var setWidth=$(window).width()/2-160;
                d3.select("#svg-wrap-dic").style("top","30px").style("left","30px");//test
                d3.select("#menu-wrap-dic")
                .style("position","relative").style("top","-80px").style("left",setWidth+"px")
                .style("height","50px").style("width","600px");
            }else{//寬螢幕
                var setWidth=$(window).width()/2-300;
                d3.select("#svg-wrap-dic").style("top","30px").style("left","-65px");//分群
                d3.select("#menu-wrap-dic")
                .style("position","relative").style("top","-120px").style("left",setWidth+"px")
                .style("height","50px").style("width","600px");//項目
            }
        }
//        d3.select("#type-wrap-dic").style("display", type_dis_dic);
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
                    $("#dic-" + cate + "-cateinter").html("");//取消按鈕前，先清空交集廠商數
                    cancel_highlight(clicked_cate_dic);
                    d3.select("#cate-box-dic-" + cate).style("opacity", 0.3).style("background-color", "transparent");
                    d3.select("#label-wrap-dic").style("display", "none");
                } else {
                    clicked_cate_dic.add(cate);
                    mydata_dic.forEach(function (o, i) {
                        o.Category.forEach(function (j) {
                            if (j == cate) {
                                strSummary += "<div id="+o.ComName+">"+o.ComName + "</div>";
                            }
                        })
                    });
                    $("#dic-" + cate + "-summary").html(strSummary);
                    set_highlight(clicked_cate_dic, cate);
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
                        return colororder_dic(d);
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
    function set_highlight(catelist, cate) {
        var cntCateinter = 0;
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
                cntCateinter += 1;
                
                //將風險廠商交集處畫紅字
                //console.log(d);//test
                $("#"+d.ComName).css("color","red");
            }
            return col;
        });
        if(cntCateinter != 0) {
            $("#dic-" + cate + "-cateinter").html("交集的廠商數：" + cntCateinter);
        }
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
                return colororder_dic(d);
            })
            .style("stroke", "white")
            .style("stroke-width", "2px")
            .style("cursor", "all-scroll")
            .on('mouseenter', function (d) {
                var current_opacity = d3.select(".d3-tip-dic").style("opacity");
                tip_dic.show(d);
                d3.select(".d3-tip-dic")
                        .style("opacity", current_opacity)
                        .transition()
                        .duration(300)
                        .style("opacity", 1)
                        .style('pointer-events', 'none');
            })
            .on('mouseleave', function () {
                d3.select(".d3-tip-dic")
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
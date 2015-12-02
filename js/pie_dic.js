
var width = 240,
        height = 240,
        radius = Math.min(width-20, height-20) / 2;

var color = d3.scale.ordinal()
        .domain(['化學', '農產', '飼料', '食品', '飲料', '藥品', '其他'])
        .range(['#F0C808', '#F694C1', '#B79CED', '#1787A0', '#15B097', '#542E71', '#A2CD5A']);

var arc = d3.svg.arc()
        .outerRadius(radius - 30)
        .innerRadius(0);

var labelArc = d3.svg.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 20);

var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.Percentage;
        });

var svg_pie_dic = d3.select("#pie_dic").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2.5 + "," + height / 2 + ")");

d3.csv("pie_dic.csv", type, function (error, data) {
    if (error)
        throw error;

    var g = svg_pie_dic.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
    
    g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color(d.data.Var1);
            });

    g.append("text")
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.data.Var1 + " " + Math.round(d.data.Percentage) + "%";
            });
});

function type(d) {
    d.Percentage = +d.Percentage;
    return d;
}

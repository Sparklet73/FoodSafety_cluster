var tog_dic = false;

$('ul.nav a').on('shown.bs.tab', function (e) {
    if (e.currentTarget.hash == "#tabCH2Cl2") {
        if (tog_dic == false) {
            tog_dic = true;
            var pie_dic = new d3pie("#pie_dic", {
                "header": {
                    "title": {
                        "fontSize": 22,
                        "font": "verdana"
                    },
                    "subtitle": {
                        "color": "#999999",
                        "fontSize": 10,
                        "font": "verdana"
                    },
                    "location": "top-left",
                    "titleSubtitlePadding": 12
                },
                "footer": {
                    "color": "#999999",
                    "fontSize": 11,
                    "font": "open sans",
                    "location": "bottom-center"
                },
                "size": {
                    "canvasHeight": 240,
                    "canvasWidth": 240,
                    "pieOuterRadius": "60%"
                },
                "data": {
                    "sortOrder": "value-asc",
                    "content": [
                        {
                            "label": "化學",
                            "value": 13.81,
                            "color": "#7D5174"
                        },
                        {
                            "label": "其他",
                            "value": 24.65,
                            "color": "#FFB400"
                        },
                        {
                            "label": "食品",
                            "value": 19.72,
                            "color": "#247BA0"
                        },
                        {
                            "label": "藥品",
                            "value": 31.56,
                            "color": "#5CCFF9"
                        },
                        {
                            "label": "飲料",
                            "value": 5.13,
                            "color": "#02C39A"
                        },
                        {
                            "label": "農產",
                            "value": 2.37,
                            "color": "#F096CA"
                        },
                        {
                            "label": "飼料",
                            "value": 2.56,
                            "color": "#A894BF"
                        }
                    ]
                },
                "labels": {
                    "outer": {
                        "format": "label-percentage2",
                        "pieDistance": 32
                    },
                    "inner": {
                        "format": "none"
                    },
                    "mainLabel": {
                        "font": "verdana",
                        "fontSize": 12
                    },
                    "percentage": {
                        "color": "#333333",
                        "font": "verdana",
                        "fontSize": 12,
                        "decimalPlaces": 0
                    },
                    "value": {
                        "color": "#241515",
                        "font": "verdana",
                        "fontSize": 12
                    },
                    "lines": {
                        "enabled": true,
                        "color": "#726a6a"
                    },
                    "truncation": {
                        "enabled": true
                    }
                },
                "effects": {
                    "pullOutSegmentOnClick": {
                        "speed": 400,
                        "size": 8
                    }
                }
            });
        }
    }
});
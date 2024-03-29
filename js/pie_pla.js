var pie_pla = new d3pie("#pie_pla", {
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
				"value": 24.18,
				"color": "#7D5174"
			},
			{
				"label": "其他",
				"value": 26.37,
				"color": "#FFB400"
			},
			{
				"label": "食品",
				"value": 10.99,
				"color": "#247BA0"
			},
			{
				"label": "藥品",
				"value": 35.16,
				"color": "#5CCFF9"
			},
			{
				"label": "飲料",
				"value": 3.3,
				"color": "#02C39A"
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
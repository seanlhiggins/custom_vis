looker.plugins.visualizations.add({
    create: function(element, config) {
        element.innerHTML = "<div id='variablePie'></div>";

    },
    updateAsync: function(data, element, config, queryResponse, details, done) {
        // this.element.innerHTML = '' // clear container of previous vis
        this.clearErrors(); // clear any errors from previous updates

        // ensure data fit - requires no pivots, exactly 1 dimension_like field, and exactly 2 measure_like fields
        if (!handleErrors(this, queryResponse, {
                min_pivots: 0,
                max_pivots: 0,
                min_dimensions: 1,
                max_dimensions: 1,
                min_measures: 2,
                max_measures: 2
            })) {
            return;
        }
        // intended stealing David Szangarten's stuff here to get the weighted mean YEAH YOU READING THAT RIGHT. 
        // But it was too much hassle so I just got a % of total. Still stole the maxofarray function.
        var all_scores = []

        console.log(data[0]);
        for (var i = 0; i <= data.length; i++) {
            all_scores.push(data[0][queryResponse.fields.measure_like[0].name].value);
        }
        var maxScore = getMaxOfArray(all_scores)
        var selectedScore = 0;
        var selectedRow = config.keyword_search - 1
        if (!config.keyword_search) {
            selectedScore = maxScore;
        } else {
            selectedScore = data[selectedRow][queryResponse.fields.measure_like[0].name].value
        }
        var percentageSelectedOfMax = (selectedScore / maxScore) * 50

        function getMaxOfArray(numArray) {
            return Math.max.apply(null, numArray);
        }

        function handleErrors(vis, res, options) {
            var check = function(group, noun, count, min, max) {
                if (!vis.addError || !vis.clearErrors) {
                    return false;
                }
                if (count < min) {
                    vis.addError({
                        title: "Not Enough " + noun + "s",
                        message: "This visualization requires " + (min === max ? 'exactly' : 'at least') + " " + min + " " + noun.toLowerCase() + (min === 1 ? '' : 's') + ".",
                        group: group
                    });
                    return false;
                }
                if (count > max) {
                    vis.addError({
                        title: "Too Many " + noun + "s",
                        message: "This visualization requires " + (min === max ? 'exactly' : 'no more than') + " " + max + " " + noun.toLowerCase() + (min === 1 ? '' : 's') + ".",
                        group: group
                    });
                    return false;
                }
                vis.clearErrors(group);
                return true;
            };
            var _a = res.fields,
                pivots = _a.pivots,
                dimensions = _a.dimension_like,
                measures = _a.measure_like;
            return (check('pivot-req', 'Pivot', pivots.length, options.min_pivots, options.max_pivots) &&
                check('dim-req', 'Dimension', dimensions.length, options.min_dimensions, options.max_dimensions) &&
                check('mes-req', 'Measure', measures.length, options.min_measures, options.max_measures));
        }
        console.log(data, queryResponse);

        var datalist = [];
        data.forEach(function(value) {
            datalist.push({
                name: LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[0].name]),
                y: value[queryResponse.fields.measures[0].name].value, // Y dictates the radius of the slice
                z: value[queryResponse.fields.measures[1].name].value, // Z dictates the width of the slice
            });
        })
        var vistitle = queryResponse.fields.dimensions[0].label_short;
        options = {
            axisRadiusMin: {
                type: 'string',
                label: 'Radius Min',
                placeholder: 10,
                max: 100,
                default: 10,
                section: 'Ranges'
            },
            axisRangeMin: {
                type: 'string',
                label: 'Width Min',
                placeholder: 10,
                max: 100,
                default: 10,
                section: 'Ranges'
            },
            color_range: {
                section: "Format",
                order: 1,
                type: "array",
                label: "Color Range",
                display: "colors",
                default: ["#9E0041", "#C32F4B", "#E1514B", "#F47245", "#FB9F59", "#FEC574", "#FAE38C", "#EAF195", "#C7E89E", "#9CD6A4", "#6CC4A4", "#4D9DB4", "#4776B4", "#5E4EA1"]
            },
            dataLabelToggle: {
                label: 'Data Value Labels',
                type: 'boolean',
                display: 'select',
                section: "Labels",
                default: true,
                order: 1
            },
            dataLabelSize: {
                label: 'Data Label Size',
                min: 2,
                max: 15,
                step: .5,
                default: 8,
                section: 'Labels',
                type: 'number',
                display: 'range',
                order: 1
            },
            innerRadiusSize: {
                label: 'Inner Radius Size',
                min: 2,
                max: 50,
                step: .5,
                default: 5,
                section: 'Ranges',
                type: 'number',
                display: 'range',
                order: 2
            },
            keyword_search: {
                section: "Data",
                type: "string",
                label: "Custom row to search for",
                placeholder: "Enter row value to display score"
            },
            legendtoggle: {
                label: 'Legend',
                type: 'boolean',
                display: 'select',
                section: "Style",
                default: true,
                order: 2
            },

            labelColour: {
                label: 'Title Colour',
                section: "Labels",
                default: "#C80815",
                type: "string",
                display: "color",
                display_size: "half",
                order: 2
            },
            textLabel: {
                type: 'string',
                label: 'Custom Title',
                placeholder: queryResponse.fields.measure_like[0].label + " * " + queryResponse.fields.measure_like[1].label,
                section: 'Style'
            },
            titleSize: {
                label: 'Title Size',
                min: 2,
                max: 25,
                step: .5,
                default: 5,
                section: 'Style',
                type: 'number',
                display: 'range',
                order: 1
            }
        }
        var colorRange = ["#9E0041", "#C32F4B", "#E1514B", "#F47245", "#FB9F59", "#FEC574", "#FAE38C", "#EAF195", "#C7E89E", "#9CD6A4", "#6CC4A4", "#4D9DB4", "#4776B4", "#5E4EA1"]
        console.log(config.color_range);

        Highcharts.setOptions({
            colors: colorRange
        });


        // Create an option for all the unique values in the pivot list so each pivoted
        // value can have its own color selection
        for (let i = 0; i < datalist.length; i++) {
            var field = datalist[i].name;
            id = "color_" + i
            options[id] = {
                label: field,
                default: Highcharts.getOptions().colors[i],
                section: "Style",
                type: "string",
                display: "color",
                display_size: "half",
                order: 1
            }
        }

        function addTitle() {
            if (this.title) {
                this.title.destroy();
            }
            var r = this.renderer,
                x = this.series[0].center[0] + this.plotLeft,
                y = this.series[0].center[1] + this.plotTop;
            this.title = r.text('<span style="text-anchor:middle><b>' + queryResponse.fields.measures[0].label_short + '</b></span><br>' + '<span style="text-align:center>' + selectedScore + '</span>', 0, 0)
                .css({
                    color: config.color_0,
                    textAlign: 'center',
                    fontSize: percentageSelectedOfMax / 4 + 'px'
                }).hide()
                .add();

            var bbox = this.title.getBBox();
            this.title.attr({
                x: x - (bbox.width / 2),
                y: y
            }).show();
        }

        Highcharts.chart('variablePie', {
            chart: {
                type: 'variablepie',
                events: {
                    load: addTitle,
                    redraw: addTitle,
                }
            },
            title: {
                text: config.textLabel,
                style: {
                    fontSize: config.titleSize,
                    color: config.labelColour
                },
                y: 0,
                x: 0,
                align: 'center',
                verticalAlign: 'middle'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    queryResponse.fields.measure_like[0].label + ': <b>{point.y}</b><br/>' +
                    queryResponse.fields.measure_like[1].label + ': <b>{point.z}</b><br/>'
            },
            plotOptions: {
                variablepie: {
                    animation: false,
                    showInLegend: true,
                    pointPadding: 0.2,
                    borderWidth: 0,
                    dataLabels: {
                        allowOverlap: true,
                        enabled: true
                    },
                }
            },
            series: [{
                minPointSize: 10,
                dragDrop: true,
                innerSize: percentageSelectedOfMax + '%',
                // zMax: config.radius,
                zMin: 10,
                name: 'looker',
                data: datalist,
                dataLabels: {
                    enabled: config.dataLabelToggle,
                    style: {
                        "color": "contrast",
                        "fontSize": config.dataLabelSize
                    }
                },
                point: {
                    events: {
                        click: function() {
                            var cell = data[this.index][queryResponse.fields.measures[0].name];
                            LookerCharts.Utils.openDrillMenu({
                                links: cell.links,
                                event: event
                            });
                        }
                    }
                }
            }],
            credits: {
                enabled: false
            },
            legend: {
                labelFormatter: function() {
                    return this.name;
                },
                enabled: config.legendtoggle
            }
        });

        this.trigger('registerOptions', options) // register options with parent page to update visConfig

        done()
    }

});

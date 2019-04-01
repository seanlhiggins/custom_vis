looker.plugins.visualizations.add({
    create: function(element, config){
        element.innerHTML = "<div id='stack_group'></div>";
    },
    updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        var html = `<style>
            #stack_group {
            margin: 0 auto;
            min-width: 310px;
            height: 400px;
            font-family: 'Open Sans', Helvetica, Arial, sans-serif; 
        }
        </style>`;
        // Get the number of measures the user has selected
        var numMeasures = queryResponse.fields.measure_like.length;
        var numDimensions = data.length

        var firstnrows = data.slice(0,numDimensions);
       // A bunch of arrays to store the measure value for passing into the series later
        var firstMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            firstMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name].value * 10) / 10)
        }
        var w = window;

            
        var somelist = []
        firstnrows.forEach(function(row){
            somelist.push(row[queryResponse.fields.measure_like[0].name].value);

        });
        // console.log(somelist);

        for(let i=3;i<numMeasures;i++){
            w["arr_"+i] = [];
            firstnrows.forEach(function(measurevalue){
            w["arr_"+i].push(Math.round(measurevalue[queryResponse.fields.measure_like[i].name].value * 10)/10)
            // console.log(w["arr_"+i]);

        });
    
        // console.log(w["arr_1"]);

        var secondMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            secondMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[1].name].value * 10) / 10)
        }
        var thirdMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            thirdMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[2].name].value * 10) / 10)
        }
        var fourthMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            fourthMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[3].name].value * 10) / 10)
        }
       // A names of all the cells from the dimensions for the xaxis as well as labels of the measures for the pies
       var dimensionvalues = []
       data.forEach(function(value){
        dimensionvalues.push(LookerCharts.Utils.htmlForCell(value[queryResponse.fields.dimensions[0].name]));
       });

        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measurenames = []
       queryResponse.fields.measure_like.forEach(function(value){
        measurenames.push(value.label_short);
       });


       // just a function to get the sum of each arrays so user doesn't have to do Looker totals which add SQL overhead

        function getSum(total, num) {
          return total + Math.round(num);
        }

        // console.log(queryResponse,data);
       
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "stack_group";
    }
    Highcharts.chart('stack_group', {

        chart: {
            type: 'column'
        },

        xAxis: {
            categories: dimensionvalues
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [
        // first stack
            {
                data: [29.9, 71.5, 106.4, 129.2, 144.0],
                stack: 0,
                name: 'Cars',
                tooltip: {
                    pointFormatter: function() {
                        return this.series.name + ' (North): <b>' + this.y + '</b>';
                    }
                }
            }, {
                data: [30, 176.0, 135.6, 148.5, 216.4],
                stack: 0,
                name: 'Trucks',
                tooltip: {
                    pointFormatter: function() {
                        return this.series.name + ' (North): <b>' + this.y + '</b>';
                    }
                }
            // second stack
            }, {
                data: [106.4, 129.2, 144.0, 29.9, 71.5],
                stack: 1,
                colorIndex: 0,
                name: 'Cars (South)',
                linkedTo: 'Cars'
            }, {
                data: [148.5, 216.4, 30, 176.0, 135.6],
                stack: 1,
                colorIndex: 1,
                name: 'Trucks (South)',
                linkedTo: 'Trucks'
            }
        ]});
            doneRendering()
};

/**
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

 // Dependencies:
//[
//	 "https://code.highcharts.com/highcharts.js",
//   "https://code.highcharts.com/highcharts-more.js"
// ]
//

const visObject = {
  /**
   * Configuration options for your visualization. In Looker, these show up in the vis editor
   * panel but here, you can just manually set your default values in the code.
   **/
   options: {
     first_option: {
         type: "string",
       label: "My First Option",
       default: "Default Value"
     },
     second_option: {
         type: "number",
       label: "My Second Option",
       default: 42
     }
   },
  
  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
     create: function(element, config){
         element.innerHTML = "<h1>Ready to render!</h1>";
     },
 
  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
     updateAsync: function(data, element, config, queryResponse, details, doneRendering){
     
     element.innerHTML = ''
     element.id = 'container'
     var series = []
     // create series 
     var max = 1000
     data.slice(-20).forEach(function(d) {

         let friendlyclassvalue = d['game.count'].value
        if(friendlyclassvalue>max){
           max = friendlyclassvalue
        };
         var ratio = friendlyclassvalue/max
        var ratioofrgb = 255*ratio
        console.log(friendlyclassvalue)
        series.push({
            name: d['game.friendly_class'].value,
            data: [{
              value: d['game.count'].value, 
              name: d["game.opponent_class"]["value"],
              color: `rgb(155, 102, ${ratioofrgb})`
         }]
       });
     });

 
  
     
     Highcharts.chart('container', {
     chart: {
         type: 'packedbubble',
     },
     series: series,
       tooltip: {
         useHTML: true,
         pointFormat: '<b>{point.name}:</b> {point.y}</sub>'
     },
     plotOptions: {
         packedbubble: {
           layoutAlgorithm: {
                gravitationalConstant: 1,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            },
             dataLabels: {
                 enabled: true,
                 format: '{point.name}',
                 style: {
                     color: 'black',
                     textOutline: 'none',
                     fontWeight: 'normal'
                 }
             },
             minPointSize: 5
         }
     }
 });
 
         doneRendering()
     }
 };
 
 looker.plugins.visualizations.add(visObject);

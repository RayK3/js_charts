function colGen(opacity, color) {
    if(color === undefined)
      return 'rgba('+ Math.floor(Math.random() * 256) +','+ Math.floor(Math.random() * 256) +','+ Math.floor(Math.random() * 256)+','+opacity+')';
    if(color === 'red') {
      var red = Math.floor(Math.random() * 100) + 155; //creates a red pixel value from 155-255
      var green = Math.floor(Math.random() * 75); //creates a green pixel value from 0-75
      var blue = Math.floor(Math.random() * 75); //creates a blue pixel value from 0-75
    }
    if(color === 'green') {
      var red = Math.floor(Math.random() * 75); //creates a red pixel value from 0-75
      var green = Math.floor(Math.random() * 100) + 155; //creates a green pixel value from 155-255
      var blue = Math.floor(Math.random() * 75); //creates a blue pixel value from 0-75
    }
    if(color === 'blue') {
      var red = Math.floor(Math.random() * 75); //creates a red pixel value from 0-75
      var green = Math.floor(Math.random() * 75); //creates a green pixel value from 0-75
      var blue = Math.floor(Math.random() * 100) + 155; //creates a blue pixel value from 155-255
    }

    var colString = 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')';
    return colString;
  }


function dataSetEntryFrom(wordStat){
        let ds = {};
        ds.label = wordStat.word;
        ds.data = wordStat.countsByDate
            .sort( (a, b) => a.date > b.date)
            .map( cbd => { return {x : cbd.date* 1000, y : cbd.count } });
        ds.borderColor = colGen(0.7);
        ds.backgroundColor = colGen(1);
        return ds;
      };



function redraw(chart, jsonData){
    console.log(chart);

    function removeData() {
        chart.data.labels = [];
        chart.data.datasets.forEach((dataset) => {
            dataset.data=[]
        });
    };

    // updates one dataset only
    function repopulateData(chart, labels, values) {
      labels.forEach( l => chart.data.labels.push(l) );
      values.forEach( v => chart.data.datasets[0].data.push(v) );
    };

    removeData();
    repopulateData( chart,
      jsonData.map( o => o.word ),
      jsonData.map( o => o.count));
      chart.update();
}



//////////////////////////////

let graph_neg = {
      jsonData :  [],
      myChart : null,
      firstRendering : true,


      draw : function(){
      if( ! this.firstRendering) { redraw(graph_neg.myChart, jsonData); return; } // not first drawing
        var ctx = document.getElementById("myChartNeg").getContext('2d');
        graph_neg.myChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: jsonData.map( o => o.word ) ,
              datasets: [{
                  label: 'Word frequency',
                  data: jsonData.map( o => o.count ) ,
                  backgroundColor: jsonData.map(o => colGen(0.7, "red")) ,


              }]
          },


          options: {
              backgroundColor: 'rgba(255,0,50,0.3)',
              borderColor: 'rgba(200,0,200,1)',
              hoverColor: "red",

              legend: { display: false },
              animation: {
                  animateScale: true,
                  animateRotate: true
              },

              elements: {
                arc: {borderWidth: 0}
              }


//					        rotation: -Math.PI,
//					        cutoutPercentage: 30,
//					        circumference: Math.PI,
           }




        });

        this.firstRendering = false;
    },




    getData : function(){
        function handleSuccess () {
          jsonData = JSON.parse( this.responseText ).reverse().slice(0,10); // convert data from JSON to a JavaScript object
          console.log("neg:")
          console.log(jsonData);
          graph_neg.draw();
        }
        function handleError () {
          console.log( 'An REST endpoint error  occurred' );
        }
        const asyncRequestObject = new XMLHttpRequest();
        asyncRequestObject.open('GET', rest_endpoint + '/wordcounts_neg');

        asyncRequestObject.onload = handleSuccess;
        asyncRequestObject.onerror = handleError;
        asyncRequestObject.send();
      },


    renderInSeconds: function(seconds) {
        setTimeout(() => {  this.getData(); this.renderInSeconds(5); },
        seconds * 1000);}
  };

///////////////////////////
let graph_pos = {
      jsonData :  [],
      myChart : null,
      firstRendering : true,


      draw : function(){
      if( ! this.firstRendering) { redraw(graph_pos.myChart, jsonData); return; } // not first drawing
        var ctx = document.getElementById("myChartPos").getContext('2d');
        graph_pos.myChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: jsonData.map( o => o.word ) ,
              datasets: [{
                  label: 'Word frequency',
                  data: jsonData.map( o => o.count ) ,
                  backgroundColor: jsonData.map(o => colGen(0.7, "green")) ,
              }]
          },

          options: {
              backgroundColor: 'rgba(255,0,50,0.3)',
              borderColor: 'rgba(200,0,200,1)',
              hoverColor: "red",

              legend: { display: false },
              animation: {
                  animateScale: true,
                  animateRotate: true
              },


              elements: {
                arc: {borderWidth: 0}
              }

//					        rotation: Math.PI,
//					        cutoutPercentage: 30,
//					        circumference: Math.PI,
           }

        });
        this.firstRendering = false;
    },


    getData : function(){
        function handleSuccess () {
          jsonData = JSON.parse( this.responseText ).reverse().slice(0,10); // convert data from JSON to a JavaScript object
          console.log("pos:")
          console.log(jsonData);
          graph_pos.draw();
        }
        function handleError () {
          console.log( 'An REST endpoint error  occurred' );
        }
        const asyncRequestObject = new XMLHttpRequest();
        asyncRequestObject.open('GET', rest_endpoint + '/wordcounts_pos');

        asyncRequestObject.onload = handleSuccess;
        asyncRequestObject.onerror = handleError;
        asyncRequestObject.send();
      },


    renderInSeconds: function(seconds) {
        setTimeout(() => {  this.getData(); this.renderInSeconds(5); },
        seconds * 1000);}
  };


window.addEventListener("load", () => graph_neg.renderInSeconds(0.1) );
window.addEventListener("load", () => graph_pos.renderInSeconds(0.2) );

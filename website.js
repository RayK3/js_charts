let sentiment = {
		sentimentDataArr : [],
		chart: null,
		firstRendering: true,
		getData :  function (){
		      function handleSuccess () {
		          sentiment.sentimentDataArr = JSON.parse( this.responseText )
		          	.sort((a, b) => a.sentiment - b.sentiment )
		          	.reverse();
		          sentiment.createGraphCanvas();
		      }
		      function handleError () {
		        console.log( 'An error occurred' );
		      }
		      const asyncRequestObject = new XMLHttpRequest();
		      asyncRequestObject.open('GET', rest_endpoint + '/all');
		      asyncRequestObject.onload = handleSuccess;
		      asyncRequestObject.onerror = handleError;
		      asyncRequestObject.send();
		},



    createGraphCanvas : function() {
    	let topBottom = [];
      	let limit = 5;

      	sentiment.sentimentDataArr.slice(0, limit).forEach( e => topBottom.push(e));
      	sentiment.sentimentDataArr.reverse().slice(0, limit).reverse().forEach( e => topBottom.push(e));

    	console.log(topBottom);

    	var gradientFill = document.getElementById('highSentChart').getContext('2d').createLinearGradient(0, 0, 500, 500);
    	gradientFill.addColorStop(0, "rgba(250, 30, 48, 0.74)");
    	gradientFill.addColorStop(1, "rgba(30, 48, 250, 0.7)");

    	var sentiments = topBottom.map(e => e.sentiment + 2);

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

        chart = new Chart(document.getElementById('highSentChart').getContext('2d'), {
          type: 'line',

          data: {
              labels: topBottom.slice(0, limit*2).map(e => e.text.substring(0, 20)+"..."),
              datasets: [{
            	  pointHoverBackgroundColor: "rgba(250, 232, 30, 0.98)",

                  fill: true,
                  backgroundColor: gradientFill,
                  pointHoverRadius: sentiments.slice(0, limit*2).map( s => s * s * 7 + 2),
                  showLine: false, // no line shown
                  data: sentiments.slice(0, limit*2),
                  pointRadius: sentiments.slice(0, limit*2).map( s => s * s * 7),
              }]
          },
          options: {

        	 onClick:  function(e, array){
        		 let index = array[0]._index;
        		 console.log(index);
        		 window.location.href="/video/" + topBottom[index].id;
              },

              responsive: true,
              legend: { display: false },
              layout: {
	              padding: 80 },
              elements: {
                  point: { pointStyle: "circle" } },
              scales: {
                      xAxes: [{
                    	  display: false
                      }],
	                  yAxes: [{
	                	  display: true
	                  }]
                  }
          }
        });

				this.firstRendering = false;

    }

}
    window.addEventListener('load', sentiment.getData);

let sentiment = {
		sentimentDataArr : [],
		chart: null,
		firstRendering : true,
		getData :  function (){
		      function handleSuccess () {
		          sentiment.sentimentDataArr = JSON.parse( this.responseText )
		          	.sort((a, b) => a.sentiment - b.sentiment )
		          	.reverse();
		          sentiment.draw();
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

		redraw: function(chart, data) {
			console.log(chart);
			function removeData() {
				chart.data.labels = [];
				chart.data.datasets.forEach((dataset) => {
						dataset.data=[]
				});
			};

			//updates the data in one dataset
			function repopulateData(chart, labels, values) {
				labels.forEach( l => chart.data.labels.push(l) );
				values.forEach( v => chart.data.datasets[0].data.push(v) )
			};

			removeData();
			let topBottom = [];
				let limit = 5;
			data.slice(0, limit).forEach( e => topBottom.push(e));
			data.reverse().slice(0, limit).reverse().forEach( e => topBottom.push(e));
			repopulateData( chart,
						topBottom.slice(0, limit*2).map(e => e.text.substring(0, 20)+"..."),
						topBottom.map(e => e.sentiment + 2).slice(0, limit*2));
			chart.update()
		},

    draw : function() {
			if(! this.firstRendering) { redraw(chart, sentiment.sentimentDataArr); return; }//not first drawing
    	let topBottom = [];
      	let limit = 5;

      	sentiment.sentimentDataArr.slice(0, limit).forEach( e => topBottom.push(e));
      	sentiment.sentimentDataArr.reverse().slice(0, limit).reverse().forEach( e => topBottom.push(e));

    	console.log("topBottom", topBottom);

    	var gradientFill = document.getElementById('highSentChart').getContext('2d').createLinearGradient(0, 0, 500, 500);
    	gradientFill.addColorStop(0, "rgba(250, 30, 48, 0.74)");
    	gradientFill.addColorStop(1, "rgba(30, 48, 250, 0.7)");

    	var sentiments = topBottom.map(e => e.sentiment + 2);

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
              },
							animation: {
								duration: 0
							}
          }
        });



    },

		renderInSeconds: function(seconds) {
			console.count();
			setTimeout(() => { this.getData(); this.renderInSeconds(5);},
			seconds*1000);}
};

window.addEventListener('load', sentiment.renderInSeconds(0.2));

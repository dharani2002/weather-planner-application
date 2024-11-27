// API Key and URL setup


const apiKey1 = '490a7e18cea7f17e2feb23b413208354'; //openweather api key

const nameElement= document.getElementById("location");
const apiUrl1 = `https://api.openweathermap.org/data/2.5/forecast`;
const showGraphButton=document.getElementById("showGraph");


showGraphButton.addEventListener('click', () => {
  const location = nameElement.innerText;
  
  if (location) {
      fetchHourlyTemperatures(location);
  }
  else {
      alert('Enter a valid City name');
  }
});


// Fetch weather data
 async function fetchHourlyTemperatures(location) {
  const url1=`${apiUrl1}?q=${location}&units=metric&appid=${apiKey1}`;
  
    
  try {
    const response =  await fetch(url1);
    const data = await response.json();

    // Extract the list of forecast data
    const forecastList = data.list;

    // Map through the forecast list and get temperatures
    const temperatures = forecastList.map(item => item.main.temp);

    /*const humidity=forecastList.map(item=>{
      return `${item.main.humidity}%`;
    });*/

    // Get corresponding times (for labels)
    const times = forecastList.map(item => {
      const date = new Date(item.dt * 1000); // Convert Unix timestamp to JavaScript Date
      return `${date.getHours()}:00`; // Format as "HH:00"
    });

    console.log("Hourly Temperatures:", temperatures);
    console.log("Hourly Times:", times);
    //console.log("Hourly humidity:",humidity);
    createGraph(times, temperatures);

    return { temperatures, times };
  } catch (error) {
    console.error("Error fetching hourly temperatures:", error);
  }
}




// create graph
let myChart;
function createGraph(labels,data){
const ctx = document.getElementById('myChart');
labels.splice(8);
data.splice(8);
let minValue=Math.min(...data)-1;
let maxValue=Math.max(...data)+1;
if(myChart){
  myChart.destroy();
}
myChart=new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      fill: false,
      lineTension:0,
      label: 'Temperatures at different times of day',
      data: data,
      borderWidth: 1
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      y: {
        suggestedMin:minValue,
        suggestedMax:maxValue
      }
    }
  }
});
}




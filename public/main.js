// APIXU Info
const apiKey = '&APPID=6f2c26f2eea8cdaefefd94729d081acf';
const forecastUrl = 'http://api.openweathermap.org/data/2.5/';
const weatherIconUrl = 'http://openweathermap.org/img/w/';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $demo = $('#demo');
const $container = $('.container');
const $currentWeather = $('#weatherNow');
// const $samplebutton = $('#button2');
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const zipcode = 60661;
let weatherParameter;
let latitude;
let longitude;


// AJAX functions
async function getCurrentForecast() {
    const urlToFetch = forecastUrl + 'weather?' + weatherParameter + '&units=imperial' + apiKey;

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let currentDay = jsonResponse;
            return currentDay;
        }
    } catch(error) {
        console.log(error);
    }
}

async function get5DayForecast() {
    const urlToFetch = forecastUrl + 'forecast?q=' + $input.val() + '&units=imperial' + apiKey;

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let days = jsonResponse.list;
            return days;
        }
    } catch(error) {
        console.log(error);
    }
}

// Render functions

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    weatherParameter = `lat=${Math.round(latitude)}&lon=${Math.round(longitude)}`;
  } else {
    weatherParameter = `zip=${zipcode},us`;
    let positionContent = '<p>Geolocation is not supported by this browser.</p>';
    $demo.append(positionContent);
  }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(`Lat: ${latitude}    Lon: ${longitude}`);

    let latLongPosition = '<p>Latitude: ' + position.coords.latitude + 
    '<br>Longitude: ' + position.coords.longitude + ' </p>';

    $demo.append(latLongPosition);
}


function renderCurrentForecast(currentDay) {    
    const currentTemp = Math.round(currentDay.main.temp);
    const today = weekDays[(new Date(currentDay.dt * 1000).getDay())-1];
    let weatherContent =
    '<h2>' + currentTemp + ' F&deg; </h2>' +
    '<img src="' + weatherIconUrl + currentDay.weather[0].icon +
    '.png" class="weathericon" />' +
    '<h3>' + currentDay.weather[0].description + '</h3>' +
    '<h2>' + today + '</h2>';
    
    $currentWeather.append(weatherContent);
}

function render5DayForecast(days) {
    // Temperature Array for every 3 hours in a 5 day period as given by API
    const fiveDayTempRange = days.map(day => Math.round(day.main.temp));
    let twentyFourHourRange = [];

    // Divide up fiveDayTempRange by 8 time stamps per day
    for (let dayTemps = 0; dayTemps < 5; dayTemps++) {
        twentyFourHourRange.push(fiveDayTempRange.splice(0, 8));
    }

    // Displays max & min temperature for each day
    let maxTemps = twentyFourHourRange.map(dayArray => {
        return dayArray.reduce(function (max, temp) {
            return max > temp ? max : temp;
        }, {});
    });
    let minTemps = twentyFourHourRange.map(dayArray => dayArray.reduce((min, temp) => min < temp ? min : temp));

    $weatherDivs.forEach(($day, index) => {
      let weatherContent =
        '<h2> High: ' + maxTemps[index] + ' F&deg; </h2>' +
        '<h2> Low: ' + minTemps[index] + ' F&deg; </h2>' +
        '<img src="' + weatherIconUrl + days[index*8].weather[0].icon +
            '.png" class="weathericon" />' +
        '<h3>' + days[index*8].weather[0].description + '</h3>' +
        '<h2>' + weekDays[(new Date(days[index*8].dt * 1000).getDay())-1] + '</h2>';
        console.log(weekDays[(new Date(days[index*8].dt * 1000).getDay())-1]);
      $day.append(weatherContent);
    });
}

function executeGeolocationWeather() {
    getLocation();
    getCurrentForecast();
}

function executeSearch() {
    weatherParameter = `q=${$input.val()}`;
    $weatherDivs.forEach(day => day.empty());
    // $destination.empty();
    // $container.css("visibility", "visible");
    getCurrentForecast().then(forecast => renderCurrentForecast(forecast));
    get5DayForecast().then(forecast => render5DayForecast(forecast));
    return false;
}

executeGeolocationWeather();
$submit.click(executeSearch);
// $submit.onclick = function() {
//     weatherParameter = `q=${$input.val()}`;
// }


/*
function renderCurrentForecast(currentDay) {    
    const currentTemp = Math.round(currentDay.main.temp);
    const today = weekDays[(new Date(currentDay.dt * 1000).getDay())-1];
    let weatherContent =
    '<h2>' + currentTemp + ' F&deg; </h2>' +
    '<img src="' + weatherIconUrl + currentDay.weather[0].icon +
    '.png" class="weathericon" />' +
    '<h3>' + currentDay.weather[0].description + '</h3>' +
    '<h2>' + today + '</h2>';
    
    $currentWeather.append(weatherContent);
*/
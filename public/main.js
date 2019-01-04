// APIXU Info
const apiKey = '&APPID=6f2c26f2eea8cdaefefd94729d081acf';
const forecastUrl = 'http://api.openweathermap.org/data/2.5/';
const weatherIconUrl = 'http://openweathermap.org/img/w/';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $container = $('.container');
const $currentWeather = $('#weatherNow');
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
    const urlToFetch = forecastUrl + 'forecast?' + weatherParameter + '&units=imperial' + apiKey;

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
    try {
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(showPosition) ? weatherParameter = `lat=${Math.round(latitude)}&lon=${Math.round(longitude)}` : weatherParameter = `zip=${zipcode},us`;
        } 
    } catch(error) {
        // Geolocation is not supported by this browser.
        console.log(error);
    }
}
    
// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//     weatherParameter = `lat=${Math.round(latitude)}&lon=${Math.round(longitude)}`;
//     console.log(`weather parameter: ${weatherParameter}`);
//   } else {
//     weatherParameter = `zip=${zipcode},us`;
//     let positionContent = '<p>Geolocation is not supported by this browser.</p>';
//   }
// }

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(`Lat: ${latitude}    Lon: ${longitude}`);
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
    
      $day.append(weatherContent);
    });
}

function executeGeolocationWeather() {
    getLocation();
    $weatherDivs.forEach(day => day.empty());
    getCurrentForecast().then(forecast => renderCurrentForecast(forecast));
    get5DayForecast().then(forecast => render5DayForecast(forecast));
    return false;
}

function executeSearch() {
    weatherParameter = `q=${$input.val()}`;
    $currentWeather.empty();
    $weatherDivs.forEach(day => day.empty());
    getCurrentForecast().then(forecast => renderCurrentForecast(forecast));
    get5DayForecast().then(forecast => render5DayForecast(forecast));
    return false;
}

executeGeolocationWeather();
$submit.click(executeSearch);

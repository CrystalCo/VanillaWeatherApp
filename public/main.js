// APIXU Info
const apiKey = '&APPID=6f2c26f2eea8cdaefefd94729d081acf';
const forecastUrl = 'http://api.openweathermap.org/data/2.5/';
const weatherIconUrl = 'http://openweathermap.org/img/w/'

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $currentWeather = $('#weatherNow') ;
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions
async function getCurrentForecast() {
    const urlToFetch = forecastUrl + 'weather?q=' + $input.val() + '&units=imperial' + apiKey;

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
function renderCurrentForecast(currentDay) {    
    const currentTemp = Math.round(currentDay.main.temp_max);
    const today = weekDays[(new Date(currentDay.dt * 1000).getDay())-1];
    let weatherContent =
    '<h2>' + currentTemp + ' F&deg; </h2>' +
    '<img src="' + weatherIconUrl + currentDay.weather[0].icon +
    '.png" class="weathericon" />' +
    '<h3>' + currentDay.weather[0].description + '</h3>' +
    '<h2>' + today + '</h2>';
    
    $currentWeather.append(weatherContent);
}

function avgMax(days) {
    // days object contains temperatures for every 3 hours

    // Empty array to contain High's of first 24 hours
    let oneDayMaxTempRange = [];
    for (i = 0; i < 8; i++) {
        oneDayMaxTempRange.push(Math.round(days[i].main.temp_max));
    }
    console.log(`High's temperature range: ${oneDayMaxTempRange}`);

    // Displays highest temperature for first 24 hours
    let highestTemp = oneDayMaxTempRange.reduce(function (highest, temperature) {
        return highest > temperature ? highest : temperature;
    }, {});
    console.log(`Highest Temperature: ${highestTemp}`);

    // Empty array to contain Low's of first 24 hours
    let oneDayMinTempRange = [];
    for (i = 0; i < 8; i++) {
        oneDayMinTempRange.push(Math.round(days[i].main.temp_min));
    }
    console.log(`Low's temperature range: ${oneDayMinTempRange}`);

    // Displays lowest temperature for first 24 hours
    let lowestTemp = oneDayMinTempRange.reduce(function (lowest, temperature) {
        return lowest < temperature ? lowest : temperature;
    }, {});
    console.log(`Lowest Temperature: ${lowestTemp}`);

}

function render5DayForecast(days) {
    $weatherDivs.forEach(($day, index) => {
      const maxTempInF = Math.round(days[index*8].main.temp_max);
      const minTempInF = Math.round(days[index*8].main.temp_min);
      let weatherContent =
        '<h2> High: ' + maxTempInF + ' F&deg; </h2>' +
        '<h2> Low: ' + minTempInF + ' F&deg; </h2>' +
        '<img src="' + weatherIconUrl + days[index*8].weather[0].icon +
            '.png" class="weathericon" />' +
        '<h3>' + days[index*8].weather[0].description + '</h3>' +
        '<h2>' + weekDays[(new Date(days[index*8].dt * 1000).getDay())-1] + '</h2>';
      $day.append(weatherContent);
    });
}

function executeSearch() {
    $weatherDivs.forEach(day => day.empty());
    $destination.empty();
    $container.css("visibility", "visible");
    getCurrentForecast().then(forecast => renderCurrentForecast(forecast));
    get5DayForecast().then(forecast => render5DayForecast(forecast));
    get5DayForecast().then(forecast => avgMax(forecast));
    return false;
}

$submit.click(executeSearch);

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

function crystalmax(obj){
    current_max = -Infinity;
    for (let i = 0; i < Object.keys(obj).length; i++){
        if (obj[i] > current_max){
            current_max = obj[i];
        }
    }
    return current_max;
}

function crystalmin(obj){
    current_min = Infinity;
    for (let i = 0; i < Object.keys(obj).length; i++){
        if (obj[i] < current_min){
            current_min = obj[i];
        }
    }
    return current_min;
}


function minMaxTemp(days) {
    // 'days' object contains temperatures for every 3 hours
    // Array that contains arrays of temperature ranges per each 24 hours that pass
    const fiveDayTempRange = days.map(day => Math.round(day.main.temp));
    console.log(`Temperature range for 5 days: ${JSON.stringify(fiveDayTempRange)}`);
    // Returns new list: 27,26,27,25,26,29,32,31,31,32,31,29,29,35,37,35,32,31,31,31,33,40,43,39,36,34,33,33,35,39,38,36,36,35,35,35,37,40,43
    // console.log(`Length of fiveDayTempRange:  ${fiveDayTempRange.length}`);  // 39 or 38

    let max_results = new Array();
    let min_results = new Array();
    let results = new Array();
    
    for (let i = 0; i < 5; i++) {
        day_results = new Array();
        for (let j = 0; j < 8; j++) {
            day_results.push(fiveDayTempRange[8 * i + j]);
        }
        results.push(day_results);

        max_temps = crystalmax(day_results);
        min_temps = crystalmin(day_results);
        max_results.push(max_temps);
        min_results.push(min_temps);
        
    }
    console.log(`Results:  ${JSON.stringify(results)}`);
    console.log(`Max Results:  ${JSON.stringify(max_results)}  Min Results:  ${min_results}`);
    

    // *****************************************************************************************

    //      const fiveDayTempRange = days.map(day => Math.round(day.main.temp));
    let twentyFourHourRange = [];
    // Divide up fiveDayTempRange by 8 items per new array
    for (let dayTemps = 0; dayTemps < 5; dayTemps++) {
        twentyFourHourRange.push(fiveDayTempRange.splice(0, 8));
    }
    console.log(`Twenty-Four Hour Arrays: ${JSON.stringify(twentyFourHourRange)}`);
    // Displays: [[40,38,36,35,33,31,31,36],[39,35,33,32,31,31,33,40],[43,39,36,35,35,35,37,37],
    // [37,37,37,38,40,42,44,45],[45,43,40,37,35,34,35,41]]

    let maximumTemperatures = twentyFourHourRange.map(dayArray => {
        return dayArray.reduce(function (max, temperature) {
            return max > temperature ? max : temperature;
        }, {});
    });
    console.log(`LOOK -- maximum temperatures: ${JSON.stringify(maximumTemperatures)}`);

    
    // Empty array to contain temperature range of first 24 hours
    let oneDayTempRange = [];
    for (i = 0; i < 8; i++) {
        oneDayTempRange.push(Math.round(days[i].main.temp));
    }

    // Displays max & min temperature for first 24 hours
    let maxTemp = oneDayTempRange.reduce(function (max, temperature) {
        return max > temperature ? max : temperature;
    }, {});
    console.log(`Max Temperature: ${maxTemp}`);

    let minTemp = oneDayTempRange.reduce(function (min, temperature) {
        return min < temperature ? min : temperature;
    }, {});
    console.log(`Min Temperature: ${minTemp}`);

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
    get5DayForecast().then(forecast => minMaxTemp(forecast));
    return false;
}

$submit.click(executeSearch);

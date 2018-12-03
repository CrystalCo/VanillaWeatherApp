// APIXU Info
const apiKey = '&APPID=6f2c26f2eea8cdaefefd94729d081acf';
const forecastUrl = 'http://api.openweathermap.org/data/2.5/';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions
async function getForecast() {
    const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=4&hours=11';

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let days = jsonResponse.forecast.forecastday;
            return days;
        }
    } catch(error) {
        console.log(error);
    }
}

// Render functions
function renderForecast(days) {
    $weatherDivs.forEach(($day, index) => {
      let weatherContent =
        '<h2> High: ' + days[index].day.maxtemp_f + ' F / ' + days[index].day.maxtemp_c + ' C </h2>' +
        '<h2> Low: ' + days[index].day.mintemp_f + ' F / ' + days[index].day.mintemp_c + 'C </h2>' +
        '<img src="http://' + days[index].day.condition.icon +
            '" class="weathericon" />' +
        '<h2>' + weekDays[(new Date(days[index].date)).getDay()] + '</h2>';
      $day.append(weatherContent);
    });
}

function executeSearch() {
    $venueDivs.forEach(venue => venue.empty());
    $weatherDivs.forEach(day => day.empty());
    $destination.empty();
    $container.css("visibility", "visible");
    getForecast().then(forecast => renderForecast(forecast));
    return false;
}

$submit.click(executeSearch);

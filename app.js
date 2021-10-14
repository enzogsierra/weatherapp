let temp_unit = 0; // 0-°C, 1-°F
let weather_info = ""; 


//
document.addEventListener("DOMContentLoaded", () => // When document loads
{
    UpdateWeatherApp();
    //setInterval(() => { UpdateWeatherApp(); }, 60000); // Auto updater (every 1m)

    // Switch temperature unit
    document.querySelector(".temperature-info").addEventListener("click", function()
    {
        SwitchTemperatureUnit(temp_unit = !temp_unit);
    })

    // Search bar
    const input = document.querySelector(".search-bar");
    input.addEventListener("keyup", function(event) // By pressing ENTER
    {
        if(event.keyCode == 13) // Enter key 
        {
            UpdateWeatherApp(input.value);
        }
    });

    document.querySelector(".search-bar-icon").addEventListener("click", () => // By clicking SEARCH icon
    {
        if(input.value.trim() === "") return 0; 
        UpdateWeatherApp(input.value);
    });
});


function UpdateWeatherApp(query = "")
{
    if(navigator.geolocation) // If geolocation is available
    {
        navigator.geolocation.getCurrentPosition(location => // Get current position - its stored in "location"
        {
            let api = "";
            if(query === "") // If query is null, then call api by current location
            {
                const lat = location.coords.latitude;
                const lon = location.coords.longitude;
                api = `http://api.weatherstack.com/current?access_key=a6aac218e4dcfa9b3083d82cd98824fc&query=${lat},${lon}`;
            }
            else api = `http://api.weatherstack.com/current?access_key=a6aac218e4dcfa9b3083d82cd98824fc&query=${query}`;


            fetch(api) // Fetchs data (this takes a while)
                .then(response => // ".then" runs when there's a response from the fetching
                { 
                    return response.json(); // Converts to json format
                }) 
                .then(data => // When response is converted to json, then...
                {
                    // API fetch failed
                    if(data.success == false) 
                    {
                        alert(data.error.info);
                        return 1;
                    }

                    // Success
                    weather_info = data;
                    //console.log(weather_info);

                    const WAPP_name = document.querySelector(".location-name");
                    const WAPP_tempdesc = document.querySelector(".location-desc");
                    const WAPP_icon = document.querySelector(".temperature-icon");
                    const WAPP_windspeed = document.querySelector(".weather-windspeed");
                    const WAPP_humidity = document.querySelector(".weather-humidity");
                    const WAPP_visibility = document.querySelector(".weather-visibility");

                    // Main weather info
                    document.title = `WeatherApp - ${data.location.name}`; // Change navigator tab title
                    WAPP_name.textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`; // Show address name
                    WAPP_icon.src = data.current.weather_icons[0]; // Show weather icon
                    WAPP_tempdesc.textContent = data.current.weather_descriptions[0]; // Show weather description
                    SwitchTemperatureUnit(temp_unit);

                    // Misc weather info
                    WAPP_windspeed.textContent = `Wind: ${data.current.wind_speed}km/s`;
                    WAPP_humidity.textContent = `Humidity: ${data.current.humidity}%`;
                    WAPP_visibility.textContent = `Visibility: ${data.current.visibility}km`;
                }
            );
        });
    }
    else document.querySelector("h1").textContent = "An error has occurred! You might enable ubication";
}

function SwitchTemperatureUnit(unit = 0) // Show temperature and feelslike by the setted temperature unit
{
    if(unit == 0)
    {
        const temp = Math.floor(weather_info.current.temperature);
        const feelslike = Math.floor(weather_info.current.feelslike);
        document.querySelector(".temperature-info").innerHTML = `<h2>${temp} <span>°C</span></h2>`;
        document.querySelector(".weather-feelslike").textContent = `Feels like: ${feelslike} °C`;
    }
    else
    {
        const temp = Math.floor((weather_info.current.temperature + 32) * 1.8);
        const feelslike = Math.floor((weather_info.current.feelslike + 32) * 1.8);
        document.querySelector(".temperature-info").innerHTML = `<h2>${temp} <span>°F</span></h2>`;
        document.querySelector(".weather-feelslike").textContent = `Feels like: ${feelslike} °F`;
    }
}


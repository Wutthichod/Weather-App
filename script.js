const cityNameInput = document.querySelector(".cityNameInput");
const weatherForm = document.querySelector(".weatherForm");
const infoCard = document.querySelector("#yourInfoCard");
const majorCitySection = document.querySelector(".majorCitySection");
const errorElement = document.querySelector(".errorElement");
const apiKey = "f196b192bda0e972b051aa52f123b7bf";

let cardNo = 1;

async function defaultCityInfo(cityName) {
    const cityInfo = await fetchWeather(`${cityName}`);

    const infoCard = document.createElement("div");
    infoCard.classList.add("infoCard");
    infoCard.classList.add(`card${cardNo}`);
    infoCard.style.setProperty('--animation-delay', `${20 / 10 * (10 - cardNo) * -1 + 1}s`);
    cardNo += 1;
    const nameElement = document.createElement("div");
    const tempElement = document.createElement("div");
    const humidElement = document.createElement("div");
    const iconElement = document.createElement("div");
    infoCard.appendChild(nameElement);
    infoCard.appendChild(tempElement);
    infoCard.appendChild(humidElement);
    infoCard.appendChild(iconElement);

    displayWeatherInfo(cityInfo, infoCard);
    majorCitySection.appendChild(infoCard);
}

weatherForm.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    const cityName = validateCityName(cityNameInput);
    if (cityName) {
        try {
            const weatherInfo = await fetchWeather(cityName);
            displayWeatherInfo(weatherInfo, infoCard);
        } catch(error) {
            console.error(error);
            displayError("Please enter a valid city name");
        }
    } else {
        displayError("Please enter a city");
}
}

async function fetchWeather(cityName) {
    clearDisplay();
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Not Found");
    }
    const data = await response.json();
    console.log(data);
    return data;
}

function displayWeatherInfo(weatherInfo, cityCard) {
    cityCard.style.display = "block";
    cityCard.children[0].textContent = `${weatherInfo.name}`;
    cityCard.children[1].textContent = `${weatherInfo.main.temp} °C`;
    cityCard.children[2].textContent = `Hmd.: ${weatherInfo.main.humidity}%`;
    cityCard.children[3].textContent = getWeatherIcon(weatherInfo);
}

function displayError(message) {
    clearDisplay();
    errorElement.textContent = message;
    errorElement.style.display = "block";

}

function getWeatherIcon(weatherInfo) {
    const weatherId = weatherInfo.weather[0].id;
    switch(true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌦️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId == 800):
            return "☀️";
        case (weatherId >= 800 && weatherId < 810):
            return "🌥️";
    }
}

function clearDisplay() {
    errorElement.style.display = "none";
    infoCard.style.display = "none";
}

function validateCityName(cityNameInput) {
    const cityName = cityNameInput.value.trim().toLowerCase();
    for (let i = 0; i++; i < cityName.length) {
        if (cityName[i] === " ") {
            cityName.splice(i, 1, "+");
        }
    }
    return  cityName;
}

const defaultCities = ["bangkok", "london", "paris", "new york", "tokyo", "hong kong", "dubai", "munich", "miami", "moscow"];
defaultCities.forEach(city => defaultCityInfo(city));




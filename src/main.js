import { getWeatherByCity } from "./apiService.js";

const DOMElems = {};

const getDOMElems = (id) => {
  return document.getElementById(id);
};

const connectDOMElems = () => {
  DOMElems.mainContainer = getDOMElems("mainContainer");
  DOMElems.weatherSearchView = getDOMElems("weatherSearchView");
  DOMElems.weatherForecastView = getDOMElems("weatherForecastView");

  DOMElems.searchButton = getDOMElems("searchButton");
  DOMElems.returnToSearchBtn = getDOMElems("returnToSearchBtn");
  // dodac w html
  DOMElems.weatherCityContainer = getDOMElems("weatherCityContainer");

  DOMElems.searchInput = getDOMElems("searchInput");

  DOMElems.weatherCity = getDOMElems("weatherCity");
  DOMElems.weatherIcon = getDOMElems("weatherIcon");

  DOMElems.weatherCurrentTemp = getDOMElems("weatherCurrentTemp");
  DOMElems.weatherMaxTemp = getDOMElems("weatherMaxTemp");
  DOMElems.weatherMinTemp = getDOMElems("weatherMinTemp");
};

const setupListeners = () => {
  DOMElems.searchInput.addEventListener("keydown", onEnterSubmit);
  DOMElems.searchButton.addEventListener("click", onSubmit);
  DOMElems.returnToSearchBtn.addEventListener("click", returnToSearch);
};

const init = () => {
  connectDOMElems();
  setupListeners();
};

const onSubmit = () => {
  animateViewChange();

  let query = DOMElems.searchInput.value;

  getWeatherByCity(query).then((data) => {
    displayWeatherData(data);
    console.log(data);
  });
};

const onEnterSubmit = (e) => {
  if (e.key === "Enter") {
    animateViewChange();
    onSubmit();
  }
};

const displayWeatherData = (data) => {
  changeView();
  animateViewChange();

  const weather = data.consolidated_weather[0];
  DOMElems.weatherCity.textContent = data.title;
  DOMElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
  DOMElems.weatherIcon.alt = weather.weather_state_name;

  const currTemp = weather.the_temp.toFixed(2);
  const maxTemp = weather.max_temp.toFixed(2);
  const minTemp = weather.min_temp.toFixed(2);

  DOMElems.weatherCurrentTemp.textContent = `Current temperature: ${currTemp}`;
  DOMElems.weatherMaxTemp.textContent = `Max temp ${maxTemp}`;
  DOMElems.weatherMinTemp.textContent = `Min temp ${minTemp}`;
};

const animateViewChange = () => {
  if (
    DOMElems.mainContainer.style.opacity === "1" ||
    DOMElems.mainContainer.style.opacity === ""
  ) {
    DOMElems.mainContainer.style.opacity = "0";
  } else {
    DOMElems.mainContainer.style.opacity = "1";
  }
};

const changeView = () => {
  if (DOMElems.weatherSearchView.style.display !== "none") {
    DOMElems.weatherSearchView.style.display = "none";
    DOMElems.weatherForecastView.style.display = "block";
  } else {
    DOMElems.weatherSearchView.style.display = "flex";
    DOMElems.weatherForecastView.style.display = "none";
  }
};

const returnToSearch = () => {
  animateViewChange();

  setTimeout(() => {
    changeView();
    animateViewChange();
  }, 500);
};

document.addEventListener("DOMContentLoaded", init);

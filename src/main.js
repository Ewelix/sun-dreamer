const DOMElems = {};

const getDOMElems = (id) => {
  return document.getElementById(id);
};

const connectDOMElems = () => {
  DOMElems.mainConteiner = getDOMElems("mainConteiner");
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
  DOMElems.searchButton.addEventListener("click", onClickSubmit);
};

const init = () => {
  connectDOMElems();
  setupListeners();
};

const onEnterSubmit = () => {};
const onClickSubmit = () => {};

document.addEventListener("DOMContentLoaded", init);

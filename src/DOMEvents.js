const _getDOMElem = (id) => {
  return document.getElementById(id);
};

export const mapListToDOMElements = (listOfId) => {
  const _DOMElems = {};

  for (const id of listOfId) {
    _DOMElems[id] = _getDOMElem(id);
  }

  return _DOMElems;
};

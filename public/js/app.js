let beersData = [];
let url;

document.addEventListener('DOMContentLoaded', () => {
  url = 'https://api.punkapi.com/v2/beers';

  makeRequest(url, requestComplete);
});


const makeRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();

  request.addEventListener('load', callback);
}

const requestComplete = function () {
  if (this.status !== 200) {
    url = 'https://s3-eu-west-1.amazonaws.com/brewdogapi/beers.json';
    makeRequest (url, requestComplete);
  } else {
    const jsonString = this.responseText;
    beersData = JSON.parse(jsonString);
    createBeerDropdown();
  }
}

const createBeerDropdown = function () {
  const dropdownDiv = document.querySelector('#beer-list');
  const dropdown = document.createElement('select');
  dropdownDiv.appendChild(dropdown);

  for (const beer of beersData) {
    const option = document.createElement('option');
    option.textContent = beer.name;
    dropdown.appendChild(option);
  }
  dropdown.addEventListener('change', handleBeerChange);
}

const handleBeerChange = function (event) {
  const beerInfoDiv = document.querySelector('#beer-info');
  beerInfoDiv.innerHTML = '';
  const beerInfoList = document.createElement('ul');
  beerInfoDiv.appendChild(beerInfoList);

  const beerData = beersData.find((beer) => {
    return this.value === beer.name;
  });

  const beer = new Beer( beerData.name, beerData.image_url, beerData.ingredients);

  for (const variable in beer) {
    const li = document.createElement('li');
    if (variable === 'imageUrl') {
      const img = document.createElement('img');
      img.src = beer[variable];
      li.appendChild(img);
      beerInfoList.appendChild(li);
    } else if (variable !== "Beer Name" ) {
      const h4 = document.createElement('h4');
      h4.textContent = `${ variable }`
      beerInfoDiv.appendChild(h4);
      const ingredientUL = document.createElement('ul')
      beerInfoDiv.appendChild(ingredientUL);
      for (const ingredient in beer["Ingredients"]) {
        if (ingredient === "yeast") {
          const ingredientLI = document.createElement('li')
          ingredientLI.textContent = `${ ingredient }: ${beer["Ingredients"][ingredient]}`
          ingredientUL.appendChild(ingredientLI);
        } else {
          for (const item of beer["Ingredients"][ingredient]) {
            const ingredientLI = document.createElement('li')
            ingredientLI.textContent = `${ ingredient }: ${item.name}`
            ingredientUL.appendChild(ingredientLI);
          }
        }
      }
    } else {
      li.textContent = `${ variable }: ${ beer[variable] }`
      beerInfoList.appendChild(li);
    }
  }

}

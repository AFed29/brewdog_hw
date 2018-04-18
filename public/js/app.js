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
  } else{
    const jsonString = this.responseText;
    beersData = JSON.parse(jsonString);
    console.log(beersData);
  }
}

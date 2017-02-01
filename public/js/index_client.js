$(document).ready(function () {

  //Test Data
  var testElements = [
    {name: 'fun', category: 'Movie'},
    {name: 'funner', category: 'Book'},
    {name: 'not fun', category: 'Product'}
  ]


  //functions for getting and rendering elements
  var getElements = function (elements) {
    $.get(("/todo"), function (data, status) {
      console.log(data);
      renderElements(data);
    });
  };

  var createElement = function (element) {
    var newArticle = $('<article class="tweet"></article>');
    newArticle[0].innerHTML = `
    <article>
        <span>${element.name}</span> <span>${element.category}</span>
    </article>`
    return newArticle[0];
  };

  var renderElements = function (elements) {
    var todoContainer = $('#todoContainer');
    for (element in elements) {

      todoContainer.append(createElement(elements[element]));
    }
  };

  $('#todoButton').on('click', function () {
    getCategory($('#todoText').val());
  });

var getCategory = function (item) {
  var searchString = `https://www.googleapis.com/customsearch/v1?q=${item}&cx=009727429418526168478%3Agmz1zju4st8&num=10&key=AIzaSyBaDb1wlcW9WXDPpRzPanZr58lhtl1UnIo`;
  $.get((searchString), function (data, result) {
    let category = "";
    for (dataObj in data.items) {
      //console.log(data.items[dataObj].snippet);
      category = snippetScanner(data.items[dataObj].snippet);
      if (category !== "") {
        break;
      }
    }
    if (category === "") {category = "product"};
    console.log(category, "end")
  });


  var snippetScanner = function (snippet) {
    var dictionary =
      {
        restaurant: "restaurant",
        movie: "movie",
        film: "movie",
        book: "book",
        novel: "book"

      };

    var category = "";
    for (value in dictionary) {
      if (snippet.indexOf(dictionary[value]) !== -1) {
        category = dictionary[value];
        break;
      }
    }
    return category;
  }
}

  //initial page load
  getElements(testElements);
});
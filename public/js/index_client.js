$(document).ready(function () {

  var suggestedCategory = "";


  //functions for getting and rendering elements
  var getElements = function (render, callback) {
    return $.get(("/todo"), function (data, status) {
      if (render) {
        renderElements(data);
      } else {
        callback(data)
      }
    });
  };

  var createElement = function (element) {
    var newArticle = $('<article class="todo"></article>');
    newArticle[0].innerHTML = `
    <article>
        <span>${element.name}</span> <span>${element.category}</span>
    </article>`;
    return newArticle[0];
  };


  var renderElements = function (elements) {
    var todoContainer = $('#todoContainer');
    todoContainer[0].innerHTML = "";
    for (element in elements) {
      todoContainer.append(createElement(elements[element]));
    }
  };

  $('#todoButton').on('click', function () {
    getElements(false, getCategory);
    $(this).toggle();
    $('#todoText').attr('readonly' , true);
    $('#loadingSpinner').toggle();
  });


  $('#categoryButtons').on('click', 'button', function () {
    $('#todoText').attr('readonly', false);
    var category = this.id.replace('CategoryButton', "").replace('#', "");
    if (category === 'default') {
    }
    $.post("/todo", "category=" + category + "&name=" + $('#todoText').val()).complete(
      function () {
        getElements();
      })
    $('#categoryButtons').toggle();
    $('#todoButton').toggle();
    //todoContainer.append(createElement(elements[element]));
  });



  var getCategory = function (item) {
    item.forEach(function (dbItem) {
      if (dbItem.name === $('#todoText').val()) {
        console.log("matched")
        return ("matched");
      }
    });
    var searchString = `https://www.googleapis.com/customsearch/v1?q=${item}&cx=009727429418526168478%3Agmz1zju4st8&num=10&key=AIzaSyCaOxUoXD5hn9qge6ZAV-uzI2bWLry5Amc`;
    $.get((searchString), function (data) {
      let category = "";
      for (dataObj in data.items) {
        //console.log(data.items[dataObj].snippet);
        category = snippetScanner(data.items[dataObj].snippet);
        if (category !== "") {
          break;
        }
      }
      if (category === "") {
        category = "product"
      }
      ;
      $('#categoryButtons').toggle();
      $('#loadingSpinner').toggle();
      console.log(category, "google")
      return category;
    });


    var snippetScanner = function (snippet) {
      var dictionary =
        {
          restaurant: "restaurant",
          restaurant: "pizza",
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
  getElements(true);
});
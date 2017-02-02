$(document).ready(function () {

  var suggestedCategory = "";

  //autocomplete
  $.get(("/todo"), function (data) {
    console.log(data);
    var availableTags = data.map(function (item){
      return item.name;
    });
    console.log(availableTags);
    $( "#todoText" ).autocomplete({
      source: availableTags
    });
  });

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
    $('#todoText').attr('readonly', true);
    $('#loadingSpinner').toggle();
  });


  $('#categoryButtons').on('click', 'button', function () {
    console.log(suggestedCategory);
    $('#todoText').attr('readonly', false);
    var category = this.id.replace('CategoryButton', "").replace('#', "");
    if (category === 'default') {
    }
    $.post("/todo", "category=" + category + "&name=" + $('#todoText').val()).complete(
      function () {
        getElements(true);
      })
    $('#categoryButtons').toggle();
    $('#todoButton').toggle();
    //todoContainer.append(createElement(elements[element]));
  });


  var toggleSpinnerButtons = function (){
    $('#categoryButtons').toggle();
    $('#loadingSpinner').toggle();
  };


  var getCategory = function (item) {
    for (dbItem in item) {
      console.log(dbItem);
      if (item[dbItem].name === $('#todoText').val()) {
        toggleSpinnerButtons();
        suggestedCategory = item[dbItem].category;
        return
      }
    }
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
      console.log(category, "google")
      toggleSpinnerButtons();
     suggestedCategory = category;
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
          category = value;
          break;
        }
      }
      return category;
    }
  }

  //initial page load
  getElements(true);
});
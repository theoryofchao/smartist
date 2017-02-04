$(document).ready(function () {

  var suggestedCategory = "";

  //autocomplete
  $.get(("/todo/temp"), function (data) {
    ////console.log(data);
    var availableTags = data.map(function (item) {
      return item.search_term;
    });
    ////console.log(availableTags);
    $("#todoText").autocomplete({
      source: availableTags
    });
  });

  //functions for getting and rendering elements
  var getElements = function (render, callback) {
    return $.get(("/todo/temp/"), function (data, status) {
      if (render) {
        renderElements(data);
      } else {
        callback(data)
      }
    });
  };

  var getUserElements = function () {
    $.get("/todo/", function (data) {
      renderElements(data);
      console.log(2);
    });
  }


  var createElement = function (element) {
    //console.log(element);
    var newArticle = $('<article class="todo"></article>');
    newArticle[0].innerHTML = `
    <article id=${element.todo_id} data-search=${element.search_term} class="todoItem">
        <span>${element.search_term}</span> <span>${element.category}</span>        
    </article>`;
    return newArticle[0];
  };

  var createButtons = function (id, search) {
    var newButtonDiv = $('<div class="itemButtons" data-search=' + search + '  data-parentId=' + id + '></div>');
    newButtonDiv[0].innerHTML =
      `<button class="itemButton" data-category="book">Book</button>
    <button class="itemButton" data-category="movie">Movie</button>
    <button class="itemButton" data-category="restuarant">Restuarant</button>
    <button class="itemButton" data-category="product">Product</button>    
    <button class="itemButton" data-category="delete">X</button>`
    return newButtonDiv;
  };


  var renderElements = function (elements) {
    var todoContainer = $('#todoContainer');
    todoContainer[0].innerHTML = "";
    for (element in elements) {
      todoContainer.append(createElement(elements[element]));
    }
  };

  //delegate to creates item buttons
  $('#todoContainer').on('click', '.todoItem', function (ev) {
    ev.stopPropagation();
    //console.log($(this), "ok");
    var children = $(this).children('.itemButtons');
    //console.log(children[0]);
    //console.log (this.id)
    if (children[0] === undefined) {
      $(this).append(createButtons(this.id, this.dataset.search));
    } else {
      children.remove();
    }
  });

  //Update/delete Item buttons
  $('#todoContainer').on('click', '.itemButton', function (ev) {
    ev.stopPropagation();
    var par = $(this).parent()[0];
    if ($(this).data('category') === "delete") {
      $.post(('/todo/delete'), 'todo_id=' + par.dataset.parentid).done(getUserElements())
        .done(function (){getUserElements()});

    } else {
      console.log($(this).data('category'));
      $.post(('/todo/edit'),
        'category=' + $(this).data('category') + '&todo_id=' + par.dataset.parentid + '&search_term=' + par.dataset.search)
        .done(function () {getUserElements()});
    }
  });


  $('#todoButton').on('click', function () {
    getElements(false, getCategory);
    $(this).toggle();
    $('#todoText').attr('readonly', true);
    $('#loadingSpinner').toggle();
  });


  $('#categoryButtons').on('click', 'button', function () {
    //console.log(suggestedCategory);
    $('#todoText').attr('readonly', false);
    var category = this.id.replace('CategoryButton', "").replace('#', "");
    if (category === 'default') {
    }
    $.post("/todo", "category=" + category + "&search_term=" + $('#todoText').val()).complete(
      function () {
        getUserElements();
      })
    $('#categoryButtons').toggle();
    $('#todoButton').toggle();
    //todoContainer.append(createElement(elements[element]));
  });


  var toggleSpinnerButtons = function () {
    $('#categoryButtons').toggle();
    $('#loadingSpinner').toggle();
  };


  var getCategory = function (item) {
    for (dbItem in item) {
      ////console.log(dbItem);
      if (item[dbItem].search_term === $('#todoText').val()) {
        toggleSpinnerButtons();
        suggestedCategory = item[dbItem].category;
        return
      }
    }
    var searchString = `https://www.googleapis.com/customsearch/v1?q=${$('#todoText').val()}&cx=009727429418526168478%3Agmz1zju4st8&num=10&key=AIzaSyCaOxUoXD5hn9qge6ZAV-uzI2bWLry5Amc`;
    $.get((searchString), function (data) {
      let category = "";
      for (dataObj in data.items) {
        ////console.log(data.items[dataObj].snippet);
        category = snippetScanner(data.items[dataObj].snippet);
        if (category !== "") {
          break;
        }
      }
      if (category === "") {
        category = "product"
      }
      ////console.log(category, "google")
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
  };

  //initial page load
  //getElements(true);
  getUserElements();
});

  var clickedid=0;

$(window).scroll(function() {
  if ($(this).scrollTop() > 1){  
      $('header').addClass("sticky");
      $('main').addClass("sticky");
      $('#todo').addClass("sticky");
      $('.topBar').addClass("sticky");
    }
    else{
      $('header').removeClass("sticky");
      $('main').removeClass("sticky");
      $('#todo').removeClass("sticky");
      $('.topBar').removeClass("sticky");
    }
  });


var emptyMain = function () {
  $('main').empty();
}

var createRegistrationForm = function() {
  var registrationForm = '<form id="registrationForm"><input type="text" name="email" placeholder="Email"><input type="password" name="password" placeholder="Password"?><input type="submit" value="Submit"></form>';
  $('#modalMain').append(registrationForm);
  //bind event
  $('#registrationForm').submit(function(event) {
    event.preventDefault();
    var email = $('#registrationForm input[name="email"]').val();
    var password = $('#registrationForm input[name="password"]').val();

    $.post('users/registration', {email: email, password: password}, function(result) {
      console.log(result)
      $('#modalMain').empty();
      createLogoutButton();
      $('#myModal').hide();

    });
  });
};

var createLoginForm = function() {
  var registrationForm = '<form id="loginForm"><input type="text" name="email" placeholder="Email"><input type="password" name="password" placeholder="Password"?><input type="submit" value="Submit"></form>';
  $('#modalMain').append(registrationForm);
  //bind event
  $('#loginForm').submit(function(event) {
    event.preventDefault();
    var email = $('#loginForm input[name="email"]').val();
    var password = $('#loginForm input[name="password"]').val();

    $.post('users/login', {email: email, password: password}, function(result) {
      console.log(result)
      location.reload();
      //TODO: load up todos
    });
  });
};

var createRegistrationLoginButton = function () {
  var registrationLogin = '<button class="registerModalBtn">Register</button><button class="loginModalBtn">Login</button>';
  $('#modalMain').empty().append(registrationLogin);
};

var createLogoutButton = function () {
  var logout = '<button class="logoutModalBtn">Logout</button>';
  $('#modalMain').empty().append(logout);
};

var renderElements = function(elements) {
  var todoContainer = $('.todo_items');
  todoContainer.empty();
  console.log(elements);
  elements.forEach( (element) => {
  var todo = `<div id="todo${element.todo_id}" class="flex-item col-xs-4 col-md-3">
          <div  data-search=${element.search_term} class="todo_item">
            <div class="search">${element.search_term}</div>
            <div class="category">${element.category}</div>
            <div class="todo_content"></div>
          </div>
        </div>`;
    todoContainer.append(todo);
  });

  $('.flex-item').on('click', function(event) {
    var search = $(this).find('.search')[0].textContent;
    var category = $(this).find('.category')[0].textContent;
    console.log(search);
    console.log(category);
    var id = $(this).attr('id').replace('todo', '');
    $('#editModal #editModalMain').empty();
    $('#editModal #editModalMain').append(`<form id="editForm"><input type="text" name="search_item" value="${search}"><input type="text" name="category" value="${category}"><input type="submit" value="Submit"></form>`);
    $('#editModal #editModalMain').append(`<button id="deleteTodo">Delete</button>`);
    clickedid = id;
    console.log(clickedid);
    $('#editModal').show();
  });
};

  var createElement = function (element) {
    //console.log(element);
    var newArticle = $('<article class="todo"></article>');
    newArticle[0].innerHTML = `
    <article id=${element.todo_id} data-search=${element.search_term} class="todoItem">
        <span>${element.search_term}</span> <span>${element.category}</span>        
    </article>`;
    return newArticle[0];
  };


$(document).ready(function () {



  $('#userModalBtn').on('click', function() {
    $('#myModal').show();
  });

  $('#myModal span').on('click', function() {
    $('#myModal').hide();
  });

  $('#todoModal span').on('click', function() {
    $('#todoModal').hide();
  });

  $('#editModal span').on('click', function() {
    $('#editModal').hide();
  });


  $('#myModal .registerModalBtn').on('click', function() {
    $('#modalMain').empty();
    createRegistrationForm();
  });

  $('#myModal .loginModalBtn').on('click', function() {
    $('#modalMain').empty();
    createLoginForm();
  });

  //logout
  $(".logoutModalBtn").on('click', function () {
    deleteAllCookies();
    location.reload();
  });

  $('#todo form').submit(function(event) {
    event.preventDefault();
    //TODO: add in some sort of spinner
    var search_term = $('#todo form input[name="search_term"]').val();
    $('#todoModalMain #search-title').text(search_term);
    getElements(false, getCategory);


    /*$.post('users/registration', {email: email, password: password}, function(result) {
      console.log(result)
      $('#modalMain').empty();
      createLogoutButton();
      $('#myModal').hide();

    });*/
  });

  $('#todoButton').on('click', function () {
    getElements(false, getCategory);
    $(this).toggle();
    $('#todoText').attr('readonly', true);
    $('#loadingSpinner').toggle();
  });

  var suggestedCategory = "";

  var deleteAllCookies = function () {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }



  //autocomplete
  /*$.get(("/todo/temp"), function (data) {
    ////console.log(data);
    var availableTags = data.map(function (item) {
      return item.search_term;
    });
    ////console.log(availableTags);
    $("#todoText").autocomplete({
      source: availableTags
    });
  });*/

  //functions for getting and rendering elements
  var getElements = function (render, callback) {
    return $.get(("/todo/temp/"), function (data, status) {
      if (render) {
        console.log(data);
        console.log('render');
                renderElements(data);
      } else {
        callback(data);
      }
    });
  };

  var getUserElements = function () {
    $.get("/todo/", function (data) {
      console.log(data);
      renderElements(data);
    });
  }



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


  /*var renderElements = function (elements) {
    var todoContainer = $('main');
    todoContainer[0].innerHTML = "";
    for (element in elements) {
      todoContainer.append(createElement(elements[element]));
    }
  };*/

  //delegate to creates item buttons
  $('#todoContainer').on('click', '.todoItem', function (ev) {
    ev.stopPropagation();
    var children = $(this).children('.itemButtons');
    if (children[0] === undefined) {
      $(this).append(createButtons(this.id, this.dataset.search));
    } else {$('#todoModalMain #search-title').text(search_term);
      children.remove();
    }
  });

  //Update/delete Item buttons
  $('#editModalMain').on('click', '#deleteTodo', function (ev) {
    ev.stopPropagation();
    //var par = $(this).parent()[0];//par.dataset.parentid
      console.log(clickedid);
      $.post(('/todo/delete'), 'todo_id=' + clickedid).done(getUserElements())
        .done(function () {
          getUserElements();
          $('#editModal').hide();
        });

    /* else {
      console.log($(this).data('category'));
      $.post(('/todo/edit'),
        'category=' + $(this).data('category') + '&todo_id=' + clickedid + '&search_term=' + par.dataset.search)
        .done(function () {
          getUserElements()
        });
    }*/
  });

  $('#editModalMain').on('submit', '#editForm', function (event) {
    event.preventDefault();
      var newSearchName = $('#editForm input[name="search_item"]').val();
      var newCategory = $('#editForm input[name="category"]').val();
      console.log(newSearchName);
      console.log(newCategory);
    $.post(('/todo/edit'),
        'category=' + newCategory + '&todo_id=' + clickedid + '&search_term=' + newSearchName)
        .done(function () {
          getUserElements();
          $('#editModal').hide();
        });
    
    console.log(this);
  });


  //Select the category for a search
  $('#categoryButtons').on('click', 'button', function () {
    //$('#todoText').attr('readonly', false);
    var category = this.id.replace('CategoryButton', "");
    if (category !== 'cancel') {
      if (category === 'default') {
        category = suggestedCategory;
      }
      console.log(category);
      console.log($('#todo form input[name="search_term"]').val());
      $.post("/todo", "category=" + category + "&search_term=" + $('#todo form input[name="search_term"]').val()).complete(
        function () {
          location.reload();
          return;
          getUserElements();
        })
    }


    //$('.todo_items').empty();
    //TODO: repopulate the list

    //$('#categoryButtons').toggle();
    //$('#todoButton').toggle();
    //todoContainer.append(createElement(elements[element]));
  });


  var toggleSpinnerButtons = function () {
    $('#categoryButtons').toggle();
    $('#loadingSpinner').toggle();
  };


  var getCategory = function (item){
    for (dbItem in item) {
      if (item[dbItem].search_term === $('#todo form input[name="search_term"]').val()) {
        suggestedCategory = item[dbItem].category;
        $('#todoModalMain #search-category').text(suggestedCategory);
        $('#todoModal').show();
        return;
      }
    }
    var searchString = `https://www.googleapis.com/customsearch/v1?q=${$('#todo form input[name="search_term"]').val()}&cx=009727429418526168478%3Agmz1zju4st8&num=10&key=AIzaSyCaOxUoXD5hn9qge6ZAV-uzI2bWLry5Amc`;
    $.get((searchString), function (data) {
      let category = "";
      for (dataObj in data.items) {
        category = snippetScanner(data.items[dataObj].snippet);

        if (category !== "") {
          break;
        }
      }
      if (category === "") {
        category = "product";
      }
      suggestedCategory = category;
      $('#todoModalMain #search-category').text(suggestedCategory);
      $('#todoModal').show();
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
  //loginToggle();
  getUserElements();
});
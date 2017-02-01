$(document).ready(function (){

  //Test Data
  var testElements = [
    {name: 'fun', category: 'Movie'},
    {name: 'funner', category: 'Book'},
    {name: 'not fun', category: 'Product'}
  ]


  //functions for getting and rendering elements
  var getElements = function (elements) {
    renderElements(elements);
    /*$.get(("/todo"), function (data, status) {
      renderElements(data);
    });*/
  };

  var createElement = function (element) {
    let newArticle = $('<article class="tweet"></article>');
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
  //initial page load
  getElements(testElements);
});
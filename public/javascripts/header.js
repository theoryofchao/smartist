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

$(document).ready( () => {
  $('#userModalBtn').on('click', () => {
    $('#userModal').toggle();
  });

  $('#userModal span').on('click', () => {
    $('#userModal').hide();
  });
});
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function resetBoard() 
{
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function shuffle() {
  $("#game_grid .card").sort(() => Math.random() - 0.5).appendTo("#game_grid");
}


function setup () 
{
  shuffle();

  $(".card").on(("click"), function () 
  {
    if(lockBoard || $(this).hasClass("flip"))
    {
      return;
    }

    $(this).addClass("flip");

    if (!firstCard)
    {
      firstCard = this;
    }
    else 
    {
      secondCard = this;
      lockBoard = true;

      let img1 = $(firstCard).find(".front_face").attr("src");
      let img2 = $(secondCard).find(".front_face").attr("src");

      if (firstCard.src === secondCard.src) 
      {
        $(firstCard).off("click");
        $(secondCard).off("click");
        resetBoard();
      } 
      else
      {
        setTimeout(() => {
          $(firstCard).removeClass("flip");
          $(secondCard).removeClass("flip");
        }, 1000);
      }
    }
  });
}

$(document).ready(setup)
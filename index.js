let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pokemonPairs = 3;

let clickCount = 0;
let matchCount = 0;
let timer = null;
let timeRemaining = 60;

let powerUpUsed = false;

let currentPokemonImages = [];

function startGame()
{
  const selectedPairs = parseInt($("#difficulty").val());
  pokemonPairs = selectedPairs;
  fetchPokemonImages(pokemonPairs);
}

function resetGame()
{
  const selectedPairs = parseInt($("#difficulty").val());
  pokemonPairs = selectedPairs;
  fetchPokemonImages(pokemonPairs);
}


function resetBoard() 
{
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function toggleTheme()
{
  $("body").toggleClass("dark light");
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCard(src, id) 
{
  return `
    <div class="card" data-id="${id}">
      <div class="card_inner">
        <img class="front_face" src="${src}" alt=""></img>
        <img class="back_face" src="/back.webp" alt=""></img>
      </div>
    </div>
`}


function setupCards(images) 
{
  clickCount = 0;
  matchCount = 0;
  powerUpUsed = false;
  resetBoard();
  updateStatus();
  startTimer();

  $("#powerUpBtn").prop("disabled", false);

  const grid = $("#game_grid");
  grid.empty();

  const doubled = [...images, ...images];
  const shuffled = shuffleArray(doubled);

  shuffled.forEach((img, index) =>
  {
    grid.append(createCard(img.src, img.id));
  });

  $(".card").on("click", function ()
  {
    if (lockBoard || $(this).hasClass("flip"))
    {
      return;
    }

    clickCount++
    updateStatus();

    $(this).addClass("flip");

    if (!firstCard)
    {
      firstCard = this;
    }
    else
    {
      secondCard = this;
      lockBoard = true;

      const img1 = $(firstCard).find(".front_face").attr("src");
      const img2 = $(secondCard).find(".front_face").attr("src");

      if (img1 === img2)
      {
        $(firstCard).off("click");
        $(secondCard).off("click");

        matchCount++;
        updateStatus();

        if(matchCount == pokemonPairs)
        {
          clearInterval(timer);
          endGame(true);
        }

        resetBoard();
      }
      else
      {
        setTimeout(() =>
        {
          $(firstCard).removeClass("flip");
          $(secondCard).removeClass("flip");
          resetBoard();
        }, 1000);
      }
    }
  });
}

function fetchPokemonImages(pairCount = pokemonPairs)
{
  const maxId = 1025;
  const ids = shuffleArray([...Array(maxId).keys()].slice(1)).slice(0, pairCount);

  const requests = ids.map(id =>
  {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => ({
        id: data.id,
        src: data.sprites.other["official-artwork"].front_default
      }))
  });

  Promise.all(requests).then(setupCards);
}

function updateStatus()
{
  $("#clicks").text(`Clicks: ${clickCount}`);
  $("#matched").text(`Matched: ${matchCount}`);
  $("#remaining").text(`Remaining: ${pokemonPairs - matchCount}`);
  $("#total").text(`Total: ${pokemonPairs}`);
  $("#timer").text(`Clicks: ${timeRemaining} seconds`);
}

function startTimer()
{
  clearInterval(timer);
  timeRemaining = pokemonPairs * 10;
  updateStatus();

  timer = setInterval(() =>
  {
    timeRemaining--;
    updateStatus();

    if(timeRemaining <= 0)
    {
      clearInterval(timer);
      endGame(false);
    }
  }, 1000);
}

function activatePowerUp()
{
  if (powerUpUsed)
  {
    return;
  }

  powerUpUsed = true;
  $("#powerUpBtn").prop("disabled", true);

  const unmatchedCards = $(".card").filter(function ()
  {
    const hasClick = !!$._data(this, "events")?.click;
    const isFaceDown = !$(this).hasClass("flip");
    return (hasClick && isFaceDown);
  });


  unmatchedCards.addClass("flip");


  setTimeout(() =>
  {
    unmatchedCards.removeClass("flip");
    resetBoard();
  }, 1500);
}

function endGame(won)
{
  $(".card").off("click");

  if(won)
  {
    alert("You Won!");
  }
  else
  {
    alert("You Lose!")
  }
}

$(document).ready(() =>
{
  $("#startBtn").on("click", startGame);
  $("#resetBtn").on("click", resetGame);
  $("#powerUpBtn").on("click", activatePowerUp);
  $("#themeToggle").on("click", toggleTheme);

  $("body").addClass("light");
  
  startGame();
});
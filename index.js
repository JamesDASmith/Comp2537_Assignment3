let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pokemonPairs = 3;

function resetBoard() 
{
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
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

$(document).ready(() =>
{
  fetchPokemonImages(pokemonPairs);
});
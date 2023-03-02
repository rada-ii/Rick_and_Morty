const characterCardsContainer = document.getElementById('character-cards');
const characterDetailsContainer = document.getElementById('character-details');
const paginationContainer = document.getElementById('pagination');

let currentPage = 1;
let charactersPerPage = 20;
let characters = [];

const renderError = function (msg) {
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('col-md-12', 'text-center', 'mt-5');
  errorDiv.innerHTML = `<h4>${msg}</h4>`;
  characterCardsContainer.appendChild(errorDiv);
};

const renderCharacterDetails = function (character) {
  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add(
    'card',
    'w-50',
    'position-absolute',
    'top-100',
    'start-50',
    'translate-middle',
    'p-1',
    'text-center',
    'mt-5'
  );
  detailsDiv.innerHTML = `
    <h4>${character.name}</h4>
    <img src="${character.image}" alt="${character.name} image">
    <p>Status: ${character.status}</p>
    <p>Species: ${character.species}</p>  
    <p>Gender: ${character.gender}</p>
    <p>Origin: ${character.origin.name}</p>
    <p>Location: ${character.location.name}</p>
    <div><button class="btn btn-primary mt-3 reload" onclick="location.reload()">Reload</button></div>
   
  `;
  characterDetailsContainer.innerHTML = '';
  characterDetailsContainer.appendChild(detailsDiv);
};

const renderCharacters = function (charactersToRender) {
  characterCardsContainer.innerHTML = '';
  charactersToRender.forEach(character => {
    const card = document.createElement('div');
    card.classList.add(
      'col-xl-3',
      'col-lg-4',
      'col-md-6',
      'p-2',
      'd-flex',
      'justify-content-center',
      'mb-4'
    );

    card.innerHTML = `
      <div class="card" data-id="${character.id}">
        <img class="card-img-top" src="${character.image}" alt="${character.name} image">
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
          <button class="btn btn-primary">Like</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      characterCardsContainer.classList.add('fade');
      setTimeout(() => {
        renderCharacterDetails(character);
        characterDetailsContainer.classList.remove('hidden');
      }, 300);
      window.scrollTo(150, 150);
    });

    characterCardsContainer.appendChild(card);
  });
};

const setupPagination = function (characters) {
  paginationContainer.innerHTML = '';

  let pageCount = Math.ceil(characters.length / charactersPerPage);
  let currentPageIndex = currentPage - 1;

  let startPageIndex = currentPageIndex - 2;
  if (startPageIndex < 0) {
    startPageIndex = 0;
  }

  let endPageIndex = startPageIndex + 4;
  if (endPageIndex >= pageCount) {
    endPageIndex = pageCount - 1;
    startPageIndex = endPageIndex - 4;
    if (startPageIndex < 0) {
      startPageIndex = 0;
    }
  }

  let prevButton = document.createElement('button');
  prevButton.classList.add('btn', 'btn-secondary', 'btn-previous', 'mx-1');
  prevButton.innerText = '<<';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    currentPage--;
    renderCharacters(getCharactersToDisplay());
    setupPagination(characters);
  });
  paginationContainer.appendChild(prevButton);

  for (let i = startPageIndex; i <= endPageIndex; i++) {
    let button = document.createElement('button');
    button.classList.add('btn', 'btn-secondary', 'mx-1');
    button.innerText = i + 1;

    if (currentPage === i + 1) {
      button.classList.add('current-page');
    }

    button.addEventListener('click', () => {
      currentPage = i + 1;
      renderCharacters(getCharactersToDisplay());
      setupPagination(characters);
    });
    paginationContainer.appendChild(button);
  }

  let nextButton = document.createElement('button');
  nextButton.classList.add('btn', 'btn-secondary', 'btn-next', 'mx-1');
  nextButton.innerText = '>>';
  nextButton.disabled = currentPage === pageCount;
  nextButton.addEventListener('click', () => {
    currentPage++;
    renderCharacters(getCharactersToDisplay());
    setupPagination(characters);
  });
  paginationContainer.appendChild(nextButton);
};

const getCharactersToDisplay = function () {
  let startIndex = (currentPage - 1) * charactersPerPage;
  let endIndex = startIndex + charactersPerPage;

  return characters.slice(startIndex, endIndex);
};

const fetchAllCharacters = async function () {
  try {
    let allCharacters = [];
    let page = 1;

    while (true) {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );

      if (!response.ok)
        throw new Error(`Problem with getting data ${response.status}`);

      const data = await response.json();
      allCharacters = allCharacters.concat(data.results);

      if (data.info.next === null) {
        break;
      } else {
        page++;
      }
    }

    characters = allCharacters;
    setupPagination(characters);
    renderCharacters(getCharactersToDisplay());
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
  }
};

fetchAllCharacters();

window.addEventListener('scroll', function () {
  var scrollTopBtn = document.getElementById('scroll-to-top');
  var scrollBottomBtn = document.getElementById('scroll-to-bottom');

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    scrollBottomBtn.style.display = 'none';
  } else {
    scrollBottomBtn.style.display = 'block';
  }
});

function scrollToTop() {
  window.scrollTo({ top: 100, behavior: 'smooth' });
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

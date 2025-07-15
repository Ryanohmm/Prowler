let allCharacters = [];

async function fetchCharacters() {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:3000/characters');
    const data = await response.json();
    allCharacters = data.data.results;
    renderCharacters(allCharacters);
  } catch (error) {
    console.error('❌ Failed to fetch characters:', error);
  } finally {
    spinner.classList.add('hidden');
  }
}

function renderCharacters(characters) {
  const container = document.getElementById('character-container');
  container.innerHTML = '';

  const hoverSound = document.getElementById('hover-sound');

  characters.forEach(character => {
    const card = document.createElement('div');
    card.className = 'character-card';

    const imgSrc = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    card.innerHTML = `
      <img src="${imgSrc}" alt="${character.name}">
      <h3>${character.name}</h3>
    `;

    card.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });

    container.appendChild(card);
  });
}

document.getElementById('search-bar').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allCharacters.filter(char =>
    char.name.toLowerCase().includes(query)
  );
  renderCharacters(filtered);
});

document.addEventListener('DOMContentLoaded', fetchCharacters);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchbar");
  const searchButton = document.querySelector("button[type='submit']");
  const resetButton = document.querySelector("button[type='reset']");
  const resultsList = document.querySelector(".results ol");

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    try {
      const response = await fetch("http://localhost:3000/characters");
      const data = await response.json();
      const characters = data.data.results;

      const filtered = characters.filter(character =>
        character.name.toLowerCase().includes(query)
      );

      resultsList.innerHTML = "";

      if (filtered.length === 0) {
        resultsList.innerHTML = "<li>No results found.</li>";
      } else {
        filtered.forEach(character => {
          const li = document.createElement("li");
          li.textContent = character.name;
          resultsList.appendChild(li);
        });
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      resultsList.innerHTML = "<li>Error fetching results.</li>";
    }
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    resultsList.innerHTML = "<li>Results</li><li>Results</li><li>Results</li><li>Results</li><li>Results</li>";
  });
});

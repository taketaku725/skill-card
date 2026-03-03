let currentGame = "casino";
let inputBuffer = "";
let skillData = {};
let ownedCards = new Set();

const display = document.getElementById("display");
const hand = document.getElementById("hand");
const toast = document.getElementById("toast");

fetch("skills.json")
  .then(res => res.json())
  .then(data => {
    skillData = data;
  });

document.querySelectorAll(".num").forEach(btn => {
  btn.addEventListener("click", () => {
    inputBuffer += btn.textContent;
    display.textContent = inputBuffer;
  });
});

document.getElementById("clear").onclick = () => {
  inputBuffer = "";
  display.textContent = "--";
};

document.getElementById("add").onclick = () => {
  if (!inputBuffer) return;

  if (!skillData.cards[inputBuffer]) {
    showToast("存在しない番号です");
    inputBuffer = "";
    display.textContent = "--";
    return;
  }

  if (ownedCards.has(inputBuffer)) {
    showToast("既に持っています");
    inputBuffer = "";
    display.textContent = "--";
    return;
  }

  addCard(inputBuffer);
  ownedCards.add(inputBuffer);

  inputBuffer = "";
  display.textContent = "--";
};

function addCard(id) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = id;

  card.innerHTML = `
    <button class="remove-btn">×</button>
    <h3>${skillData.cards[id].name}</h3>
  `;

  card.querySelector(".remove-btn").onclick = (e) => {
    e.stopPropagation();
    ownedCards.delete(id);
    card.remove();
  };

  card.onclick = () => {
    document.getElementById("popupTitle").textContent =
      skillData.cards[id].name;

    document.getElementById("popupEffect").textContent =
      skillData.effects[currentGame][id] || "効果未設定";

    document.getElementById("popup").classList.remove("hidden");
  };

  hand.appendChild(card);
}

document.getElementById("closePopup").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

document.querySelectorAll(".game-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".game-btn")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentGame = btn.dataset.game;
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

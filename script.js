let currentGame = "casino";
let inputBuffer = "";

const skillData = {
  casino: {
    "1": { name: "ダブルベット", effect: "次の賭け金を2倍にできる。" },
    "2": { name: "イカサマ", effect: "一度だけ出目を変更できる。" }
  },
  sugoroku: {
    "1": { name: "ダッシュ", effect: "サイコロをもう一度振れる。" },
    "2": { name: "ワープ", effect: "好きなマスに移動できる。" }
  }
};

const display = document.getElementById("display");
const hand = document.getElementById("hand");

document.querySelectorAll(".num").forEach(btn => {
  btn.addEventListener("click", () => {
    inputBuffer += btn.textContent;
    display.textContent = inputBuffer;
  });
});

document.getElementById("clear").addEventListener("click", () => {
  inputBuffer = "";
  display.textContent = "--";
});

document.getElementById("add").addEventListener("click", () => {
  if (!inputBuffer) return;
  const skill = skillData[currentGame][inputBuffer];
  if (!skill) {
    alert("存在しない番号です");
    return;
  }
  addCard(inputBuffer, skill);
  inputBuffer = "";
  display.textContent = "--";
});

function addCard(id, skill) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <button class="remove-btn">×</button>
    <h3>${skill.name}</h3>
  `;

  card.querySelector(".remove-btn").onclick = () => card.remove();

  card.onclick = (e) => {
    if (e.target.classList.contains("remove-btn")) return;
    document.getElementById("popupTitle").textContent = skill.name;
    document.getElementById("popupEffect").textContent = skill.effect;
    document.getElementById("popup").classList.remove("hidden");
  };

  hand.appendChild(card);
}

document.getElementById("closePopup").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

document.querySelectorAll(".game-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".game-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentGame = btn.dataset.game;
    hand.innerHTML = "";
  });
});

let currentGame = "casino";
let inputBuffer = "";
let skillData = {};
let ownedCards = new Set();

const display = document.getElementById("display");
const hand = document.getElementById("hand");
const toast = document.getElementById("toast");

const glossaryData = {
  casino: `
  <p>先：ダイスを振る前に使用可能</p>
  <p>後：ダイスを振った後使用可能</p>
  <p>常：どのタイミングでも使用可能</p>
  <p>自：自ターン時どのタイミングでも使用可能</p>
  <p>貫：いかなる回避も貫通する攻撃</p>
  <p>御：条件下でいかなる攻撃も防げる</p>
  <p>反：特定の条件下で攻撃を反射する</p>
  <p>硬：硬質化、カード使用時チップを1枚得る<br/>　　硬質化が解かれた場合カードが消滅<br/></p>
  <p>空間：飲み部屋を指す</p>
  <p>場：ゲームプレイしている場所を指す</p>
  <p>スキルカード：ゲームを有利に進められるカード<br/>※所持上限3枚</p>
  <p>サポートコイン：スキルカードの能力や進化を促すチップ<br/>※所持上限5枚</p>
  `,
  sugoroku: `
  <p>先：ダイスを振る前に使用可能</p>
  <p>後：ダイスを振った後使用可能</p>
  <p>常：どのタイミングでも使用可能</p>
  <p>自：自ターン時どのタイミングでも使用可能</p>
  <p>貫：いかなる回避も貫通する攻撃</p>
  <p>御：死マス(赤文字マス)を防げる</p>
  <p>反：特定の条件下で攻撃を反射する</p>
  <p>硬：硬質化、カード使用時チップを1枚得る<br/>　　硬質化が解かれた場合カードが消滅<br/></p>
  <p>空間：飲み部屋を指す</p>
  <p>場：ゲームプレイしている場所を指す</p>
  <p>スキルカード：ゲームを有利に進められるカード<br/>※所持上限3枚</p>
  <p>サポートコイン：スキルカードの能力や進化を促すチップ<br/>※所持上限5枚</p>
  `
};

fetch("skills.json")
  .then(res => res.json())
  .then(data => {
    skillData = data;
  });

updateGlossary();

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
    document.body.classList.add("modal-open");
  };

  hand.appendChild(card);
}

document.getElementById("closePopup").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
  document.body.classList.remove("modal-open");
};

document.querySelectorAll(".game-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".game-btn")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentGame = btn.dataset.game;

    updateGlossary();
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

function updateGlossary() {
  document.getElementById("glossaryContent").innerHTML =
    glossaryData[currentGame];
}

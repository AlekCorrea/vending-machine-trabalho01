const PRICE = 30;
let amount = 0, state = 0, history = [], selectedProduct = null;

const amountEl = document.getElementById("amount");
const stateEl = document.getElementById("state");
const messageEl = document.getElementById("message");
const transitionEl = document.getElementById("transition");
const transitionTextEl = document.getElementById("transitionText");
const historyEl = document.getElementById("history");
const buyButton = document.getElementById("buy");
const productButtons = document.querySelectorAll(".product");
const coinButtons = document.querySelectorAll(".coins button");

function money(c){
  return `R$ ${(c/100).toFixed(2).replace(".",",")}`;
}

function stateName(v){
  return v >= PRICE ? "q30" : `q${v}`;
}

function statusMessage(){
  if(amount < PRICE) return `Faltam ${money(PRICE - amount)} para liberar a escolha do produto.`;
  if(!selectedProduct) return "Valor suficiente! Escolha um produto (moedas extras ficam em q30 → q30).";
  return "Pronto para retirar o produto.";
}

function update(){
  amountEl.textContent = money(amount);
  stateEl.textContent = `Estado atual: ${stateName(state)}`;
  const funded = amount >= PRICE;
  productButtons.forEach(b => b.disabled = !funded);
  buyButton.disabled = !funded || !selectedProduct;
  messageEl.textContent = statusMessage();
}

function addHistory(t){
  history.push(t);
  historyEl.innerHTML = history.map(x => `<li>${x}</li>`).join("");
}

function selectProduct(btn){
  if(btn.disabled) return;
  selectedProduct = btn.dataset.product;
  productButtons.forEach(b => b.classList.toggle("selected", b === btn));
  update();
}

function insertCoin(coin){
  const old = stateName(state);
  amount += coin;
  state = Math.min(amount, PRICE);
  const next = stateName(state);
  transitionEl.textContent = `${old} → ${next}`;
  transitionTextEl.textContent = `Moeda inserida: ${coin}¢ | Valor acumulado: ${money(amount)}`;
  addHistory(`${coin}¢: ${old} → ${next}`);
  update();
}

function buy(){
  if(amount < PRICE || !selectedProduct) return;
  const change = amount - PRICE;
  messageEl.textContent = change > 0
    ? `${selectedProduct} liberado! Troco: ${money(change)}`
    : `${selectedProduct} liberado! Sem troco.`;
  coinButtons.forEach(b => b.disabled = true);
  productButtons.forEach(b => b.disabled = true);
  buyButton.disabled = true;
}

function reset(){
  amount = 0;
  state = 0;
  history = [];
  selectedProduct = null;
  transitionEl.textContent = "q0";
  transitionTextEl.textContent = "Nenhuma transição realizada.";
  historyEl.innerHTML = "";
  productButtons.forEach(b => { b.disabled = false; b.classList.remove("selected"); });
  coinButtons.forEach(b => b.disabled = false);
  update();
}

productButtons.forEach(b => b.addEventListener("click", () => selectProduct(b)));
coinButtons.forEach(b => b.addEventListener("click", () => insertCoin(Number(b.dataset.coin))));
buyButton.addEventListener("click", buy);
document.getElementById("reset").addEventListener("click", reset);

update();

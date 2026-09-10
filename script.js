const stateValues=[0,5,10,15,20,25,30];
let current=0, selected=null, history=[], sequence=[];

const automaton=document.getElementById("automaton");
const amount=document.getElementById("amount");
const message=document.getElementById("message");
const stateBadge=document.getElementById("stateBadge");
const lastTransition=document.getElementById("lastTransition");
const sequenceEl=document.getElementById("sequence");
const totalEl=document.getElementById("total");
const historyEl=document.getElementById("history");
const takeProduct=document.getElementById("takeProduct");
const dispenserContent=document.getElementById("dispenserContent");

function money(c){return `R$ ${(c/100).toFixed(2).replace(".",",")}`;}
function nextState(value,coin){return Math.min(30,value+coin);}

function drawAutomaton(){
  automaton.innerHTML="";
  stateValues.forEach((s,i)=>{
    const wrap=document.createElement("div");
    wrap.className="state-wrap";
    const node=document.createElement("div");
    node.className="state"+(s===current?" active":"")+(s===30?" final":"");
    node.textContent=s===30?"30+":s;
    if(s===30){
      const label=document.createElement("div");
      label.className="state-label";
      label.textContent="ESTADO FINAL";
      node.appendChild(label);
    }
    wrap.appendChild(node);
    if(i<stateValues.length-1){
      const arrow=document.createElement("div");
      arrow.className="arrow";
      arrow.textContent="→";
      wrap.appendChild(arrow);
    }
    automaton.appendChild(wrap);
  });
}

function render(){
  amount.textContent=money(current);
  sequenceEl.textContent=sequence.length?sequence.join("  "):"—";
  totalEl.textContent=`Valor total: ${current} centavos`;

  if(current>=30){
    message.textContent=selected?`✓ VALOR SUFICIENTE! ${selected.toUpperCase()} PRONTO.`:"✓ VALOR SUFICIENTE! ESCOLHA UM PRODUTO.";
    message.style.borderColor="#25ff73";
    message.style.color="#25ff73";
  }else{
    message.textContent=`✦ FALTAM ${30-current} CENTAVOS ✦`;
    message.style.borderColor="#19c8ff";
    message.style.color="#19c8ff";
  }

  takeProduct.disabled=!(current>=30 && selected);

  historyEl.innerHTML=history.length
    ? history.map((h,i)=>`<div class="history-item">${i+1}. (${h.from}) — <b>${h.coin}¢</b> → (${h.to})</div>`).join("")
    : `<div class="empty">Nenhuma moeda inserida.</div>`;

  document.querySelectorAll(".product").forEach(btn=>{
    btn.classList.toggle("selected",btn.dataset.product===selected);
  });
  drawAutomaton();
}

document.querySelectorAll(".product").forEach(btn=>{
  btn.addEventListener("click",()=>{
    selected=btn.dataset.product;
    render();
  });
});

document.querySelectorAll(".coin-button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const coin=Number(btn.dataset.coin);
    const from=current;
    const to=nextState(current,coin);
    current=to;
    sequence.push(coin);
    history.push({from,coin,to});
    lastTransition.textContent=`(${from}) — ${coin}¢ → (${to>=30?"30+":to})`;
    render();
  });
});

takeProduct.addEventListener("click",()=>{
  if(current<30 || !selected)return;
  dispenserContent.textContent=selected==="Refrigerante"?"🥤":selected==="Chocolate"?"🍫":"🍪";
  message.textContent=`★ ${selected.toUpperCase()} LIBERADO! ★`;
  takeProduct.disabled=true;
});

document.getElementById("reset").addEventListener("click",()=>{
  current=0;selected=null;history=[];sequence=[];
  lastTransition.textContent="—";
  dispenserContent.textContent="▰";
  render();
});

render();

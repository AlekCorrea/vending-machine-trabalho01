# 🕹️ Vending Machine — Arcade

Interface web inspirada em uma máquina de arcade, desenvolvida para o **Trabalho 01** da disciplina de Linguagens Formais e Autômatos. O projeto modela e implementa um **Autômato Finito Determinístico (AFD)** que simula o funcionamento de uma máquina de vendas.

🔗 **Teste online:** `https://alekcorrea.github.io/vending-machine-trabalho01/`

---
## 👥 Autores

- `Alessandra Corrêa`

Disciplina: Linguagens Formais e Autômatos — Trabalho 01
---

## 📋 Enunciado do problema

Modelar uma vending machine que:
- Aceita moedas de **5, 10 e 25 centavos**;
- Vende um produto de **30 centavos**;
- Parte do **estado inicial (0)**;
- Reconhece sequências de moedas que levem a um **estado final** (valor inserido ≥ 30 centavos).

---

## 🔢 Modelagem formal do AFD

O autômato foi modelado como uma **5-upla** `(Q, Σ, δ, q0, F)`:

### Conjunto de estados (Q)
Cada estado representa o valor total, em centavos, já inserido na máquina:

```
Q = { 0, 5, 10, 15, 20, 25, 30 }
```

O estado `30` funciona como um **estado absorvente**: qualquer valor igual ou superior a 30 centavos é representado por ele (ex: inserir mais moedas depois de já ter 30+ centavos mantém a máquina no mesmo estado). Isso evita a necessidade de criar estados para 35, 40, 45... centavos, já que — assim como no artigo de referência da disciplina, que limita seus estados em 55 centavos — o que importa para a máquina é **"tenho o suficiente ou não"**, e não o valor exato acumulado além do preço do produto.

### Alfabeto de entrada (Σ)
```
Σ = { 5, 10, 25 }
```
Cada símbolo representa a inserção de uma moeda daquele valor (em centavos).

### Estado inicial (q0)
```
q0 = 0
```

### Estados finais (F)
```
F = { 30 }
```
Representa "valor acumulado ≥ 30 centavos", ou seja, crédito suficiente para liberar o produto.

### Função de transição (δ)

A função `δ: Q × Σ → Q` é **total e determinística** — para todo par (estado, moeda) existe exatamente um próximo estado definido:

| Estado | 5¢  | 10¢ | 25¢ |
|--------|-----|-----|-----|
| 0      | 5   | 10  | 25  |
| 5      | 10  | 15  | 30  |
| 10     | 15  | 20  | 30  |
| 15     | 20  | 25  | 30  |
| 20     | 25  | 30  | 30  |
| 25     | 30  | 30  | 30  |
| **30** | 30  | 30  | 30  |

Essa tabela é exatamente o que o `script.js` calcula — veja a seção **"Como o AFD foi implementado"** abaixo.

---

## ⚙️ Como o AFD foi implementado

**Nenhuma biblioteca externa de autômatos foi utilizada** (nem `automata-lib`, nem `AutomataLib`, nem `Finite Automata` do JS, etc). Todo o comportamento do autômato foi implementado manualmente em JavaScript puro, sem dependências.

A abordagem escolhida foi a de **função matemática**, em vez da forma mais tradicional de tabela explícita (dicionário/matriz) ou de uma cadeia de `if/switch`. As três formas são logicamente equivalentes — a diferença está apenas em como o resultado da transição é calculado:

```js
const stateValues = [0, 5, 10, 15, 20, 25, 30];

function nextState(value, coin) {
  return Math.min(30, value + coin);
}
```

- `value` é o estado atual (quantidade em centavos já inserida);
- `coin` é o símbolo de entrada (5, 10 ou 25);
- `Math.min(30, value + coin)` calcula o próximo estado: soma o valor da moeda e "trava" o resultado em 30 caso ultrapasse esse limite — isso implementa exatamente a tabela de transições mostrada acima, incluindo o comportamento absorvente do estado final.

Essa é uma alternativa válida às três formas apresentadas em aula (tabela, if/switch, orientação a objetos): como os estados são numéricos e igualmente espaçados (múltiplos de 5), a transição pôde ser expressa como uma fórmula fechada, o que a torna tão "elegante e escalável" quanto uma tabela — bastaria mudar o preço do produto (a constante `30`) para reescalar todo o autômato, sem precisar reescrever transições.

A cada clique em uma moeda:

```js
document.querySelectorAll(".coin-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const coin = Number(btn.dataset.coin);
    const from = current;
    const to = nextState(current, coin);   // aplica δ(estado, símbolo)
    current = to;                           // atualiza o estado atual
    sequence.push(coin);                    // guarda o símbolo consumido
    history.push({ from, coin, to });       // guarda a transição ocorrida
    render();
  });
});
```

O aceite (chegar a um estado final) é verificado simplesmente por:

```js
if (current >= 30) { /* estado final: libera a escolha do produto */ }
```

### Por que um AFD simples, e não uma Máquina de Mealy?

O artigo de referência da disciplina usa uma **Máquina de Mealy**, pois a máquina real described lá precisa registrar informações na fita de saída (valor do troco e produto escolhido dentro da categoria). Neste trabalho, o enunciado pede apenas o **reconhecimento de sequências que levem a um estado final** (crédito ≥ 30 centavos) — não há troco nem categorias de produto a serem codificadas na transição. Por isso, um **AFD comum** (sem saída associada às transições) é suficiente e mais simples, atendendo exatamente ao que foi pedido.

---

## 🖥️ Interface e visualização das transições

Para tornar visíveis as transições do autômato conforme o professor pediu ("como ver as transições de estado ocorrendo?"), a interface (`index.html` + `style.css`) exibe, em tempo real:

- O **diagrama de estados** (`#automaton`), destacando visualmente:
  - o estado atual (classe `.active`, com brilho verde);
  - o estado final `30+` (classe `.final`, com borda diferenciada);
- A **última transição realizada**, no formato `(origem) — moeda¢ → (destino)`;
- A **sequência completa de moedas** já inserida na rodada atual;
- Um **histórico detalhado** de todas as transições da sessão;
- O **crédito atual** em reais (R$);
- Os **produtos** disponíveis (Refrigerante, Chocolate, Biscoito), que só podem ser retirados quando o estado final é atingido.

O botão **"Reiniciar"** zera o autômato de volta ao estado inicial `0`.

---

## 📂 Estrutura de arquivos

```
├── index.html              # estrutura da interface (autômato + máquina)
├── style.css                # tema visual "arcade dark kawaii"
├── script.js                 # implementação do AFD e lógica da interface
└── README.md                 # este arquivo
```

> **Observação:** o arquivo `vending-machine.jff` contém o mesmo autômato descrito na seção "Modelagem formal do AFD" (7 estados, alfabeto {5, 10, 25}, estado inicial 0, estado final 30), construído e validado na ferramenta **JFlap** antes de ser implementado em código.

---

## ✅ Casos de teste

| Sequência de moedas       | Valor final | Resultado esperado         |
|----------------------------|-------------|------------------------------|
| 5, 5, 5, 5, 5, 5            | 30¢         | ✅ Aceita — libera o produto |
| 25, 5                       | 30¢         | ✅ Aceita — libera o produto |
| 10, 10, 10                  | 30¢         | ✅ Aceita — libera o produto |
| 25, 25                      | 30¢ (50→30) | ✅ Aceita — libera o produto |
| 5, 5, 5, 5, 5                | 25¢         | ❌ Rejeita — não libera o produto |

---

## ▶️ Como testar

**Online:** acesse `https://alekcorrea.github.io/vending-machine-trabalho01/` — não é necessário instalar nada.

**Localmente:**
1. Abra o arquivo `index.html` em qualquer navegador.
---
**No JFlap:**


<img width="679" height="718" alt="{59706459-A19E-4D95-B851-7B24E0F880DE}" src="https://github.com/user-attachments/assets/5d3860be-ec73-4940-bbbd-4a613aafd46e" />



# Vending Machine — Arcade

Interface web inspirada em uma máquina de arcade para o Trabalho 01 de Linguagens Formais e Autômatos.

## Regras

- Estado inicial: 0
- Moedas: 5, 10 e 25 centavos
- Produto: 30 centavos
- Estado final: 30+, representando valor acumulado maior ou igual a 30 centavos
- A interface mostra a transição do autômato a cada moeda.

## Arquivos

- `index.html` — interface
- `style.css` — tema arcade
- `script.js` — lógica da máquina e do autômato

## Testes

## Autômato desenvolvido no JFLAP

Abaixo está a representação do autômato finito utilizado para modelar a máquina de vendas:

![Autômato desenvolvido no JFLAP](jflap.png)

- 5 5 5 5 5 5 → 30¢ → aceita
- 25 5 → 30¢ → aceita
- 10 10 10 → 30¢ → aceita
- 5 5 5 5 5 → 25¢ → não libera o produto

Abra `index.html` no navegador para testar.

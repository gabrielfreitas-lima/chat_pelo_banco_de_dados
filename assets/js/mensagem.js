/* variaveris que recebem os elementos HTML*/
var select = document.getElementById("select");
var nome_destino = document.getElementById("nome_destino");
var chate = document.getElementById("chate");
var mensagem = document.getElementById("mensagem");
var btn_enviar = document.getElementById("btn_enviar");
var user = document.getElementById("user");
const origem = localStorage.getItem("nomeLogin");

/* objeto que vai receber os dados da mensagem */
var mensagemJson = {};

/* variavel que salva os dados de xhr */
var response = undefined;

/* intervalo de tempo da pesquisa */
var interval = undefined;

/* coleta os nomes registrados na api de nomes */
var resNomes = undefined;

user.innerText = `- ${origem}`;

/* função pesquisar, tem uma requisição http na api, que pega 2 valores
(origem e destino), não é enviado nada. Depois das confirmações, é feito um laço de repetição
que cria elementos HTML (lista) e esses elementos recebem os seus valores, (li = dd), (dd = ddText),
(ddText = response[variavel do laço].mensagem). E antes de mandar a lista para a lista nâo ordenada,
uma condição para que a lista mude de lado quando for origem.*/
function pesquisar() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://barth.com.br/ApiChatCliqx/chat/verificarMensagem.php?origem=${origem}&destino=${select.value}`
  );
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        chate.innerHTML = "";
        response = JSON.parse(xhr.responseText);
        for (let x = 0; x < response.length; x++) {
          var li = document.createElement("li");
          var dd = document.createElement("dd");
          var ddText = document.createTextNode(`${response[x].mensagem}`);
          dd.appendChild(ddText);
          li.appendChild(dd);
          if (response[x].origem === origem) {
            li.classList.add("texto_direita");
            dd.classList.add("cor_direita");
          } else {
            li.classList.add("texto_esquerda")
            dd.classList.add("cor_esquerda");
          }
          chate.appendChild(li);
        }
      }
    }
  };
}
setTimeout(function () {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `https://barth.com.br/ApiChatCliqx/chat/receberUsuarios.php`);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        resNomes = JSON.parse(xhr.responseText);
        for (let i = 0; i < resNomes.length; i++) {
          if (origem !== resNomes[i].nome) {
            var option = document.createElement("option");
            var optionText = document.createTextNode(`${resNomes[i].nome}`);
            option.appendChild(optionText);
            select.appendChild(option);
          }
        }
      }
    }
  };
}, 100);

/* função chat, começa limpando o intervalo (se ele existir) e da aos atributos de mensagemJson valores digitados,
depois abre uma requisição em uma api de envio, e manda mensagenJson como stringiFy para a api. Depois faz uma verificação
e usa o intervalo para chamar a função pesquisar() */
function chat() {
  clearInterval(interval);
  mensagemJson = {
    origem: origem,
    destino: select.value,
    mensagem: mensagem.value,
  };
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://barth.com.br/ApiChatCliqx/chat/inserirMensagem.php"
  );
  xhr.send(JSON.stringify(mensagemJson));
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 201) {
        interval = setInterval(function () {
          nome_destino.innerHTML = select.value;
          pesquisar();
        }, 3000);
      }
    }
  };
  mensagem.value = "";
}

mensagem.addEventListener("keypress", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    btn_enviar.click();
  }
});

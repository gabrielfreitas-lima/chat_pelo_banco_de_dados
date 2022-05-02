/* variaveris que recebem os elementos HTML*/
var origem = document.getElementById("user");
var destino = document.getElementById("guest");
var mensagem = document.getElementById("mensagem");
var chate = document.getElementById("chate");
var btn_enviar = document.getElementById("btn_enviar");
var nome_destino = document.getElementById("nome_destino");

/* objeto que vai receber os dados da mensagem */
var mensagemJson = {};

/* variavel que salva os dados de xhr */
var response = undefined;

/* intervalo de tempo da pesquisa */
var interval = undefined;

/* função pesquisar, tem uma requisição http na api, que pega 2 valores
(origem e destino), não é enviado nada. Depois das confirmações, é feito um laço de repetição
que cria elementos HTML (lista) e esses elementos recebem os seus valores, (li = dd), (dd = ddText),
(ddText = response[variavel do laço].mensagem). E antes de mandar a lista para a lista nâo ordenada,
uma condição para que a lista mude de lado quando for origem.*/
function pesquisar() {
  nome_destino.innerText = destino.value;
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://barth.com.br/ApiChatCliqx/chat/verificarMensagem.php?origem=${origem.value}&destino=${destino.value}`
  );
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        chate.innerHTML = "";
        response = JSON.parse(xhr.responseText);
        console.log(response);
        for (let x = 0; x < response.length; x++) {
          var li = document.createElement("li");
          var dd = document.createElement("dd");
          var ddText = document.createTextNode(`${response[x].mensagem}`);
          dd.appendChild(ddText);
          li.appendChild(dd);
          if (response[x].origem === origem.value) {
            li.classList.add("texto_direita");
            dd.classList.add("cor_direita");
          } else {
            dd.classList.add("cor_esquerda");
          }
          chate.appendChild(li);
        }
      }
    }
  };
}

/* função chat, começa limpando o intervalo (se ele existir) e da aos atributos de mensagemJson valores digitados,
depois abre uma requisição em uma api de envio, e manda mensagenJson como stringiFy para a api. Depois faz uma verificação
e usa o intervalo para chamar a função pesquisar() */
function chat() {
  clearInterval(interval);
  mensagemJson = {
    destino: destino.value,
    origem: origem.value,
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
      if (xhr.status == 201) {
        interval = setInterval(function () {
          pesquisar();
        }, 5000);
      }
    }
  };
  mensagem.value = "";
}

/* função de evento, que ao apertar o enter envia a mensagem */
mensagem.addEventListener("keypress", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    btn_enviar.click();
    mensagem.value = "";
  }
});

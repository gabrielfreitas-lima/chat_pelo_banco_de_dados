/* Declarações das variáveis do html */
var origem = document.getElementById("user");
var destino = document.getElementById("guest");
var mensagem = document.getElementById("mensagem");
var chate = document.getElementById("chate");
var btn_enviar = document.getElementById("btn_enviar");
var nome_destino = document.getElementById("nome_destino");

var mensagemJson = {};

var response = undefined;
var interval = undefined;

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
    console.log(xhr.readyState);
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      if (xhr.status == 201) {
        interval = setInterval(function () {
          pesquisar();
        }, 5000);
      }
    }
  };
  mensagem.value = "";
}

mensagem.addEventListener("keypress", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    btn_enviar.click();
    mensagem.value = "";
  }
});

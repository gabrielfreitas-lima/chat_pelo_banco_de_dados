/* Declarações das variáveis do html */
var origem = document.getElementById("user");
var destino = document.getElementById("guest");
var mensagem = document.getElementById("mensagem");
var chate = document.getElementById("chate");

var response = undefined;
var interval = undefined;

function pesquisar() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://barth.com.br/ApiChatCliqx/chat/verificarMensagem.php?origem=${origem.value}&destino=${destino.value}`
  );
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("aquifoi");
      if (xhr.status === 200) {
        chate.innerHTML = ""
        response = JSON.parse(xhr.responseText);
        console.log(response);
        console.log("ta inhdo aqui");
        for(let x = 0; x < response.length; x++){
            var li = document.createElement('li');
            var dt = document.createElement('dt');
            var dtText = document.createTextNode(
                `${response[x].origem}`
                )
                dt.appendChild(dtText);
                li.appendChild(dt);
                
                var dd = document.createElement('dd');
                var ddText = document.createTextNode(
                    `${response[x].mensagem}`
                    )
                    dd.appendChild(ddText);
                    li.appendChild(dd);
                    
                    if(response[x].origem === origem.value){
                        li.classList.add('texto_direita')    
                    }
                    chate.appendChild(li);
                }
            }
    }
  };
}
var mensagemJson = {};

function chat() {
    clearInterval(interval)
  console.log("qualquer coisa");
  mensagemJson = {
    destino: destino.value,
    origem: origem.value,
    mensagem: mensagem.value,
  };
  var xhr = new XMLHttpRequest();
  // https://barth.com.br/ApiChatCliqx/chat/verificarMensagem.php?origem=${imputOrigem.value}&destino=${imputDestino.value};
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
          console.log("pesquisando envou");
          pesquisar();
        }, 1000);
      }
    }
  };
}
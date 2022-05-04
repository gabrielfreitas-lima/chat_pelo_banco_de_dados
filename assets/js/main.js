/* recebem as infos de login*/
var email = document.getElementById("email");
var senha = document.getElementById("senha");
var btn_login = document.getElementById("btn_login");

/* deixa em foco o input de email */
email.focus();

/* coleta os dados da api de login*/
var respostaLogin = undefined;

/* função confirmar, essa function procura o email e a senha digitada pelo usuario na api,
e se encontrar retorna um setTimeout que é usado para fazer uma pesquisa automatica na segunda api, onde é
armazenado todos os nomes dos usuarios, que por ultimo são lidos e atribuidos a um value de um option(que é atribuido a um
select no html), e assim exibidos na tela*/
function confirmar() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://barth.com.br/ApiChatCliqx/chat/verificarLogin.php?email=${email.value}&senha=${senha.value}`
  );
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        respostaLogin = JSON.parse(xhr.responseText);
        if (respostaLogin.login === true) {
          alert("LOGADO!")
          localStorage.setItem('nomeLogin',`${respostaLogin.nome}`)
          window.location.href='zap.html'
        }else{
          alert("Email ou Senha NÃO ENCONTRADOS")
        }
      }
    }
  };
};

email.addEventListener("keypress", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    senha.focus();
  }
});
senha.addEventListener("keypress",function(evento2){
  if (evento2.key === "Enter") {
    evento2.preventDefault();
    btn_login.click();
  }
})
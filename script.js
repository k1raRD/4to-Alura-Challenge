function enviarMensaje() {

  var szNombre = document.querySelector("#inputnombre").value;
  var szMensaje = document.querySelector("#mensaje").value;
  var szError = "";

  if(szNombre == "") { szError += "El campo nombre no puede estar en blanco.<br>";}
  if(szNombre.length > 40 ) { szError += "El campo nombre no puede tener más de 40 caraceres.<br>"}
  if(szMensaje == "") { szError += "El campo mensaje no puede estar en blanco.<br>";}
  if(szMensaje.length > 120 ) { szError += "El campo mensaje no puede tener más de 120 caraceres.<br>"}

  document.querySelector("#errormensaje").innerHTML = szError;

  if(szError == "")
  {
    alert("Mensaje enviado");
    document.querySelector("#inputnombre").value = ""; 
    document.querySelector("#mensaje").value = ""; 
  }
}

function realizarLogin() {
  var szMaillogin = document.querySelector("#maillogin").value;
  var szPwdlogin= document.querySelector("#pwdlogin").value;
  var szError = "";

  if(szMaillogin == "") { szError += "El campo email no puede estar en blanco.<br>";}
  if(!validarEmail(szMaillogin)) {  szError += "Debe ingresar un correo electrónico válido.<br>";}
  if(szPwdlogin == "") { szError += "El campo contraseña no puede estar en blanco.<br>";}
  

  document.querySelector("#errorlogin").innerHTML = szError;

  if(szError == "")
  {
    document.querySelector("#maillogin").value = ""; 
    document.querySelector("#pwdlogin").value = ""; 
    window.location.href = "agregarproducto.html";
  }
}

function validarEmail(szEmail) 
    {
        var regExp = /\S+@\S+\.\S+/;
        return regExp.test(szEmail);
    }
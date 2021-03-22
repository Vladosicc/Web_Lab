const connect = "http://localhost:3000/dis/";

function start()
{
  getajax();
}

function getajax()
{   
  console.log("GET");
  $.ajax({
    type: "GET",
    url: connect + document.getElementById('UserIdGET').value,
    success: function(msg){
      console.log(msg);
      console.log(msg.data);
      var i = 0;
      document.getElementById('table').innerHTML = "";
      while (true)
      {
        try
        {
          var tr = document.createElement("tr");
          var UserId = document.createElement("th");
          UserId.innerHTML = msg.data[i].UserId;
          tr.appendChild(UserId);
          var td = document.createElement("td");
          td.innerHTML = msg.data[i].NickName;
          tr.appendChild(td);
          td = document.createElement("td");
          td.innerHTML = msg.data[i].GuildName;
          tr.appendChild(td);
          td = document.createElement("td");
          td.innerHTML = msg.data[i].IsBot;
          tr.appendChild(td);
          td = document.createElement("td");
          td.innerHTML = msg.data[i].AvatarUrl;
          tr.appendChild(td);
          document.getElementById('table').appendChild(tr);
          i++;
        }
        catch
        {
          break;
        }
      }
    }
  });
}

function postajax()
{
  console.log("POST");
  if(document.getElementById('UserIdPOST').value == "")
  {
    document.getElementById('UserIdPOST').classList.add("is-invalid");
    return;
  }
  else
  {
    document.getElementById('UserIdPOST').classList.remove("is-invalid");
  }
  var id = parseInt(document.getElementById('UserIdPOST').value);
  $.ajax({
    type: "POST",
    url: connect,
    
    data: "UserId="+ id +"&NickName=" + document.getElementById('NickNamePOST').value + "&GuildName=" + document.getElementById('GuildNickNamePOST').value + "&IsBot="+ document.getElementById('IsBotPOST').checked + "&AvatarUrl=" + document.getElementById('AvatarUrlPOST').value,
    success: function(msg){
      console.log(msg);
      getajax();
    }
  });
}

function putajax()
{
  console.log("PUT");
  if(document.getElementById('UserIdPUT').value == "")
  {
    document.getElementById('UserIdPUT').classList.add("is-invalid");
    return;
  }
  else
  {
    document.getElementById('UserIdPUT').classList.remove("is-invalid");
  }
  var id = parseInt(document.getElementById('UserIdPUT').value);
  $.ajax({
    type: "PUT",
    url: connect + id,
    
    data: "UserId="+ id +"&NickName=" + document.getElementById('NickNamePUT').value + "&GuildName=" + document.getElementById('GuildNickNamePUT').value + "&IsBot="+ document.getElementById('IsBotPUT').checked + "&AvatarUrl=" + document.getElementById('AvatarUrlPUT').value,
    success: function(msg){
      console.log(msg);
      getajax();
    }
  });
}

function deleteajax()
{
  console.log("DELETE");
  $.ajax({
    type: "DELETE",
    url: connect + document.getElementById('UserIdDELETE').value,
    success: function(msg){
      console.log(msg);
      getajax();
    }
  });
}

function methodChanged()
{
  switch(document.getElementById('methods').value)
  {
    case '1':
      document.getElementById('formGet').style.display = "inline";
      document.getElementById('formPost').style.display = "none";
      document.getElementById('formPut').style.display = "none";
      document.getElementById('formDelete').style.display = "none";
      break;
    case '2':
      document.getElementById('formGet').style.display = "none";
      document.getElementById('formPost').style.display = "inline";
      document.getElementById('formPut').style.display = "none";
      document.getElementById('formDelete').style.display = "none";
      break;
    case '3':
      document.getElementById('formGet').style.display = "none";
      document.getElementById('formPost').style.display = "none";
      document.getElementById('formPut').style.display = "inline";
      document.getElementById('formDelete').style.display = "none";
      break;
    case '4':
      document.getElementById('formGet').style.display = "none";
      document.getElementById('formPost').style.display = "none";
      document.getElementById('formPut').style.display = "none";
      document.getElementById('formDelete').style.display = "inline";
      break;
    default:
      document.getElementById('formGet').style.display = "inline";
      document.getElementById('formPost').style.display = "none";
      document.getElementById('formPut').style.display = "none";
      document.getElementById('formDelete').style.display = "none";
      break;
  }
}

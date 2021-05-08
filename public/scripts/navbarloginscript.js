  const connectsign = "http://localhost:3000/signin/";
  
  function postlogin()
    {
      console.log("POST");
      $.ajax({
        type: "POST",
        url: connectsign,
        data: "email="+ document.getElementById('modalemail').value + "&password=" + document.getElementById('modalpassword').value,
        success: function(msg){
          console.log(msg);
          if(msg.status == 200)
          {
          window.location.replace(msg.redirect);
          }
          else
          {
            document.getElementById('modalerror').innerHTML = msg.message;
            document.getElementById('modalerror').style.display = 'inline';
          }
        }
      });
    }

    function showPasswordInModal(target)
    {
      var input = document.getElementById('modalpassword');
      if (input.getAttribute('type') == 'password') {
        target.classList.add('view');
        input.setAttribute('type', 'text');
      } 
      else {
        target.classList.remove('view');
        input.setAttribute('type', 'password');
      }
      return false;
    }
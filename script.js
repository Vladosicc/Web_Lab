var before = 0;

function start()
{
  before = 0;
  test1();
}

function test1()
{
    document.getElementById("error").style.display = "none";
    var request = new XMLHttpRequest();
    var url = "https://api.giphy.com/v1/gifs/search?api_key=";
    var token = "frT9CU8K1SO8FAInTXlIUtV6EfHGI9dA";
    console.log(url + token + '&q=' + document.getElementById("q").value + '&limit=' + document.getElementById("range").value + '&offset=' + before + '&rating=g&lang=' + document.getElementById("language").value);
    
    request.open('GET', url + token + '&q=' + document.getElementById("q").value + '&limit=' + document.getElementById("range").value + '&offset=' + before + '&rating=g&lang=' + document.getElementById("language").value);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
      var ts = request.response;
      if(ts.pagination.count === 0)
      {
        document.getElementById("error").style.display = "inline";
      }
      console.log(ts);
      var images = document.getElementById("images");
      images.innerHTML = "";
      for(var i = 1; i <= document.getElementById("range").value; i++)
      {
          var img = document.createElement("img");
          img.style.margin = "10px 0 0 55px";
          img.src = ts.data[i-1].images.downsized.url;
          images.appendChild(img);
          //document.getElementById("img" + i).src=ts.data[i-1].images.downsized.url
      }
      document.getElementById("btnnext").style.display = "inline";
      before += parseInt(document.getElementById("range").value);
      console.log(before);
    }
}

function rangeChange()
{
  console.log(document.getElementById("range").value);
  document.getElementById("rangeCount").innerHTML=document.getElementById("range").value;
  console.log(document.getElementById("rangeCount").innerHTML);
}

String.prototype.trunc = String.prototype.trunc ||
  function(n){
      return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
};

function httpGetAsync(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(JSON.parse(xhr.response))
    };
  };
  
  xhr.open('GET', url, true);
  xhr.send();
};

function httpPostAsync(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.responseText);
    };
  };
  xhr.send(JSON.stringify({author:"Author1", title:"Title1", content:"Content1"}));
  //xhr.send('');
};


function myfunc() {
     
      httpGetAsync("http://127.0.0.1:8081", function(data) {
        mycontent ='';
        for (i in data) {
            elem = JSON.parse(data[i])
            mycontent = mycontent + '<tr><td>' + elem.author + '</td>' + '<td>' + elem.title + '</td>' + '<td>' + elem.content.trunc(100) + '</td></tr>';
        }
        
        document.getElementById("books_table").innerHTML = mycontent;
      });
  

  document.getElementById('button2').addEventListener('click', function() {
      httpPostAsync("http://127.0.0.1:8081", function(data) {
        //mycontent ='';
        //elem = JSON.parse(data);
        //mycontent = mycontent + '<tr><td>' + elem.author + '</td>' + '<td>' + elem.title + '</td>' + '<td>' + elem.content.trunc(100) + '</td></tr>';
        mycontent = data  
        //document.getElementById("post_table").innerHTML = mycontent;
        document.getElementById("post_response").innerHTML = mycontent;
    });
  }, false);
}

window.addEventListener("load", myfunc);
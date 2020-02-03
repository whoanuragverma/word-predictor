$("#input").bind("change paste keyup", function() {
    var itime = (new Date()).getTime();
    var i = $(this).text();
    i = i.split(" ");
    i = i.pop();
    var pos = $("#blank").position();
    document.getElementById("output").style = `left:` + (pos.left + 25) + `px;top:`+ (pos.top+15) +`px;`;
    if(i!=''&&i!=" "){
      var url = "/api?word=" + i;
      $.ajax({
          url: url,
          method: 'GET',
          dataType: 'JSON',
          success: function(data){
              if(data[0]=="No Suggestions"){
                  document.getElementById("output").style = "display:none;"
              }else{
                str = ""
                for (x in data){
                    str += data[x]+ "<br>";
                }
                var otime  = (new Date()).getTime();
                document.getElementById("output").innerHTML = str;
            }
              if(otime-itime>250) document.getElementById("ping").innerHTML = "<h2>Ping:" + (otime-itime) + " ms</h2>";
          }
      });
  }
});
$("#input").keydown(function(e){
    if(e.keyCode==13){
        e.preventDefault();
        alert("Enter key press not yet supported!");
    }
})

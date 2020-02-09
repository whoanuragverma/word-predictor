
$(window).on('load',function (){
    setInterval(removeLoader,4000);   
});
var active = "elem2" 
function removeLoader(){
    $("#loader").remove();
    document.getElementById("body").style = "overflow:auto;";
}
$("#input").on("keyup", function(e) {
    if(e.keyCode!=32){
    var itime = (new Date()).getTime();
    var i = $(this).text(); 
    i = i.split(" ");
    var first_w = i[0];
    if(i!=''){
        document.getElementById("title").innerHTML = first_w;
    }else{
        document.getElementById("title").innerHTML = "Untitled";
    }
    i = i.pop();
    var pos = $("#blank").position();
    document.getElementById("output").style = `left:` + (pos.left + 25) + `px;top:`+ (pos.top+15) +`px;`;
    if(i!=''&&i[i.length-1]!=" "){
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
  }}
});
$("#input").keydown(function(e){
    if(e.keyCode==13){
        e.preventDefault();
        console.log("Enter key support coming soon!")
    }
})
$("#body").bind("contextmenu paste",function(e){
    console.log("Right click and paste disabled.")
    e.preventDefault();
})
$('span.buttons').click(function() { 
    var id = $(this).attr('id');
    document.getElementById(active).className = "buttons";
    active = id;
    document.getElementById(id).className = "buttons active";
});
function offline(){
    if(window.innerWidth<640){
        $("#loader").fadeOut(1200);
        $("ui").fadeIn(1500);
        $("#notsupport").show();
    }else{
        $("#notsupport").hide();
    if(navigator.onLine!=true){
        $("#offline").fadeIn(1500);
        $("#ui").hide();
        $("#loader").fadeOut(1200);
    }else{
        $("#offline").fadeOut(1200);
        $("#ui").fadeIn(1500);
        $("#loader").fadeIn(1500);
    }}
}
setInterval(offline,1000);

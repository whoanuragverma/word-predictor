$(window).on('load',function (){
    setInterval(removeLoader,4000);   
});
var active = "elem2" 
function removeLoader(){
    $("#loader").remove();
    $("#ftr").show();
    document.getElementById("body").style = "overflow:auto;";
}
$("#input").keyup(function(e){
    var i = $(this).text();
    if(i=='')   $(this).text(" ");
    var cur = getCaretPosition(document.getElementById("input"));
    if(e.keyCode==13||e.keyCode==8||e.keyCode==46){
      e.preventDefault();
      if(e.keyCode==13){
          i += " \n";
          document.getElementById("input").innerHTML = i;          
          placeCaretAtEnd(document.getElementById("input"));
      }
      if(e.keyCode==8){
          i = i.split("");       
          i.splice(cur,1);
          i = i.join("");
          document.getElementById("input").innerHTML = i;
          placeCaretAtEnd(document.getElementById("input"));
      }
    }
    var key = i.split(" ");
    key = key.pop();
    var out = "";
    if(key.length>1){
    $.ajax({
        url: 'api?word=' + key,
        method: 'GET',
        dataType: 'json',
        success: function(data){
            for(x in data){
                out += data[x] + "\n";
            }
            $("#output").text(out);
        }
    });
}
});
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
        $("#ftr").hide();        
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

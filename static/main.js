var sugg = 0;
var words = 0;
var time = 0;
var size = "14px";
var family = "'Open Sans', sans-serif";
function ticker(){
    time += 1;
    $("#time").text(time+" seconds")
}
setInterval(ticker,1000);
$(window).on('load', function() {
    setInterval(removeLoader, 4000);
    setTimeout(toast, 5000);
});
var active = "elem2";
function save(){
    var text = $("#input").text();
    $.ajax({
        url: 'api/save?data=' + text,
        method: 'GET',
        success: function(){
            console.log("SAVED");
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function pdf(){
    var element = document.getElementById('input');
    element.style = "border:none;top:30px;font-size:" + size + ";font-family:" + family;
    html2pdf(element);
    await sleep(300);
    element.style = "border:1px solid #b6b2af;top:180px;font-size:" + size + ";font-family:" + family;
}
function toast() {
    M.toast({
        html: 'Use Ctrl+right to insert suggestions',
        displayLength: 3000
    });
    M.toast({
        html: 'Use Ctrl+down to traverse in suggestions',
        displayLength: 6000
    });
    M.toast({
        html: 'Happy typing!🙂',
        displayLength: 9000
    });
}

function removeLoader() {
    $("#loader").remove();
    $("#ftr").show();
    document.getElementById("body").style = "overflow:auto;";
}
var last = "";
$("#input").keyup(function(e) {
    var pos = $("#getter").position();
    var i = $(this).text();
    $("#wrds").text(i.length - 1);
    $("#words").text(i.length - 1);
    if (i == '') {
        $(this).text(" ");
    }
    if (i.length == 1) {
        $("#output").hide();
        return;
    }
    var cur = getCaretPosition(document.getElementById("input"));
    if (e.keyCode == 32) {
        $("#output").hide();
    } else {
        $("#output").show();
    }
    if (e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 46) {
        e.preventDefault();
        if (e.keyCode == 13) {
            i += ` \n <span id="getter"></span>`;
            document.getElementById("input").innerHTML = i;
            placeCaretAtEnd(document.getElementById("input"));
        }
        if (e.keyCode == 8) {
            i = i.split("");
            i.splice(cur, 0);
            i = i.join("");
            document.getElementById("input").innerHTML = i + `<span id="getter"></span>`;
            placeCaretAtEnd(document.getElementById("input"));
        }
    }
    var key = i.split(" ");
    $("#title").text(key[1]);
    key = key.pop();
    var t_w = (getTextWidth(key, size + " " + family.split("'")[1]));
    var out = "";
    var itime = (new Date()).getTime();
    if (key.length > 0 && last != key) {
        $.ajax({
            url: 'api?word=' + key,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                for (x in data) {
                    out += data[x] + "\n";
                }
                var otime = (new Date()).getTime();
                $("#output").css("display", "block");
                $("#output").css("position", "absolute");
                $("#output").css("top", pos.top + 179.67);
                $("#output").css("left", pos.left - t_w + document.documentElement.clientWidth * .188);
                $("#ping").text("Ping: " + (otime - itime) + " ms");
                $("#output").text(out);
                last = key;
                sugg = sugg + 1;
                $("#sugg").text(sugg);
                $("#brwsr").text(window.navigator.appVersion.substring(73,93));
            }
        });
    }
});
$("#body").bind("contextmenu", function(e) {
    console.log("Right click disabled.");
    e.preventDefault();
});
$("#input").on("paste",function(event){
    event.preventDefault();
    var clipboarddata = $("#input").text()
    clipboarddata +=  window.event.clipboardData.getData('text');    
    clipboarddata += '<span id="getter"></span>';
    document.getElementById("input").innerHTML = clipboarddata;
    placeCaretAtEnd(document.getElementById("input"));
});

$('span.buttons').click(function() {
    var id = $(this).attr('id');
    document.getElementById(active).className = "buttons";
    document.getElementById(active + "a").className = "expan";
    active = id;
    document.getElementById(id).className = "buttons active";
    document.getElementById(id + "a").className = "expan active1";
});

function offline() {
    if (window.innerWidth < 640) {
        $("#loader").hide();
        $("#ui").hide();
        $("#notsupport").show();
    } else {
        $("#notsupport").hide();
        $("#ui").show();
    }
}
setInterval(offline, 1000);
$(document).bind('keydown', function(e) {
    if (e.ctrlKey && e.which == 40) {
        var i = $("#input").text();
        i = i.split(" ");
        i.pop();
        var out = $("#output").text();
        out = out.split("\n");
        out.shift();
        out = out.join("\n");
        $("#output").text(out);
        i = i.join(" ");
        placeCaretAtEnd(document.getElementById("input"));
    }
});

$(document).bind('keydown', function(e) {
    if (e.ctrlKey && e.which == 39) {
        var i = $("#input").text();
        i = i.split(" ");
        i.pop();
        var out = $("#output").text();
        out = out.split("\n");
        i.push(out.shift());
        i = i.join(" ");
        document.getElementById("input").innerHTML = i + `<span id="getter"></span>`;
        placeCaretAtEnd(document.getElementById("input"));
    }
});
$("#font-size").on('change',function () {
    size = document.getElementById("font-size").value + "px";
    var input = document.getElementById('input');
    input.style.setProperty("font-size",size);
    var output = document.getElementById('output');
    output.style.setProperty("font-size",size);
});
$("#font-face").on('change',function () {
    family = document.getElementById("font-face").value;
    var input = document.getElementById('input');
    input.style.setProperty("font-family",family);
    var output = document.getElementById('output');
    output.style.setProperty("font-family",family);
});
function bold(){
    if($("#bold").hasClass("toggle")){
        $("#bold").removeClass("toggle");
        $("#input").removeClass("font-weight-bold");
        $("#output").removeClass("font-weight-bold");
    }else{
        $("#bold").addClass("toggle");
        $("#input").addClass("font-weight-bold");
        $("#output").addClass("font-weight-bold");
    }
}
function italic(){
    if($("#italic").hasClass("toggle")){
        $("#italic").removeClass("toggle");
        $("#input").removeClass("font-italic");
        $("#output").removeClass("font-italic");
    }else{
        $("#italic").addClass("toggle");
        $("#input").addClass("font-italic");
        $("#output").addClass("font-italic");
    }
}
function underline(){
    if($("#underline").hasClass("toggle")){
        $("#underline").removeClass("toggle");
        $("#input").removeClass("font-underline");
    }else{
        $("#underline").addClass("toggle");
        $("#input").addClass("font-underline");
    }
}
function strike(){
    if($("#strike").hasClass("toggle")){
        $("#input").removeClass("font-strike");
        $("#strike").removeClass("toggle");
    }else{
        $("#strike").addClass("toggle");
        $("#input").addClass("font-strike");;
    }
}
function left(){
    if($("#right").hasClass("toggle")){
        $("#right").removeClass("toggle");
        $("#input").removeClass("text-right");
    }
    if($("#center").hasClass("toggle")){
        $("#center").removeClass("toggle");
        $("#input").removeClass("text-center");
    }
    if($("#left").hasClass("toggle")){
        $("#input").removeClass("text-left");
        $("#left").removeClass("toggle");
    }else{
        $("#left").addClass("toggle");
        $("#input").addClass("text-left");;
    }
}
function center(){
    if($("#right").hasClass("toggle")){
        $("#right").removeClass("toggle");
        $("#input").removeClass("text-right");
    }
    if($("#left").hasClass("toggle")){
        $("#left").removeClass("toggle");
        $("#input").removeClass("text-left");
    }
    if($("#center").hasClass("toggle")){
        $("#input").removeClass("text-center");
        $("#center").removeClass("toggle");
    }else{
        $("#center").addClass("toggle");
        $("#input").addClass("text-center");;
    }
}
function right(){
    if($("#left").hasClass("toggle")){
        $("#left").removeClass("toggle");
        $("#input").removeClass("text-left");
    }
    if($("#center").hasClass("toggle")){
        $("#center").removeClass("toggle");
        $("#input").removeClass("text-center");
    }
    if($("#right").hasClass("toggle")){
        $("#input").removeClass("text-right");
        $("#right").removeClass("toggle");
    }else{
        $("#right").addClass("toggle");
        $("#input").addClass("text-right");;
    }
}

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
async function print(){
    var element = document.getElementById('input');
    element.style = "border:none;top:30px;"
    html2pdf(element);
    await sleep(300);
    element.style = "border:1px solid #b6b2af;top:180px";
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
    var t_w = (getTextWidth(key, "14px Open Sans"));
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
                $("#output").css("left", pos.left - t_w + 1 + 240);
                $("#ping").text("Ping: " + (otime - itime) + " ms");
                $("#output").text(out);
                last = key;
            }
        });
    }
});
$("#body").bind("contextmenu paste", function(e) {
    console.log("Right click and paste disabled.");
    e.preventDefault();
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
        $("#loader").fadeOut(1200);
        $("ui").fadeIn(1500);
        $("#notsupport").show();
        $("#ftr").hide();
    } else {
        $("#notsupport").hide();
        if (navigator.onLine != true) {
            $("#offline").fadeIn(1500);
            $("#ui").hide();
            $("#loader").fadeOut(1200);
        } else {
            $("#offline").fadeOut(1200);
            $("#ui").fadeIn(1500);
            $("#loader").fadeIn(1500);
        }
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
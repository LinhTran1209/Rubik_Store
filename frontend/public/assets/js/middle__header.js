var n = 2;
var current = 1;
function auto_ShowImg() {
    if(current < n)
        current +=1;
    else
        current = 1;
    $("#id-img-adv").animate({ opacity: 0 }, 500, function () {
        $(this).attr("src", "./assets/img/adv" + current + ".jpg");
    }).animate({ opacity: 1 }, 500);
}
setInterval(function() {
    auto_ShowImg();
}, 5000);
function next_Img() {
    if (current == 2)
        current =1
    else
        current++;
    $("#id-img-adv").animate({ opacity: 0 }, 500, function () {
        $(this).attr("src", "./assets/img/adv" + current + ".jpg");
    }).animate({ opacity: 1 }, 500);
}

function back_Img() {
    if (current == 1)
        current =2
    else
        current--;
    $("#id-img-adv").animate({ opacity: 0 }, 500, function () {
        $(this).attr("src", "./assets/img/adv" + current + ".jpg");
    }).animate({ opacity: 1 }, 500);
}


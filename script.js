Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

Date.prototype.getActualDay = function() {
    return (this.getDay() + 6) % 7;
}

var background = document.getElementById("schedule");
var settings = document.getElementById("settings");

var schoolID = "29540";
var userID = "980523-6032";
var week = (new Date()).getWeek();
var today = Math.pow(2, (new Date()).getActualDay());

document.getElementById("userIDLabel").innerHTML = userID;
document.getElementById("weekLabel").innerHTML = week;
document.getElementById("dayLabel").innerHTML = today;

var getImage = function () {
    var width = window.innerWidth;
    var height = window.innerHeight - 40;

    background.style.width = width;
    background.style.height = height;

    return "http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=" + schoolID + "/sv-se&type=-1&id=" + userID + "&period=&week=" + week + "&mode=1&printer=0&colors=32&head=0&clock=1&foot=0&day=" + today + "&width=" + width + "&height=" + height + "&maxwidth=" + width + "&maxheight=" + height;
}

var toggleSettings = function (toggle) {
    if (toggle === 1) {
        settings.style.display = "block";
        background.style.webkitFilter = "blur(2px)";
    }
    else if (toggle === 0) {
        settings.style.display = "none";
        background.style.webkitFilter = "blur(0)";
    }

    background.onclick = function(e) {
        if(e.target != settings) {
            toggleSettings(0);
        }
    }
}

background.style.backgroundImage = "url(" + getImage() + ")";

window.addEventListener("resize", function () {
    background.style.backgroundImage = "url(" + getImage() + ")";
});

document.getElementById("settingsButton").addEventListener("click", function () {
    toggleSettings(1);
});

document.getElementById("settingsBackButton").addEventListener("click", function () {
    toggleSettings(0);
});
document.getElementById("submitSettings").addEventListener("click", function () {
    schoolID = document.getElementById("schoolID").value;
    userID = document.getElementById("userID").value;
    week = document.getElementById("week").value;
    day = document.getElementById("day").value;

    background.style.backgroundImage = "url(" + getImage() + ")";
    toggleSettings(0);
})

document.getElementById("cancelSettings").addEventListener("click", function () {
    toggleSettings(0);
});

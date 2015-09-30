var background = document.getElementById("schedule");

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

Date.prototype.getActualDay = function() {
    return (this.getDay() + 6) % 7;
}

var getImage = function() {
    var schoolID = "29540";
    var userID = "980523-6032";
    var week = (new Date()).getWeek();
    var today = Math.pow(2, (new Date()).getActualDay());

    var width = window.innerWidth - 8;
    var height = window.innerHeight - 16;

    background.style.width = width;
    background.style.height = height;

    return "http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=" + schoolID + "/sv-se&type=-1&id=" + userID + "&period=&week=" + week + "&mode=1&printer=0&colors=32&head=0&clock=1&foot=0&day=" + today + "&width=" + width + "&height=" + height + "&maxwidth=" + width + "&maxheight=" + height;
}

background.style.backgroundImage = "url(" + getImage() + ")";

window.addEventListener("resize", function () {
    background.style.backgroundImage = "url(" + getImage() + ")";
});

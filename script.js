Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

Date.prototype.getActualDay = function() {
    return (this.getDay() + 6) % 7;
}

var background = document.getElementById("schedule");
var settings = document.getElementById("settings");
var days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];


var settingsVisible = false;

var readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

if (readCookie("SCHOOLID") != null) {
    schoolID = readCookie("SCHOOLID");
}
else {
    var schoolID = "29540";
}

if (readCookie("USERID") != null) {
    userID = readCookie("USERID");
}
else {
    var userID = "980523-6032";
}

var week = (new Date()).getWeek();
var today = Math.pow(2, (new Date()).getActualDay());

var setDefaultValues = function () {
    document.getElementById("schoolID").value = schoolID;
    document.getElementById("userID").value = userID;
    document.getElementById("week").value = week;
    document.getElementById("dayPicker").innerHTML = "<p>" + days[Math.log2(today)] + "</p>";
}

var getImage = function () {
    var header = document.getElementById("header");
    var headerStyle = getComputedStyle(header);
    var headerHeight = headerStyle.getPropertyValue('height');

    var width = window.innerWidth;
    var height = window.innerHeight - Math.round(headerHeight.substring(0, headerHeight.length - 2));

    background.style.width = width;
    background.style.height = height;

    return "http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=" + schoolID + "/sv-se&type=-1&id=" + userID + "&period=&week=" + week + "&mode=1&printer=0&colors=32&head=0&clock=1&foot=0&day=" + today + "&width=" + width + "&height=" + height + "&maxwidth=" + width + "&maxheight=" + height;
}

var toggleSettings = function (toggle) {
    if (toggle === 1) {
        settingsVisible = true;
        settings.style.display = "block";

        settingsStyle = getComputedStyle(settings);
        settingsWidth = settingsStyle.getPropertyValue("width");

        settings.style.left = (window.innerWidth - settingsWidth.substring(0, settingsWidth.length - 2)) / 2;
        background.style.webkitFilter = "blur(2px)";
    }
    else if (toggle === 0) {
        settingsVisible = false;
        settings.style.display = "none";
        background.style.webkitFilter = "blur(0)";
    }

    background.onclick = function(e) {
        if(e.target != settings) {
            toggleSettings(0);
        }
    }
}

var createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else {
        var expires = " ";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

var eventListeners = function () {
    window.addEventListener("resize", function () {
        if (settingsVisible) {
            toggleSettings(1);
        }

        background.style.backgroundImage = "url(" + getImage() + ")";
    });

    document.getElementById("settingsButton").addEventListener("touchstart", function () {
        var touchStart = event.target;

        document.getElementById("settingsButton").addEventListener("touchend", function () {
            if(event.target === touchStart) {
                toggleSettings(1);
            }
        });
    });

    for (var i = 0; i < days.length; i++) {
        document.getElementById(days[i]).addEventListener("touchstart", function () {
            var touchStart = event.target;
            var day = event.srcElement.id;

            document.getElementById(day).addEventListener("touchend", function () {
                if (event.target === touchStart) {
                    document.getElementById("dayPicker").innerHTML = "<p>" + day + "</p>";
                }
            });
        });
    }

    document.getElementById("submitSettings").addEventListener("touchstart", function () {
        var touchStart = event.target;

        document.getElementById("submitSettings").addEventListener("touchend", function () {
            if(event.target === touchStart) {
                schoolID = document.getElementById("schoolID").value;
                userID = document.getElementById("userID").value;

                createCookie("SCHOOLID", schoolID, 365);
                createCookie("USERID", userID, 365);

                week = document.getElementById("week").value;

                var dayPickedTagged = document.getElementById("dayPicker").innerHTML;
                var dayPicked = dayPickedTagged.substring(3, dayPickedTagged.length - 4);
                var dayIndex = days.indexOf(dayPicked);

                today = Math.pow(2, dayIndex);

                background.style.backgroundImage = "url(" + getImage() + ")";

                toggleSettings(0);
            }
        });
    });

    document.getElementById("cancelSettings").addEventListener("touchstart", function () {
        var touchStart = event.target;

        document.getElementById("cancelSettings").addEventListener("touchend", function () {
            if(event.target === touchStart) {
                toggleSettings(0);
            }
        });
    });
}

setDefaultValues();
background.style.backgroundImage = "url(" + getImage() + ")";
eventListeners();

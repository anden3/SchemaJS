Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

Date.prototype.getActualDay = function () {
    return (this.getDay() + 6) % 7;
}


var background = document.getElementById("schedule"),
    settings = document.getElementById("settings"),
    days = ["M\u{E5}ndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Vecka"],
    settingsVisible = false,
    weeksAdded = 0,
    daysAdded = 0;


var createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = " ";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

var readCookie = function (name) {
    var nameEQ = name + "=",
        ca = document.cookie.split(";");

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

var setDefaultValues = function () {
    if (readCookie("schoolID") != null) {
        schoolID = readCookie("SCHOOLID");
    } else if (localStorage.schoolID != null) {
        schoolID = localStorage.schoolID;
    } else {
        schoolID = "29540";
    }

    if (readCookie("USERID") != null) {
        userID = readCookie("USERID");
    } else if (localStorage.userID != null) {
        userID = localStorage.userID;
    } else {
        userID = "";
    }

    if (readCookie("CLASSID") != null) {
        classID = readCookie("CLASSID");
    } else if (localStorage.classID != null) {
        classID = localStorage.classID;
    } else {
        classID = "";
    }

    if (readCookie("IDTYPE") != null) {
        IDType = readCookie("IDTYPE");
        if (IDType.length >= 10) {
            document.getElementById("userRadio").checked = true;
            document.getElementById("classRadio").checked = false;
        } else {
            document.getElementById("classRadio").checked = true;
            document.getElementById("userRadio").checked = false;
        }
    } else if (localStorage.IDType != null) {
        IDType = localStorage.IDType;
        if (IDType.length >= 10) {
            document.getElementById("userRadio").checked = true;
            document.getElementById("classRadio").checked = false;
        } else {
            document.getElementById("classRadio").checked = true;
            document.getElementById("userRadio").checked = false;
        }
    } else {
        IDType = userID;
        document.getElementById("userRadio").checked = true;
        document.getElementById("classRadio").checked = false;
    }

    week = (new Date()).getWeek();
    today = Math.pow(2, (new Date()).getActualDay());
}

var displayDefaultValues = function () {
    document.getElementById("schoolID").value = schoolID;
    document.getElementById("userID").value = userID;
    document.getElementById("classID").value = classID;
    document.getElementById("week").value = week;
    document.getElementById("dayPicker").innerHTML = "<p>" + days[Math.log2(today)] + "</p>";
}

var getImage = function (ID) {
    var header = document.getElementById("header"),
        headerStyle = getComputedStyle(header),
        headerHeight = headerStyle.getPropertyValue('height');

    var width = window.innerWidth,
        height = window.innerHeight - Math.round(headerHeight.substring(0, headerHeight.length - 2));

    background.style.width = width;
    background.style.height = height;

    return "http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=" + schoolID + "/sv-se&type=-1&id=" + ID + "&period=&week=" + week + "&mode=1&printer=0&colors=32&head=0&clock=1&foot=0&day=" + today + "&width=" + width + "&height=" + height + "&maxwidth=" + width + "&maxheight=" + height;
}

var toggleSettings = function (toggle) {
    if (toggle === 1) {
        settingsVisible = true;
        settings.style.display = "block";

        settingsStyle = getComputedStyle(settings);
        settingsWidth = settingsStyle.getPropertyValue("width");

        settings.style.left = (window.innerWidth - settingsWidth.substring(0, settingsWidth.length - 2)) / 2;
        background.style.webkitFilter = "blur(2px)";
    } else if (toggle === 0) {
        settingsVisible = false;
        settings.style.display = "none";
        background.style.webkitFilter = "blur(0)";
    }
}

var submitSettings = function (direction) {
    schoolID = document.getElementById("schoolID").value;
    userID = document.getElementById("userID").value;
    classID = document.getElementById("classID").value;

    if (document.getElementById("userRadio").checked) {
        IDType = userID;
    } else {
        IDType = classID;
    }

    createCookie("SCHOOLID", schoolID, 365);
    createCookie("USERID", userID, 365);
    createCookie("CLASSID", classID, 365);
    createCookie("IDTYPE", IDType, 365);

    localStorage.setItem("schoolID", schoolID);
    localStorage.setItem("userID", userID);
    localStorage.setItem("classID", classID);
    localStorage.setItem("IDType", IDType);

    week = document.getElementById("week").value;

    var dayPickedTagged = document.getElementById("dayPicker").innerHTML,
        dayPicked = dayPickedTagged.substring(3, dayPickedTagged.length - 4),
        dayIndex = days.indexOf(dayPicked);

    document.getElementById("dayPicker").innerHTML = "<p>" + days[dayIndex] + "</p>";

    if (direction === "left") {
        daysAdded -= 1;
        dayIndex += daysAdded;
        if (dayIndex < 0) {
            weeksAdded -= 1;

            daysAdded += 5;
            dayIndex = 5;
        }
    }
    else if (direction === "up") {
        weeksAdded += 1;
    }
    else if (direction === "right") {
        daysAdded += 1;
        dayIndex += daysAdded;
        if (dayIndex > 5) {
            weeksAdded += 1;

            daysAdded -= 5;
            dayIndex = 0;
        }
    }
    else if (direction === "down") {
        weeksAdded -= 1;
    }

    week = parseInt(week, 10) + weeksAdded;

    if (dayIndex != 5) {
        today = Math.pow(2, dayIndex);
    }
    else {
        today = 0;
    }

    background.style.backgroundImage = "url(" + getImage(IDType) + ")";
    toggleSettings(0);
}

var eventListeners = function () {
    window.addEventListener("resize", function () {
        if (settingsVisible) {
            toggleSettings(1);
        }

        background.style.backgroundImage = "url(" + getImage(IDType) + ")";
    });

    var is_touch_device = 'ontouchstart' in document.documentElement;

    if (is_touch_device) {
        document.getElementById("settingsButton").addEventListener("touchstart", function () {
            var touchStart = event.target;

            document.getElementById("settingsButton").addEventListener("touchend", function () {
                if (event.target === touchStart) {
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
                if (event.target === touchStart) {
                    submitSettings(0);
                }
            });
        });

        document.getElementById("cancelSettings").addEventListener("touchstart", function () {
            var touchStart = event.target;

            document.getElementById("cancelSettings").addEventListener("touchend", function () {
                if (event.target === touchStart) {
                    toggleSettings(0);
                }
            });
        });

        swipedetect(background, function (swipedir) {
            submitSettings(swipedir);
        });
    } else {
        window.addEventListener("keydown", function () {
            if (settingsVisible === false) {
                if (event.keyCode === 37) {
                    submitSettings("left");
                }
                else if (event.keyCode === 38) {
                    submitSettings("up");
                }
                else if (event.keyCode === 39) {
                    submitSettings("right");
                }
                else if (event.keyCode === 40) {
                    submitSettings("down");
                }
            }
        });

        document.getElementById("settingsButton").addEventListener("click", function () {
            toggleSettings(1);
        });

        for (var i = 0; i < days.length; i++) {
            document.getElementById(days[i]).addEventListener("click", function () {
                var day = event.srcElement.id;
                document.getElementById("dayPicker").innerHTML = "<p>" + day + "</p>";
            });
        }

        document.getElementById("submitSettings").addEventListener("click", function () {
            submitSettings(0);
        });

        document.getElementById("cancelSettings").addEventListener("click", function () {
            submitSettings(0);
        });

        var textFields = document.getElementsByClassName("mdl-textfield__input");

        for (var i = 0; i < textFields.length; i++) {
            textFields[i].addEventListener("keydown", function () {
                if (event.keyCode === 13) {
                    submitSettings(0);
                }
            });
        }

        window.addEventListener("keydown", function () {
            if (settingsVisible && event.keyCode === 27) {
                toggleSettings(0);
            }
        });
    }
}

function swipedetect(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 100, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {}

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0],
            dist = 0;

        swipedir = 'none';
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault(); // prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0];

        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed

        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir);
        e.preventDefault();
    }, false);
}

setDefaultValues();
displayDefaultValues();
background.style.backgroundImage = "url(" + getImage(IDType) + ")";
eventListeners();

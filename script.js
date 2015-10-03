Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

Date.prototype.getActualDay = function () {
    return (this.getDay() + 6) % 7;
}

var header = document.getElementById("header"),
    foodElement = document.getElementById("food"),
    background = document.getElementById("schedule"),
    settings = document.getElementById("settings"),
    days = ["M\u{E5}ndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Vecka"],
    settingsVisible = false,
    weeksAdded = 0,
    daysAdded = 0,
    foodWeeks = new Set(),
    foodDays = new Set(),
    foodDescs = [],
    food = {},
    primaryKey = 0;


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

    if (today >= 32) {
        today = 1;
    } else {
        week = parseInt(week);
        week -= 1;
    }
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

    week = parseInt(document.getElementById("week").value, 10);

    var dayPickedTagged = document.getElementById("dayPicker").innerHTML,
        dayPicked = dayPickedTagged.substring(3, dayPickedTagged.length - 4),
        dayIndex = days.indexOf(dayPicked);

    if (direction === "left") {
        dayIndex -= 1;

        if (dayIndex < 0) {
            week -= 1;
            dayIndex = 5;
        }
    } else if (direction === "up") {
        week += 1;
        dayIndex += daysAdded;
    } else if (direction === "right") {
        dayIndex += 1;

        if (dayIndex > 5) {
            week += 1;
            dayIndex = 0;
        }
    } else if (direction === "down") {
        week -= 1;
        dayIndex += daysAdded;
    }

    if (dayIndex != 5) {
        today = Math.pow(2, dayIndex);
    } else {
        today = 0;
    }

    document.getElementById("dayPicker").innerHTML = "<p>" + days[dayIndex] + "</p>";
    document.getElementById("week").value = week;
    week = week.toString();

    if (dayIndex < 5 && foodWeeks.indexOf(week) != -1) {
        header.style.height = "12vh";
        foodElement.style.display = "block";
        background.style.marginTop = "12vh";
        foodElement.innerHTML = "<p>" + food[week][days[dayIndex]] + "</p>";
    } else {
        header.style.height = "6vh";
        foodElement.style.display = "none";
        background.style.marginTop = "6vh";
        foodElement.innerHTML = "";

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
                } else if (event.keyCode === 38) {
                    submitSettings("up");
                } else if (event.keyCode === 39) {
                    submitSettings("right");
                } else if (event.keyCode === 40) {
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

    setInterval(parseRSS, 1000 * 60 * 60);
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
        allowedTime = 500, // maximum time allowed to travel that distance
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

        if (elapsedTime <= allowedTime) { // first condition for a wipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'right' : 'left'; // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'down' : 'up'; // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir);
        e.preventDefault();
    }, false);
}

var parseRSS = function () {
    var currentWeek = (new Date()).getWeek();
    var weeksStored = currentWeek - 41;

    primaryKey = (weeksStored * 5);

    $.get("proxy_file.php", function (data) {
        $(data).find("item").each(function () {
            var el = $(this);
            var foodData;

            var title = el.find("title").text();
            var titleItems = title.split(" ");

            var foodWeek = parseInt(titleItems[3]);
            var foodDay = titleItems[0];

            var foodDescFull = el.find("description").text();

            if (foodDescFull.indexOf("<br/>") !== -1) {
                foodDescFull = foodDescFull.substring(foodDescFull.indexOf("<br/>") + 5, foodDescFull.length);
            }

            var foodDesc = foodDescFull.trim();

            $.post('store_foods.php', {
                week: foodWeek,
                day: foodDay,
                desc: foodDesc,
                key: primaryKey
            });

            primaryKey += 1;
        });
    });
}

var getFoods = function () {
    $.get("get_foods.php", function (data) {
        foodData = data.match(/[^\r\n]+/g);
        for (var i = 0; i < foodData.length; i++) {
            foodData[i] = foodData[i].replace("Ã¥", "å");
            foodData[i] = foodData[i].replace("Ã¥", "å");
            foodData[i] = foodData[i].replace("Ã¤", "ä");
            foodData[i] = foodData[i].replace("Ã¶", "ö");
            foodData[i] = foodData[i].replace("Ã©", "é");

            var foodDataSplit = foodData[i].split(" ");

            foodWeeks.add(foodDataSplit[0]);
            foodDataSplit.shift();

            foodDays.add(foodDataSplit[0]);
            foodDataSplit.shift();

            var foodDesc = foodDataSplit.join(" ");
            foodDesc = foodDesc.substring(1, foodDesc.length - 1);
            foodDescs.push(foodDesc);
        }

        foodWeeks = Array.from(foodWeeks);
        foodDays = Array.from(foodDays);

        for (var i = 0; i < 5; i++) {
            foodDay = foodDays[i];
            food[foodWeeks[0]] = {
                foodDay
            };
            food[foodWeeks[1]] = {
                foodDay
            };
        }

        for (var i = 0; i < 5; i++) {
            food[foodWeeks[0]][foodDays[i]] = foodDescs[i];
            food[foodWeeks[1]][foodDays[i]] = foodDescs[i + 5];
        }
        submitSettings();
    });
}


setDefaultValues();
displayDefaultValues();
parseRSS();
getFoods();
background.style.backgroundImage = "url(" + getImage(IDType) + ")";
eventListeners();

//Adds method for getting day of the week, where the first day of the week is Monday instead of Sunday
Date.prototype.getActualDay = function () {
    return (this.getDay() + 6) % 7;
};

//Adds method for getting week number
Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getActualDay()) / 7);
};

//Adding default variables and values
var header = document.getElementById("header"),
    foodElement = document.getElementById("food"),
    background = document.getElementById("schedule"),
    settings = document.getElementById("settings"),
    about = document.getElementById("about"),

    headerHeight,
    scheduleHeight,
    currentDay,

    is_touch_device = 'ontouchstart' in document.documentElement,
    screenOrientation = ($(window).width() > $(window).height())? 90 : 0,

    popupVisible = false,

    replaceChars = {
        å: "Ã¥",
        ä: "Ã¤",
        ö: "Ã¶",
        Å: "Ã…",
        Ö: "Ã–",
        é: "Ã©",
        è: "Ã¨",
        ë: "Ã«",
        ü: "Ã¼"
    },

    days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Vecka"],
    values = ["scheduleType", "IDType", "teacherID", "teacherName", "schoolID", "userID", "classID", "roomID", "subjectID", "week"],

    daysAdded = 0,
    primaryKey = 0,

    foodWeeks = {},
    foodDays = {},
    foodDescs = [],
    food = {};

var fixChars = function (array) {
    var count = 2;

    while (count > 0) {
        for (var i = 0; i < array.length; i++) {
            for (c in replaceChars) {
                array[i] = array[i].replace(replaceChars[c], c);
            }
        }
        count--;
    }
    return array;
}

//Function to create a cookie
var createCookie = function (name, value, days) {
    var expires = " ";

    if (days) { //If days is defined, create regular cookie
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }

    document.cookie = name + "=" + value + expires + "; path=/";
};

//Function to read a cookie
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
    return null; //If cookie doesn't exist, return null
};

//Updating the values with the ones stored in cookies or localstorage, as well as adding the current week and day
var setDefaultValues = function () {
    if (readCookie("SCHOOLID") !== null) {
        schoolID = readCookie("SCHOOLID");
    } else if (localStorage.schoolID !== "undefined" && typeof localStorage.schoolID !== "undefined") {
        schoolID = localStorage.schoolID;
    } else {
        schoolID = "29540";
    }

    if (readCookie("SCHEDULETYPE") !== null) {
        scheduleType = readCookie("SCHEDULETYPE");
    } else if (localStorage.scheduleType !== "undefined" && typeof localStorage.scheduleType !== "undefined") {
        scheduleType = localStorage.scheduleType;
    } else {
        scheduleType = "student";
    }

    if (readCookie("USERID") !== null) {
        userID = readCookie("USERID");
    } else if (localStorage.userID !== "undefined" && typeof localStorage.userID !== "undefined") {
        userID = localStorage.userID;
    } else {
        userID = "";
    }

    if (readCookie("CLASSID") !== null) {
        classID = readCookie("CLASSID");
    } else if (localStorage.classID !== "undefined" && typeof localStorage.classID !== "undefined") {
        classID = localStorage.classID;
    } else {
        classID = "";
    }

    if (readCookie("ROOMID") !== null) {
        roomID = readCookie("ROOMID");
    } else if (localStorage.roomID !== "undefined" && typeof localStorage.roomID !== "undefined") {
        roomID = localStorage.roomID;
    } else {
        roomID = "";
    }

    if (readCookie("TEACHERNAME") !== null) {
        teacherName = readCookie("TEACHERNAME");
    } else if (localStorage.teacherName !== "undefined" && typeof localStorage.teacherName !== "undefined") {
        teacherName = localStorage.teacherName;
    } else {
        teacherName = "";
    }

    if (readCookie("TEACHERID") !== null) {
        teacherID = readCookie("TEACHERID");
    } else if (localStorage.teacherID !== "undefined" && typeof localStorage.teacherID !== "undefined") {
        teacherID = localStorage.teacherID;
    } else {
        teacherID = "";
    }

    if (readCookie("SUBJECTID") !== null) {
        subjectID = readCookie("SUBJECTID");
    } else if (localStorage.subjectID !== "undefined" && typeof localStorage.subjectID !== "undefined") {
        subjectID = localStorage.subjectID;
    } else {
        subjectID = "";
    }

    //Ensures the proper radio button is checked
    if (readCookie("IDTYPE") !== null) {
        IDType = readCookie("IDTYPE");
        if (IDType.length >= 10) {
            document.getElementById("userRadio").checked = true;
        } else {
            document.getElementById("classRadio").checked = true;
        }
    } else if (localStorage.IDType !== "undefined" && typeof localStorage.IDType !== "undefined") {
        IDType = localStorage.IDType;
        if (IDType.length >= 10) {
            document.getElementById("userRadio").checked = true;
        } else {
            document.getElementById("classRadio").checked = true;
        }
    } else {
        IDType = userID;
        document.getElementById("userRadio").checked = true;
    }

    week = (new Date()).getWeek();
    today = Math.pow(2, (new Date()).getActualDay()); //Get today in 2^x format, in order to work with schedule generator

    //If the current day is a weekday, then set the displayed day to monday next week
    if (today >= 32) {
        today = 1;
        week += 1;
    } else {
        //Else, set week to current week
        week = parseInt(week);
    }
};

//Update the values of the settings with the stored values
var displayDefaultValues = function () {
    for (var i = 4; i < values.length; i++) {
        document.getElementById(values[i]).value = window[values[i]];
    }

    document.getElementById("dayPicker").innerHTML = "<p>" + days[(Math.log(today) / Math.log(2))] + "</p>";
    document.getElementById(scheduleType + "Radio").checked = true;
    document.getElementById("teacherID").value = teacherName;
    document.getElementById("teacherID").setAttribute("name", teacherName.substring(teacherName.indexOf("(" + 1), teacherName.length - 1));
}

var progressBar = function () {
    var now = new Date(),
        dd = ('0' + now.getDate()).slice(-2),
        mm = (parseInt(('0' + now.getMonth()).slice(-2)) + 1).toString(),
        yyyy = now.getFullYear(),

        startHour,
        startMin,
        endHour,
        endMin,

        offset = 0,

        bar = document.getElementById("progress");

    if (scheduleType === "student") {
        startHour = 8;
        startMin = 25;
        endHour = 16;
        endMin = 50;
    }
    else if (scheduleType === "teacher") {
        startHour = 8;
        startMin = 15;
        endHour = 17;
        endMin = "00";
    }
    else if (scheduleType === "room") {
        startHour = 8;
        startMin = 25;
        endHour = 16;
        endMin = 10;
    }

    var testDate = new Date(yyyy + "-" + mm + "-" + dd + "T12:00:00"),
        testHour = parseInt(testDate.toTimeString().substring(0, 2));

    if (testHour !== 12) {
        offset = 12 - testHour;
    }

    var startTime = new Date(yyyy + "-" + mm + "-" + dd + "T0" + (startHour + offset).toString() + ":" + startMin + ":00"),
        endTime = new Date(yyyy + "-" + mm + "-" + dd + "T" + (endHour + offset).toString() + ":" + endMin + ":00");

    var timeBetween = endTime - startTime,
        percentComplete = (now - startTime) / timeBetween,
        pixelDistance = (scheduleHeight - (window.innerHeight / 9.5)) * percentComplete,
        correction = window.innerHeight * 0.09;

    if (percentComplete < 1 && percentComplete > 0 && days[now.getActualDay()] === currentDay) {
        bar.style.display = "block";
        bar.style.top = headerHeight + correction + pixelDistance + "px";
    }
    else {
        bar.style.display = "none";
    }
}

//Getting the image from the schedule generator
var getImage = function () {
    var ID;

    //Getting the height of the header
    var header = document.getElementById("header"),
        headerStyle = getComputedStyle(header),
        headerHeightValue = headerStyle.getPropertyValue('height');

    headerHeight = Math.round(headerHeightValue.substring(0, headerHeightValue.length - 2));

    //Setting the dimensions of the image to the width of the window, and the height to the height of the window - the height of the header
    var width = window.innerWidth,
        height = $(window).height() - headerHeight;

    scheduleHeight = height;

    //Setting the background div to the image size
    background.style.width = width + "px";
    background.style.height = height + "px";

    if (scheduleType === "student") {
        return setImage(IDType, width, height);
    }
    else if (scheduleType === "room") {
        ID = roomID;
    }
    else if (scheduleType === "teacher") {
        ID = teacherID;
    }
    else if (scheduleType === "subject") {
        ID = subjectID;
    }
    setImage(ID, width, height);

};

var setImage = function (ID, width, height) {
    if (typeof ID !== "undefined") {
        //Returns the image
        var url = "http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=" + schoolID + "/sv-se&type=-1&id=" + ID + "&period=&week=" + week + "&mode=1&printer=0&colors=32&head=0&clock=1&foot=0&day=" + today + "&width=" + width + "&height=" + height + "&maxwidth=" + width + "&maxheight=" + height;

        background.style.backgroundImage = 'url(' + url + ')';
    }
    else {
        setTimeout(function () {
            setImage(ID, width, height);
        }, 200);
    }
}

//Function to toggle between displaying and hiding the settings
var togglePopup = function (toggle, div) {
    if (div.id === "settings") {
        about.style.display = "none";
    }
    else if (div.id === "about") {
        settings.style.display = "none";
    }

    if (toggle === 1) {
        popupVisible = true;
        div.style.display = "block";

        //Getting the width of the settings window
        var divStyle = getComputedStyle(div);
        var divWidth = divStyle.getPropertyValue("width");

        //Setting the settings window to the middle of the screen
        div.style.left = (window.innerWidth - divWidth.substring(0, divWidth.length - 2)) / 2 + "px";
        div.style.top = (Math.round((headerHeight / window.innerHeight) * 100) + 1.8) + "vh";
        background.style.webkitFilter = "blur(2px)"; //Blurring the background
    }

    else if (toggle === 0) {
        popupVisible = false;
        div.style.display = "none";
        background.style.webkitFilter = "blur(0)";
    }
};

//What happens when the Verkställ button is pressed, or the navigation keys/swipes are pressed/swiped
var submitSettings = function (direction) {
    //Saving text fields to variables
    schoolID = document.getElementById("schoolID").value;
    userID = document.getElementById("userID").value;
    classID = document.getElementById("classID").value;

    roomID = document.getElementById("roomID").value;

    teacherName = document.getElementById("teacherID").value;
    teacherID = teacherName.substring(teacherName.indexOf("(") + 1, teacherName.length - 1);

    subjectID = document.getElementById("subjectID").value;

    changeOptions(scheduleType + "Radio");

    if (scheduleType === "student") {
        //Checks if the year in the userID is written using four numbers, and if so, decreases it to two numbers
        if (userID.length > 11) {
            userID = userID.substring(2, userID.length);
            document.getElementById("userID").value = userID;
        }

        //Checks if the userID has a dash in it, and if not, it adds one
        if (userID.substring(userID.length - 5, userID.length - 4) !== "-" && userID != "") {
            userID = userID.substring(0, userID.length - 4) + "-" + userID.substring(userID.length - 4, userID.length);
            document.getElementById("userID").value = userID;
        }

        //Converts classID to only uppercase letters
        classID = classID.toUpperCase();
        document.getElementById("classID").value = classID;

        //Checking which radio button is checked, and saving the corresponding id to IDType
        if (document.getElementById("userRadio").checked) {
            IDType = userID;
        } else {
            IDType = classID;
        }
    }

    //Saving the variables to cookies
    for (var i = 0; i < values.length - 1; i++) {
        localStorage.setItem(values[i], window[values[i]]);
        var tempArray = values[i].toUpperCase();
        createCookie(tempArray, window[values[i]], 365);
    }

    //Getting the week from the number field
    week = parseInt(document.getElementById("week").value, 10);

    //Getting the day picked, and checking what index it has in the days array
    var dayPickedTagged = document.getElementById("dayPicker").innerHTML,
        dayPicked = dayPickedTagged.substring(3, dayPickedTagged.length - 4),
        dayIndex = days.indexOf(dayPicked);

    //Changing the days/weeks viewed based on what key is pressed or what direction a swipe is in
    if (direction === 37 || direction === "left") {
        dayIndex -= 1;

        if (dayIndex < 0) {
            week -= 1;
            dayIndex = 5;
        }
    } else if (direction === 38 || direction === "up") {
        week += 1;
        dayIndex += daysAdded;
    } else if (direction === 39 || direction === "right") {
        dayIndex += 1;

        if (dayIndex > 5) {
            week += 1;
            dayIndex = 0;
        }
    } else if (direction === 40 || direction === "down") {
        week -= 1;
        dayIndex += daysAdded;
    }

    //If the day isn't the week view, then set the view to that day
    if (dayIndex != 5) {
        today = Math.pow(2, dayIndex);
    } else { //Else, set the view to the week view
        today = 0;
    }

    //Updating the settings to the new values
    document.getElementById("dayPicker").innerHTML = "<p>" + days[dayIndex] + "</p>";
    document.getElementById("week").value = week;
    week = week.toString();

    currentDay = days[dayIndex];

    //If the chosen view is a day, and the chosen week has food descriptions, then show the food bar
    if (dayIndex < 5 && foodWeeks.indexOf(week) != -1) {
        header.style.height = "12vh";
        foodElement.style.display = "block";
        background.style.marginTop = "12vh";
        foodElement.innerHTML = "<p>" + food[week][days[dayIndex]] + "</p>";
    } else { //Else, hide the food bar
        header.style.height = "6vh";
        foodElement.style.display = "none";
        background.style.marginTop = "6vh";
        foodElement.innerHTML = "";
    }

    //Set the background image to the schedule
    getImage();
    progressBar();

    //Hide the settings window
    togglePopup(0, settings);
};

var changeOptions = function (button) {
    var id = "." + button.substring(0, button.length - 5) + "Options";

    $(".studentOptions").css("display", "none");
    $(".roomOptions").css("display", "none");
    $(".teacherOptions").css("display", "none");
    $(".subjectOptions").css("display", "none");

    $(id).css("display", "block");

    scheduleType = button.substring(0, button.length - 5);
}

var parseSearchResults = function (data, id) {
    var searchResult = data.trim(),
        searchArray = searchResult.split(",");

    for (var i = 0; i < searchArray.length; i++) {
        if (searchArray[i] === "") {
            searchArray.splice(i, 1);
        }
    }

    fixChars(searchArray);

    if ($("." + id + "Search").length >= 1) {
        $("." + id + "Search").remove();
    }

    $("." + id).append($('<ul></ul>').addClass("searchResults " + id + "Search"));

    for (var i = 0; i < searchArray.length; i++) {
        $("." + id + "Search").append($('<li>' + searchArray[i] + '</li>').addClass("clickable searchResult").attr("id", searchArray[i]));
    }
}

//Adding event listeners for different events
var eventListeners = function () {
    //If the window is resized, update the background image, and show the settings again if they were visible
    window.addEventListener("resize", function () {
        if (is_touch_device) {
            var oldOrientation = screenOrientation,
                newOrientation = ($(window).width() > $(window).height())? 90 : 0;

            if (newOrientation !== oldOrientation) {
                screenOrientation = newOrientation;

                if (popupVisible) {
                    togglePopup(1, settings);
                }
                getImage();
            }
        }
        else {
            if (popupVisible) {
                togglePopup(1, settings);
            }
            getImage();
        }
    });

    //Checking if the client has a touch screen
    var textFields = document.getElementsByClassName("mdl-textfield__input"), //Save all text field elements to an array
        radioButtons = document.getElementsByClassName("mdl-radio__button"),
        searchFields = ["#roomID", "#teacherID", "#subjectID"];


    //If so, check for touchstart/end events instead of click events
    if (is_touch_device) {
        swipedetect(background, function (swipedir) {
            if (swipedir != "none") {
                submitSettings(swipedir);
            }
        });
    }

    for (var i = 0; i < searchFields.length; i++) {
        $(searchFields[i]).keyup(function (event) {
            $.post("search_sql.php", {
                data: event.target.value,
                table: event.target.id.substring(0, event.target.id.length - 2) + "s"
            }, function (data) {
                var id = event.target.id;

                id = id.substring(0, id.length - 2);
                id = id + "Options";

                parseSearchResults(data, id);
            });
        });
    }

    //Change the view based on which navigation key was pressed
    $(window).keydown(function (event) {
        if (popupVisible === false) {
            if (Math.abs(event.keyCode - 38.5) <= 1.5) {
                submitSettings(event.keyCode);
            }
        }
    });

    //Show the settings when pressing the settings button
    $("#settingsButton").click(function () {
        togglePopup(1, settings);
    });

    $("#aboutButton").click(function () {
        togglePopup(1, about);
    })

    //Enable clicking on the days in the drop-down menu
    for (var i = 0; i < days.length; i++) {
        $("#" + days[i]).click(function (event) {
            document.getElementById("dayPicker").innerHTML = "<p>" + event.target.id + "</p>";
        });
    }

    for (var i = 0; i < radioButtons.length - 2; i++) {
        $(radioButtons[i]).click(function (event) {
            changeOptions(event.target.id);
        });
    }

    $('body').on("click", ".searchResult", function (event) {
        var id = event.target.id,
            fieldID = scheduleType + "ID",
            field = document.getElementById(fieldID),
            name = event.target.innerHTML;

        id = id.substring(id.indexOf("(") + 1, id.length - 1);
        field.value = name;
        field.setAttribute("name", id);
    });

    //If enter is pressed while one of the textfields are edited, submit the settings
    for (var i = 0; i < textFields.length; i++) {
        $(textFields[i]).keydown(function (event) {
            if (event.keyCode === 13) {
                submitSettings(0);
            }
        });
    }


    //If escape is pressed while the settings window is visible, hide the settings window
    $(window).keydown(function (event) {
        if (popupVisible && event.keyCode === 27) {
            togglePopup(0, settings);
            togglePopup(0, about);
        }
    });

    //Submit settings when pressing the submit button
    $("#submitSettings").click(function () {
        submitSettings(0);
    });

    //Hide the settings window when pressing the cancel button
    $("#cancelSettings").click(function () {
        togglePopup(0, settings);
    });
};

//Function for detecting swipes and their direction
function swipedetect(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        threshold = 100, //Required min distance traveled to be considered swipe
        restraint = 100, //Maximum distance allowed at the same time in perpendicular direction
        allowedTime = 500, //Maximum time allowed to travel that distance
        startTime,
        handleswipe = callback || function (swipedir) {};

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0],
            dist = 0;

        swipedir = 'none';
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); //Record time when finger first makes contact with surface
        e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault(); //Prevent scrolling when inside div
    }, false);

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0],
            distX = touchobj.pageX - startX, //Get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY, //Get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; //Get time elapsed

        if (elapsedTime <= allowedTime) { //First condition for a swipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { //Second condition for horizontal swipe met
                swipedir = (distX < 0) ? 'right' : 'left'; //If dist traveled is negative, it indicates left swipe
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { //Second condition for vertical swipe met
                swipedir = (distY < 0) ? 'down' : 'up'; //If dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir);
        e.preventDefault();
    }, false);
};

//Update the SQL-database with the data from the matsedel RSS-feed, should only be run once a week
var parseRSS = function () {
    var currentWeek = (new Date()).getWeek(),
        weeksStored = currentWeek - 34; //Checking how many weeks has passed since the first week that's been stored

    primaryKey = (weeksStored * 5); //Changing the primary key based on weeks stored, to allow new weeks to be added after the old ones

    //Getting the data from the proxy_file.php file
    $.post("proxy_file.php", {
        db: schoolID
    }, function (data) {
        $(data).find("item").each(function () { //Looping for every item element in the data
            var el = $(this); //Setting el to the found element

            //Saving the contents of the item element to an array
            var title = el.find("title").text(),
                titleItems = title.split(" "),
                foodWeek = parseInt(titleItems[3]), //Saving the week and day of the array to variables
                foodDay = titleItems[0];

            //Saving the description of the food to a variable
            var foodDescFull = el.find("description").text();

            //If the description contains a line break, then remove the part before the line break
            if (foodDescFull.indexOf("<br/>") !== -1) {
                foodDescFull = foodDescFull.substring(foodDescFull.indexOf("<br/>") + 5, foodDescFull.length);
            }

            //Removing spaces between eventual parentheses in the description
            if (foodDescFull.indexOf("( ") !== -1) {
                foodDescFull = foodDescFull.replace("( ", "(");
                foodDescFull = foodDescFull.replace(" )", ")");
            }

            //Removing space after eventual forward slash
            if (foodDescFull.indexOf("/ ") !== -1) {
                foodDescFull = foodDescFull.replace("/ ", "/");
            }

            //Trimming away whitespace from the description
            var foodDesc = foodDescFull.trim();

            //Sending the variables to the store_foods.php file
            $.post('store_foods.php', {
                week: foodWeek,
                day: foodDay,
                desc: foodDesc,
                key: primaryKey,
                db: schoolID
            });

            //Increase the value of the primary key with 1
            primaryKey += 1;
        });
    });
};

//Function to get the foods from the SQL-database
var getFoods = function () {
    //Gets the food data from the get_foods.php file
    $.post("get_foods.php", {
        db: schoolID
    }, function (data) {
        if (data === "no_table") {
            parseRSS();
        }

        foodData = data.match(/[^\r\n]+/g); //Splits the string into lines, and saves them to the foodData array

        //Fixes broken characters
        fixChars(foodData);

        for (var i = 0; i < foodData.length; i++) {
            //Splits the line into an array of words
            var foodDataSplit = foodData[i].split(" ");

            //Adds the first word to the foodWeeks object
            if (foodDataSplit[0] !== "") {
                foodWeeks[foodDataSplit[0]] = true;
            }

            //Removes the first word in the array
            foodDataSplit.shift();

            //Adds the new first word to the foodDays object
            if (foodDataSplit[0] !== "") {
                foodDays[foodDataSplit[0]] = true;
            }

            //Removes the first word in the array
            foodDataSplit.shift();

            //Join all the unremoved words together as a string again and remove the leading and trailing character
            var foodDesc = foodDataSplit.join(" ");
            foodDesc = foodDesc.substring(1, foodDesc.length - 1);

            //Push description to the foodDescs array
            foodDescs.push(foodDesc);
        }

        //Converting the foodWeeks and foodDays objects to arrays
        foodWeeks = Object.keys(foodWeeks);
        foodDays = Object.keys(foodDays);

        //Iterate over the foodDays and foodWeeks arrays, and append them to the food object
        for (var x = 0; x < foodDays.length; x++) {
            for (var y = 0; y < foodWeeks.length; y++) {
                foodDay = foodDays[x];
                food[foodWeeks[y]] = {
                    foodDay: null
                };
            }
        }

        //Iterate the foodDescs and foodWeeks arrays, and append the descriptions to the days in the food object
        for (var i = 0; i < foodDays.length; i++) {
            for (var x = 0; x < foodWeeks.length; x++) {
                food[foodWeeks[x]][foodDays[i]] = foodDescs[i + (5 * x)];
            }
        }
        //Update the view
        submitSettings();
    });
};

//Run all necessary functions before viewing the page
setDefaultValues();
displayDefaultValues();
getFoods();
eventListeners();

//Adds method for getting week number
Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

//Adds method for getting day of the week, where the first day of the week is Monday instead of Sunday
Date.prototype.getActualDay = function () {
    return (this.getDay() + 6) % 7;
}

//Adding default variables and values
var header = document.getElementById("header"),
    foodElement = document.getElementById("food"),
    background = document.getElementById("schedule"),
    settings = document.getElementById("settings"),
    days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Vecka"],
    settingsVisible = false,
    weeksAdded = 0,
    daysAdded = 0,
    foodWeeks = {},
    foodDays = {},
    foodDescs = [],
    food = {},
    primaryKey = 0;

//Function to create a cookie
var createCookie = function (name, value, days) {
    if (days) { //If days is defined, create regular cookie
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {    //Else, create session cookie only
        var expires = " ";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

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
    return null;    //If cookie doesn't exist, return null
}

//Updating the values with the ones stored in cookies or localstorage, as well as adding the current week and day
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

    //Ensures the proper radio button is checked
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
    today = Math.pow(2, (new Date()).getActualDay()); //Get today in 2^x format, in order to work with schedule generator

    //If the current day is a weekday, then set the displayed day to monday next week
    if (today >= 32) {
        today = 1;
        week += 1;
    } else {
        //Else, set week to current week
        week = parseInt(week);
    }
}

//Update the values of the settings with the stored values
var displayDefaultValues = function () {
    document.getElementById("schoolID").value = schoolID;
    document.getElementById("userID").value = userID;
    document.getElementById("classID").value = classID;
    document.getElementById("week").value = week;
    document.getElementById("dayPicker").innerHTML = "<p>" + days[Math.log2(today)] + "</p>";
}

//Getting the image from the schedule generator
var getImage = function (ID) {
    //Getting the height of the header
    var header = document.getElementById("header"),
        headerStyle = getComputedStyle(header),
        headerHeight = headerStyle.getPropertyValue('height');

    //Setting the dimensions of the image to the width of the window, and the height to the height of the window - the height of the header
    var width = window.innerWidth,
        height = window.innerHeight - Math.round(headerHeight.substring(0, headerHeight.length - 2));

    //Setting the background div to the image size
    background.style.width = width;
    background.style.height = height;

    //Returns the image
    return "http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=" + schoolID + "/sv-se&type=-1&id=" + ID + "&period=&week=" + week + "&mode=1&printer=0&colors=32&head=0&clock=1&foot=0&day=" + today + "&width=" + width + "&height=" + height + "&maxwidth=" + width + "&maxheight=" + height;
}

//Function to toggle between displaying and hiding the settings
var toggleSettings = function (toggle) {
    if (toggle === 1) {
        settingsVisible = true;
        settings.style.display = "block";

        //Getting the width of the settings window
        settingsStyle = getComputedStyle(settings);
        settingsWidth = settingsStyle.getPropertyValue("width");

        //Setting the settings window to the middle of the screen
        settings.style.left = (window.innerWidth - settingsWidth.substring(0, settingsWidth.length - 2)) / 2;
        background.style.webkitFilter = "blur(2px)"; //Blurring the background
    } else if (toggle === 0) {
        settingsVisible = false;
        settings.style.display = "none";
        background.style.webkitFilter = "blur(0)";
    }
}

//What happens when the Verkställ button is pressed, or the navigation keys/swipes are pressed/swiped
var submitSettings = function (direction) {
    //Saving text fields to variables
    schoolID = document.getElementById("schoolID").value;
    userID = document.getElementById("userID").value;
    classID = document.getElementById("classID").value;

    //Checking which radio button is checked, and saving the corresponding id to IDType
    if (document.getElementById("userRadio").checked) {
        IDType = userID;
    } else {
        IDType = classID;
    }

    //Saving the variables to cookies
    createCookie("SCHOOLID", schoolID, 365);
    createCookie("USERID", userID, 365);
    createCookie("CLASSID", classID, 365);
    createCookie("IDTYPE", IDType, 365);

    localStorage.setItem("schoolID", schoolID);
    localStorage.setItem("userID", userID);
    localStorage.setItem("classID", classID);
    localStorage.setItem("IDType", IDType);

    //Getting the week from the number field
    week = parseInt(document.getElementById("week").value, 10);

    //Getting the day picked, and checking what index it has in the days array
    var dayPickedTagged = document.getElementById("dayPicker").innerHTML,
        dayPicked = dayPickedTagged.substring(3, dayPickedTagged.length - 4),
        dayIndex = days.indexOf(dayPicked);

    //Changing the days/weeks viewed based on what key is pressed or what direction a swipe is in
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
    background.style.backgroundImage = "url(" + getImage(IDType) + ")";

    //Hide the settings window
    toggleSettings(0);
}

//Adding event listeners for different events
var eventListeners = function () {
    //If the window is resized, update the background image, and show the settings again if they were visible
    window.addEventListener("resize", function () {
        if (settingsVisible) {
            toggleSettings(1);
        }

        background.style.backgroundImage = "url(" + getImage(IDType) + ")";
    });

    //Checking if the client has a touch screen
    var is_touch_device = 'ontouchstart' in document.documentElement;

    //If so, check for touchstart/end events instead of click events
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
    } else { //If the client doesn't have a touch screen, check for click events instead of touchstart/end events
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
}

//Function for detecting swipes and their direction
function swipedetect(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 100, //Required min distance traveled to be considered swipe
        restraint = 100, //Maximum distance allowed at the same time in perpendicular direction
        allowedTime = 500, //Maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {}

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
        var touchobj = e.changedTouches[0];

        distX = touchobj.pageX - startX; //Get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; //Get vertical dist traveled by finger while in contact with surface
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
}

//Update the SQL-database with the data from the matsedel RSS-feed
var parseRSS = function () {
    var currentWeek = (new Date()).getWeek();
    var weeksStored = currentWeek - 40; //Checking how many weeks has passed since the first week that's been stored

    primaryKey = (weeksStored * 5); //Changing the primary key based on weeks stored, to allow new weeks to be added after the old ones

    //Getting the data from the proxy_file.php file
    $.get("proxy_file.php", function (data) {
        $(data).find("item").each(function () { //Looping for every item element in the data
            var el = $(this);   //Setting el to the found element
            var foodData;

            //Saving the contents of the item element to an array
            var title = el.find("title").text();
            var titleItems = title.split(" ");

            //Saving the week and day of the array to variables
            var foodWeek = parseInt(titleItems[3]);
            var foodDay = titleItems[0];

            //Saving the description of the food to a variable
            var foodDescFull = el.find("description").text();

            //If the description contains a line break, then remove the part before the line break
            if (foodDescFull.indexOf("<br/>") !== -1) {
                foodDescFull = foodDescFull.substring(foodDescFull.indexOf("<br/>") + 5, foodDescFull.length);
            }

            //Trimming away whitespace from the description
            var foodDesc = foodDescFull.trim();

            //Sending the variables to the store_foods.php file
            $.post('store_foods.php', {
                week: foodWeek,
                day: foodDay,
                desc: foodDesc,
                key: primaryKey
            });

            //Increase the value of the primary key with 1
            primaryKey += 1;
        });
    });
}

//Function to get the foods from the SQL-database
var getFoods = function () {
    //Gets the food data from the get_foods.php file
    $.get("get_foods.php", function (data) {
        foodData = data.match(/[^\r\n]+/g); //Splits the string into lines, and saves them to the foodData array
        for (var i = 0; i < foodData.length; i++) {
            foodData[i] = foodData[i].replace("Ã¥", "å");   //Fixes broken Swedish characters
            foodData[i] = foodData[i].replace("Ã¥", "å");
            foodData[i] = foodData[i].replace("Ã¤", "ä");
            foodData[i] = foodData[i].replace("Ã¶", "ö");
            foodData[i] = foodData[i].replace("Ã©", "é");
            foodData[i] = foodData[i].replace("Ã¶", "ö");
            foodData[i] = foodData[i].replace("Ã¤", "ä");

            //Splits the line into words
            var foodDataSplit = foodData[i].split(" ");

            //Adds the first word to the foodWeeks set
            if (foodDataSplit[0] != "") {
                foodWeeks[foodDataSplit[0]] = true;
            }

            //Removes the first word
            foodDataSplit.shift();

            //Adds the first word to the foodDays set
            if (foodDataSplit[0] != "") {
                foodDays[foodDataSplit[0]] = true;
            }

            //Removes the first word
            foodDataSplit.shift();

            //Join all the unremoved words together as a string again and remove the leading and trailing character
            var foodDesc = foodDataSplit.join(" ");
            foodDesc = foodDesc.substring(1, foodDesc.length - 1);

            //If the description isn't a tab character, then push the description to the foodDescs array
            if (foodDesc != "      ") {
                foodDescs.push(foodDesc);
            }
        }

        //Converting the foodWeeks and foodDays sets to arrays
        foodWeeks = Object.keys(foodWeeks);
        foodDays = Object.keys(foodDays);

        //Iterate over the foodDays and foodWeeks arrays, and append them to the food object
        for (var x = 0; x < foodDays.length; x++) {
            for (var y = 0; y < foodWeeks.length; y++) {
                foodDay = foodDays[x];
                food[foodWeeks[y]] = {
                    foodDay: null
                }
            }
        }

        //Iterate the foodDescs and foodWeeks arrays, and append the descriptions to the days in the food object
        for (var i = 0; i < 5; i++) {
            for (var x = 0; x < foodWeeks.length; x++) {
                food[foodWeeks[x]][foodDays[i]] = foodDescs[i + (5 * x)];
            }
        }
        //Update the view
        submitSettings();
    });
}

//Run all necessary functions before viewing the page
setDefaultValues();
displayDefaultValues();
getFoods();
background.style.backgroundImage = "url(" + getImage(IDType) + ")";
eventListeners();

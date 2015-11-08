<?php

ini_set("default_charset", 'utf-8');

//Gets pass from ignored text file
$pass = rtrim(file_get_contents("sql_pass.txt"));

//Set proper header to reduce broken characters
header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

//Connect to the SQL-database
$con = mysqli_connect("mysql513.loopia.se", "98anve32@k132604", $pass, "kodlabb_se_db_6_db_7_db_2_db_13");

//Set the correct charset
mysqli_set_charset($con,"utf8mb4");

//If the server failed to connect, echo an error message
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$query = "SELECT Name FROM schools";
$foods = array();

$times = 0;

//Run the query, and save the results in an object
if ($result = mysqli_query($con, $query)) {
    while ($object = mysqli_fetch_object($result)) {
        $school = $object->Name;

        $hasArguments = false;

        if (strpos($school, "(") !== false) {
            $hasArguments = true;
        }
        else if (strpos($school, "[") !== false) {
            $hasArguments = true;
        }

        if ($hasArguments) {
            if (strpos($school, ",") === false && strpos($school, "[") !== false) {
                $charPos = strpos($school, "[");
                $firstChar = "[";
                $lastChar = "]";
            }
            else {
                $charPos = strpos($school, "(");
                $firstChar = "(";
                $lastChar = ")";
            }

            echo "Char Pos: " . $charPos . "\n";
            echo "First Char: " . $firstChar . "\n";

            $length = strlen($school);

            $mainPart = substr($school, 0, $length - ($length - $charPos));

            $arguments = str_replace($mainPart, "", $school);

            if (strpos($school, ",") !== false) {
                $arguments = explode(",", $arguments);

                $arguments[0] = trim($arguments[0], "\(\)");
                $arguments[1] = trim($arguments[1], "\[\]");

                echo "Main part: " . $mainPart . "\n";
                echo "Argument 1: " . $arguments[0] . "\n";
                echo "Argument 2: " . $arguments[1] . "\n";

                $school = $mainPart . $arguments[1];

                echo "School: " . $school . "\n\n";
            }
            else {
                if (strpos($arguments, "(") !== false) {
                    $school = $mainPart;
                }
                else {
                    $arguments = trim($arguments, $firstChar);
                    $arguments = trim($arguments, $lastChar);

                    $school = $mainPart . $arguments;
                }

                echo "Main part: " . $mainPart . "\n";
                echo "Argument 1: " . $arguments . "\n";
            }

            echo "School: " . $school . "\n\n";
        }

        $school = mb_strtolower($school, "UTF-8");

        $specialChars = ["å", "ä", "ö", "é", "è", " & ", " ", "/"];
        $replaceChars = ["a", "a", "o", "e", "", "-", "-", "-"];

        $school = str_replace($specialChars, $replaceChars, $school);

        $school = trim($school);

        echo "Final School: " . $school . "\n\n";

        if (@file_get_contents("http://meny.dinskolmat.se/$school/rss/") !== false) {
            $foods[$times] = file_get_contents("http://meny.dinskolmat.se/$school/rss/");
        }

        $times += 1;
    }

    //Frees the memory used for saving the result
    mysqli_free_result($result);
}

//Close the connection
mysqli_close($con);

?>

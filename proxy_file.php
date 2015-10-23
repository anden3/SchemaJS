<?php

ini_set("default_charset", 'utf-8');

//Set proper header to reduce broken characters
header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

//Gets pass from ignored text file
$pass = rtrim(file_get_contents("sql_pass.txt"));

//Connect to the SQL-database
$con = mysqli_connect("mysql513.loopia.se", "98anve32@k132604", $pass, "kodlabb_se_db_6_db_7_db_2_db_13");

//Set the correct charset
mysqli_set_charset($con,"utf8mb4");

//If the server failed to connect, echo an error message
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$stmt = mysqli_prepare($con, "SELECT Name FROM schools WHERE ID = ?");

if ($_POST) {
    $db = $_POST['db'];

    $testQuery = "SHOW TABLES LIKE 'food_$db'";
    $testResult = mysqli_query($con, $testQuery);

    if (mysqli_num_rows($testResult) < 1) {
        $createQuery = "CREATE TABLE food_$db (
        Week INT(11) NOT NULL,
        Day TINYTEXT NOT NULL,
        Mat TINYTEXT,
        PrimaryKey INT(255) NOT NULL PRIMARY KEY
        );";

        mysqli_query($con, $createQuery);
    }

    mysqli_stmt_bind_param($stmt, "i", $db);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $Name);

    while (mysqli_stmt_fetch($stmt)) {
        $school = sprintf("%s\n", $Name);
    }

    $school = mb_strtolower($school, "UTF-8");

    $replace = ["å", "ä", "ö", " "];
    $with = ["a", "a", "o", "-"];

    $school = str_replace($replace, $with, $school);

    $school = trim($school);

    echo file_get_contents("http://meny.dinskolmat.se/$school/rss/");

    mysqli_stmt_close($stmt);
}

?>

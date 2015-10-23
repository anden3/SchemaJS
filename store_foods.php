<?php

ini_set("default_charset", 'utf-8');

//Gets pass from ignored text file
$pass = rtrim(file_get_contents("sql_pass.txt"));

//If the file receives a POST request
if ($_POST) {
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

    //Save the sent variables to local variables
    $week = $_POST['week'];
    $day = $_POST['day'];
    $desc = $_POST['desc'];
    $key = $_POST['key'];
    $db = $_POST['db'];

    //Escape the variables to stop SQL-injection attack
    $week = mysqli_real_escape_string($con, $week);
    $day = mysqli_real_escape_string($con, $day);
    $desc = mysqli_real_escape_string($con, $desc);
    $key = mysqli_real_escape_string($con, $key);

    //Save the SQL-query as a string
    $query = "INSERT INTO food_$db (Week, Day, Mat, PrimaryKey)
    VALUES ('$week', '$day', '$desc', '$key')";

    //Insert variables into the food table, and if it failed, kill the connection
    if (!mysqli_query($con, $query)) {
        die('Error: ' . mysqli_error($con));
    }

    //Close the connection
    mysqli_close($con);
}

?>

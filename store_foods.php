<?php

$pass = file("sql_pass.txt")[0];

//If the file receives a POST request
if ( $_POST ) {
    //Set proper header to reduce broken characters
    header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

    //Connect to the SQL-database
    $con = mysqli_connect("localhost", "root", $pass, "matsedel");

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

    //Escape the variables to stop SQL-injection attack
    $week = mysqli_real_escape_string($con, $week);
    $day = mysqli_real_escape_string($con, $day);
    $desc = mysqli_real_escape_string($con, $desc);
    $key = mysqli_real_escape_string($con, $key);

    //Save the SQL-query as a string
    $sql = "INSERT INTO food (Week, Day, Mat, PrimaryKey)
    VALUES ('$week', '$day', '$desc', '$key')";

    //Insert variables into the food table, and if it failed, kill the connection
    if (!mysqli_query($con, $sql)) {
        die('Error: ' . mysqli_error($con));
    }

    //Close the connection
    mysqli_close($con);
}

?>

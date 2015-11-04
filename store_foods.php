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

$stmt = mysqli_prepare($con, "INSERT INTO food (School, Week, Day, Mat, ID) VALUES (?, ?, ?, ?, ?)");

//If the file receives a POST request
if ($_POST) {
    //Save the sent variables to local variables
    $school = $_POST['school'];
    $week = $_POST['week'];
    $day = $_POST['day'];
    $desc = $_POST['desc'];
    $id = uniqid();

    mysqli_stmt_bind_param($stmt, "sisss", $school, $week, $day, $desc, $id);
    mysqli_stmt_execute($stmt);

    echo mysqli_error($con);

    //Close the connection
    mysqli_close($con);
}

?>

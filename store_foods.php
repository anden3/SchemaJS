<?php

if ( $_POST ) {
    header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

    $con = mysqli_connect("localhost", "root", "HU6oeiUWpkQ3j0Yssg8X", "matsedel");

    mysqli_set_charset($con,"utf8mb4");

    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $week = $_POST['week'];
    $day = $_POST['day'];
    $desc = $_POST['desc'];
    $key = $_POST['key'];

    $week = mysqli_real_escape_string($con, $week);
    $day = mysqli_real_escape_string($con, $day);
    $desc = mysqli_real_escape_string($con, $desc);
    $key = mysqli_real_escape_string($con, $key);

    $sql = "INSERT INTO food (Week, Day, Mat, PrimaryKey)
    VALUES ('$week', '$day', '$desc', '$key')";

    if (!mysqli_query($con, $sql)) {
        die('Error: ' . mysqli_error($con));
    }

    mysqli_close($con);
}

?>

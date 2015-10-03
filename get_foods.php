<?php

header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

$con = mysqli_connect("localhost", "root", "HU6oeiUWpkQ3j0Yssg8X", "matsedel");

mysqli_set_charset($con,"utf8mb4");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$query = "SELECT * FROM food";
if ($result = mysqli_query($con, $query)) {
    while ($object = mysqli_fetch_object($result)) {
        printf("%s %s (%s)\n",$object->Week,$object->Day,$object->Mat);
    }
    mysqli_free_result($result);
}

mysqli_close($con);

echo $object;

?>

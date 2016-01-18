<?php

ini_set("default_charset", 'utf-8');
header('Content-Type: text/plain; charset=utf-8');
date_default_timezone_set("Europe/Stockholm");

$year = date("Y");
$pass = rtrim(file_get_contents("sql_pass.txt"));
$con = mysqli_connect("mysql513.loopia.se", "98anve32@k132604", $pass, "kodlabb_se_db_6_db_7_db_2_db_13");

mysqli_set_charset($con,"utf8mb4");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($_POST) {
    $school = $_POST['school'];
    $query = "SELECT * FROM food WHERE School = $school AND Year = $year ORDER BY Week ASC, FIELD(Day, 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag');";

    if ($result = mysqli_query($con, $query)) {
        while ($object = mysqli_fetch_object($result)) {
            printf("%s %s (%s)\n",$object->Week,$object->Day,$object->Mat);
        }

        //Frees the memory used for saving the result
        mysqli_free_result($result);
    }

    //Echo the object
    echo json_encode($object);
}

//Close the connection
mysqli_close($con);

?>

<?php

//Set proper header to reduce broken characters
header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

//Gets pass from ignored text file
$pass = rtrim(file_get_contents("sql_pass.txt"));

//Connect to the SQL-database
$con = mysqli_connect("localhost", "root", $pass, "matsedel");

//Set the correct charset
mysqli_set_charset($con,"utf8mb4");

//If the server failed to connect, echo an error message
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Save the SQL-query as a string
$query = "SELECT * FROM food";

//Run the query, and save the results in an object
if ($result = mysqli_query($con, $query)) {
    while ($object = mysqli_fetch_object($result)) {
        printf("%s %s (%s)\n",$object->Week,$object->Day,$object->Mat);
    }

    //Frees the memory used for saving the result
    mysqli_free_result($result);
}

//Close the connection
mysqli_close($con);

//Echo the object
echo $object;

?>

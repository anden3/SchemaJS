<?php

//Gets pass from ignored text file
$pass = rtrim(file_get_contents("sql_pass.txt"));

if ( $_POST ) {
    //Set proper header to reduce broken characters
    header('Content-Type: text/html; charset=utf8mb4_swedish_ci');

    //Connect to the SQL-database
    $con = mysqli_connect("mysql513.loopia.se", "98anve32@k132604", $pass, "kodlabb_se_db_6_db_7_db_2_db_13");

    //Set the correct charset
    mysqli_set_charset($con, "utf8mb4");

    //If the server failed to connect, echo an error message
    if (mysqli_connect_errno()) {
        echo "error";
    }

    //Save the sent variables to local variables
    $initials = $_POST['teacher'];
    $initials = mysqli_real_escape_string($con, $initials);

    //Save the SQL-query as a string
    $query = "SELECT ID FROM teachers
    WHERE UPPER(Initials) LIKE UPPER('$initials')";

    //Run the query, and save the results in an object
    if ($result = mysqli_query($con, $query)) {
        $row = mysqli_fetch_assoc($result);

        echo $row['ID'];

        //Frees the memory used for saving the result
        mysqli_free_result($result);
    }
    else {
        echo "error";
    }

    //Close the connection
    mysqli_close($con);
}

?>

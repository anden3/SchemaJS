<?php

ini_set("default_charset", 'UTF-8');

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
    $search = $_POST['data'];
    $search = mb_strtoupper($search, "UTF-8");

    $offset = 0;
    $specialChars = array("Å", "Ä", "Ö", "É", "È", "Ë", "Ü");

    for ($c = 0, $length = count($specialChars); $c < $length; ++$c) {
        if (strpos($search, $specialChars[$c]) !== FALSE) {
            $offset += 1;
        }
    }

    $table = $_POST['table'];

    //Save the SQL-query as a string
    if ($table == "teachers") {
        $query = "SELECT FullName, Name FROM $table
        WHERE '$search' = SUBSTRING(UPPER(FirstName), 1, LENGTH('$search') - '$offset')
        OR '$search' = SUBSTRING(UPPER(LastName), 1, LENGTH('$search') - '$offset')
        OR '$search' = SUBSTRING(UPPER(FullName), 1, LENGTH('$search') - '$offset')
        LIMIT 5";
    }

    else {
        $query = "SELECT Name FROM $table
        WHERE '$search' = SUBSTRING(UPPER(Name), 1, LENGTH('$search') - '$offset')
        LIMIT 5";
    }

    //Run the query, and save the results in an object
    if ($result = mysqli_query($con, $query)) {
        if ($table == "teachers") {
            while ($object = mysqli_fetch_object($result)) {
                printf("%s (%s),",$object->FullName, $object->Name);
            }
        }
        else {
            while ($object = mysqli_fetch_object($result)) {
                printf("%s,",$object->Name);
            }
        }

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

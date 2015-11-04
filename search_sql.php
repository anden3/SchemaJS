<?php

ini_set("default_charset", 'UTF-8');

//Gets pass from ignored text file
$pass = rtrim(file_get_contents("sql_pass.txt"));

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

if ( $_POST ) {
    //Save the sent variables to local variables
    $search = $_POST['data'];
    $search = mb_strtoupper($search, "UTF-8");

    $offset = 0;
    $specialChars = array("Å", "Ä", "Ö", "É", "È", "Ë", "Ü");

    //Fix for special characters appearing as two characters
    for ($c = 0, $length = count($specialChars); $c < $length; ++$c) {
        if (strpos($search, $specialChars[$c]) !== FALSE) {
            $offset += 1;
        }
    }

    $table = $_POST['table'];

    $school = $_POST['school'];

    //Save the SQL-query as a string
    if ($table == "teachers") {
        $stmt = mysqli_prepare($con, "SELECT FullName, Name FROM $table WHERE School = ? AND (? = SUBSTRING(UPPER(FirstName), 1, LENGTH(?) - ?) OR ? = SUBSTRING(UPPER(LastName), 1, LENGTH(?) - ?) OR ? = SUBSTRING(UPPER(FullName), 1, LENGTH(?) - ?)) LIMIT 5");

        mysqli_stmt_bind_param($stmt, "sssississi", $school, $search, $search, $offset, $search, $search, $offset, $search, $search, $offset);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $FullName, $Name);
    }

    else if ($table == "schools") {
        $stmt = mysqli_prepare($con, "SELECT Name, ID, KeyCode FROM $table WHERE ? = SUBSTRING(UPPER(Name), 1, LENGTH(?) - ?) LIMIT 5");

        mysqli_stmt_bind_param($stmt, "ssi", $search, $search, $offset);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $Name, $ID, $Code);
    }

    else {
        $stmt = mysqli_prepare($con, "SELECT Name FROM $table WHERE School = ? AND (? = SUBSTRING(UPPER(Name), 1, LENGTH(?) - ?)) LIMIT 5");

        mysqli_stmt_bind_param($stmt, "sssi", $school, $search, $search, $offset);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $Name);
    }

    //Run the query, and save the results in an object
    if ($table == "teachers") {
        while (mysqli_stmt_fetch($stmt)) {
            printf("%s (%s),", $FullName, $Name);
        }
        mysqli_stmt_close($stmt);
    }
    else if ($table == "schools") {
        while (mysqli_stmt_fetch($stmt)) {
            printf("%s,%s,", $Name, $ID);
        }
    }
    else {
        while (mysqli_stmt_fetch($stmt)) {
            printf("%s,", $Name);
        }
        mysqli_stmt_close($stmt);
    }

    //Close the connection
    mysqli_close($con);
}

?>

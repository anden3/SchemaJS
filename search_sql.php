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

$teacherStmt = mysqli_prepare($con, "SELECT FullName, Name FROM teachers WHERE School = ? AND (FullName LIKE ?) ORDER BY FullName ASC");
$schoolStmt = mysqli_prepare($con, "SELECT Name, ID, KeyCode FROM schools WHERE Name LIKE ? ORDER BY Name ASC");

if ( $_POST ) {
    //Save the sent variables to local variables
    $search = $_POST['data'];
    $search = mb_strtoupper($search, "UTF-8");
    $search = $search . "%";

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
        mysqli_stmt_bind_param($teacherStmt, "ss", $school, $search);
        mysqli_stmt_execute($teacherStmt);
        mysqli_stmt_bind_result($teacherStmt, $FullName, $Name);
    }

    else if ($table == "schools") {
        mysqli_stmt_bind_param($schoolStmt, "s", $search);
        mysqli_stmt_execute($schoolStmt);
        mysqli_stmt_bind_result($schoolStmt, $Name, $ID, $Code);
    }

    else {
        $generalStmt = mysqli_prepare($con, "SELECT Name FROM $table WHERE School = ? AND (Name LIKE ?) ORDER BY Name ASC");

        mysqli_stmt_bind_param($generalStmt, "ss", $school, $search);
        mysqli_stmt_execute($generalStmt);
        mysqli_stmt_bind_result($generalStmt, $Name);
    }

    //Run the query, and save the results in an object
    if ($table == "teachers") {
        while (mysqli_stmt_fetch($teacherStmt)) {
            printf("%s {%s},", $FullName, $Name);
        }
        mysqli_stmt_close($teacherStmt);
    }
    else if ($table == "schools") {
        while (mysqli_stmt_fetch($schoolStmt)) {
            printf("%s,%s,", $Name, $ID);
        }
        mysqli_stmt_close($schoolStmt);
    }
    else {
        while (mysqli_stmt_fetch($generalStmt)) {
            printf("%s,", $Name);
        }
        mysqli_stmt_close($generalStmt);
    }

    //Close the connection
    mysqli_close($con);
}

?>

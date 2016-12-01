<?php

ini_set("default_charset", 'utf-8');
header('Content-Type: text/html; charset=utf8mb4_swedish_ci');
date_default_timezone_set("Europe/Stockholm");

$pass = rtrim(file_get_contents("sql_pass.txt"));
$con = mysqli_connect("mysql513.loopia.se", "98anve32@k132604", $pass, "kodlabb_se_db_6_db_7_db_2_db_13");

$old_days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
$new_days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];

$string_errors = ["( ", " )", " /", "/ ", "  "];
$string_fixes = ["(", ")", "/", "/", " "];

$startWeek = 33;
$endWeek = 52;

$offsetStart = $startWeek - intval(date('W'));
$offsetEnd = $endWeek - intval(date('W'));

echo "Starting week: $startWeek\tEnding week: $endWeek\n";

mysqli_set_charset($con, "utf8mb4");

if (mysqli_connect_errno()) {
    die("Failed to connect to MySQL: " . mysqli_connect_error());
}

$stmt = mysqli_prepare($con, "INSERT INTO food (School, Year, Week, Day, Mat, ID) VALUES (?, ?, ?, ?, ?, ?);");
$query = "SELECT ID, FoodID FROM schools WHERE FoodID IS NOT NULL AND ID = 69040 ORDER BY ID LIMIT 1;";

$t1 = microtime(true);

if ($result = mysqli_query($con, $query)) {
    while ($object = mysqli_fetch_object($result)) {
        $school = $object->ID;
        $foodID = $object->FoodID;

        for ($offset = $offsetStart; $offset <= $offsetEnd; $offset++) {
            $response = json_decode(file_get_contents("http://skolmaten.se/api/3/menu/?school=$foodID&offset=$offset&limit=1&client=web"), true);

            if (array_key_exists('weeks', $response)) {
                foreach ($response['weeks']['0']['days'] as $key => $val) {
                    $year = intval(date('Y', $val['date']));
                    $week = intval(date('W', $val['date']));
                    $weekDay = str_replace($old_days, $new_days, date('D', $val['date']));

                    if (array_key_exists('items', $val)) {
                        $food = trim(str_replace($string_errors, $string_fixes, $val['items']['0']));
                    }
                    else if (array_key_exists('reason', $val)) {
                        $food = trim(str_replace($string_errors, $string_fixes, $val['reason']));
                    }
                    else {
                        continue;
                    }

                    $uuid = md5(serialize([$school, $year, $week, $weekDay, $food]));

                    echo "$school\t$foodID\t$year\t$week\t$weekDay\t\t$food\n";

                    mysqli_stmt_bind_param($stmt, "siisss", $school, $year, $week, $weekDay, $food, $uuid);
                    mysqli_stmt_execute($stmt);

                    if (mysqli_error($con)) {
                        echo "\n" . mysqli_error($con) . "\n\n";
                    }
                }

                echo "\n";
            }
        }

        echo "\n\n";
    }
}

$t2 = microtime(true);

echo "Time taken: " . ($t2 - $t1) . " seconds.\n";

?>

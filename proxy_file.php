<?php

header('Content-type: application/xml');

if ($_POST) {
    $file = "http://meny.dinskolmat.se/" . $file . "/rss/";
}
echo file_get_contents($file);

?>

<?php

header('Content-type: application/xml');
echo file_get_contents("http://meny.dinskolmat.se/elof-lindalvs-gymnasium/rss/");

?>

<?php
    require 'sesh.php';
    unset($SESSION);
    session_destroy();
?>
<?php
$conn = mysqli_connect('localhost', 'root', '', 'Project');
if (!$conn) {
 die('Failed to connect: ' . mysqli_connect_error());
} 
else {
 echo 'Connected successfully!';
}
?>
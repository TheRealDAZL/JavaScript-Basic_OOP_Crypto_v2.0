let listeDeMessages = new Liste()
let elementBtnLibrairie = document.getElementById("afficherLibrairie")
let elementLibrairie = document.getElementById("librairie")
let elementMsgUtilisateur =  document.getElementById("messageUtilisateur")
let elementMsgIntrant = document.getElementById("messageIntrant")
let elementCleSub = document.getElementById("cleIntrantSub")
let elementCleTra = document.getElementById("cleIntrantTra")
let librairie = "0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z (espace) ."
let afficherLibrairie = true
let sensDuChiffrement



listeDeMessages.allerChercherListe()
reinitialiser()

document.getElementById("messageLibrairie").innerHTML = `Instructions :<br>Par défaut, votre message doit absolument faire ` +
    `de 1 à ${librairie.length} caractères de long.<br>Si vous entrez un message de moins de ${librairie.length} caractères, le message sera complété<br>` +
    `automatiquement de façon à faire ${librairie.length} caractères de long.<br>Même chose pour ce qui est des clés, cependant si on ` +
    `laisse les champs vides<br>alors les clés sont générées de façon automatique.<br><br>Par défaut, les caractères autorisés pour ` +
    `le message et les deux clés sont :<br>${librairie.toString()}<br><br>Vous pouvez aussi créer votre propre librairie de caractères,<br>cependant vos clés devront
     être de la même longueur que votre librairie.`

elementBtnLibrairie.onclick = function () { afficherInstructions() }
elementLibrairie.onfocus = function () { compterCaracteres(elementLibrairie.value.toString().length) }
elementMsgIntrant.onfocus = function() { compterCaracteres(elementMsgIntrant.value.toString().length, true) }
elementCleSub.onfocus = function() { compterCaracteres(elementCleSub.value.toString().length) }
elementCleTra.onfocus = function() { compterCaracteres(elementCleTra.value.toString().length) }
elementLibrairie.oninput = function () { compterCaracteres(elementLibrairie.value.toString().length) }
elementMsgIntrant.oninput = function() { compterCaracteres(elementMsgIntrant.value.toString().length, true) }
elementCleSub.oninput = function() { compterCaracteres(elementCleSub.value.toString().length) }
elementCleTra.oninput = function() { compterCaracteres(elementCleTra.value.toString().length) }
document.getElementById("reinitialiser").onclick = function () { elementMsgUtilisateur.classList.add("invisible", "couleurTexte") }
document.getElementById("supprimerTout").onclick = function () {
    // Référence : MDN Web Docs - Window: confirm() method
    // Lien : https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    if (window.confirm("Voulez-vous vraiment supprimer tous ces objets?")) {
        listeDeMessages.supprimerTousLesMessages()
        reinitialiser()
    }
}
document.onsubmit = (event) => {
    event.preventDefault()

    // MDN Web Docs - Conditional (ternary) operator
    // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    document.getElementById("encoder").checked ? sensDuChiffrement = true : sensDuChiffrement = false

    let objetMessage = new Message(listeDeMessages.messages.length, elementMsgIntrant.value.toString(),
        elementCleSub.value.toString(), elementCleTra.value.toString(), sensDuChiffrement,
        elementLibrairie.value.toString())

    listeDeMessages.traiterObjet(objetMessage)
    elementMsgUtilisateur.classList.add("invisible", "couleurTexte")

    document.getElementById("messageExtrant").focus()
}



// Méthode qui affiche ou qui cache la liste des caratères valides
function afficherInstructions() {
    let messageLibrairie = document.getElementById("messageLibrairie")

    if (!afficherLibrairie) {
        elementBtnLibrairie.textContent = "Cacher les instructions"
        messageLibrairie.classList.remove("invisible")
    }

    else {
        elementBtnLibrairie.textContent = "Afficher les instructions"
        messageLibrairie.classList.add("invisible")
    }

    afficherLibrairie = !afficherLibrairie
}

// Méthode qui compte la longueur du string et qui retourne des informations à l'utilisateur
// Cette méthode prend comme argument :
// - un élément qui correspond à un string provenant des données du formulaire;
// - et un message (facultatif) qui correspond à un booléen pour savoir si on évalue le message ou la clé
function compterCaracteres(compteur, message = false) {
    elementMsgUtilisateur.classList.remove("invisible")

    if (compteur < 1) {
        if (message === true) {
            elementMsgUtilisateur.classList.remove("couleurTexte")
            elementMsgUtilisateur.classList.add("erreur")
            elementMsgUtilisateur.textContent = "Vous n'avez pas entré de caractère. Veuillez entrer au moins 1 caractère."
        }
        else {
            elementMsgUtilisateur.classList.add("couleurTexte")
            elementMsgUtilisateur.classList.remove("erreur")
            elementMsgUtilisateur.textContent = "Vous n'avez pas entré de caractère."
        }
    }

    else {
        elementMsgUtilisateur.classList.add("couleurTexte")
        elementMsgUtilisateur.classList.remove("erreur")
        elementMsgUtilisateur.textContent = `Vous avez entré ${compteur} caractère(s).`
    }
}

// Méthode qui réinitialise tous les champs
function reinitialiser() {
    elementMsgUtilisateur.classList.add("invisible", "couleurTexte")
    elementLibrairie.value = ""
    elementMsgIntrant.value = ""
    elementCleSub.value = ""
    elementCleTra.value = ""

    document.getElementById("messageExtrant").value = ""
    document.getElementById("encoder").checked = true
}

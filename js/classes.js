class Message {
    constructor(id, message, cleSubstitution = "", cleTransposition = "", sensDuChiffrement,
                librairie = "", resultat = "") {
        this.id = id
        this.message = message
        this.cleSubstitution = cleSubstitution
        this.cleTransposition = cleTransposition
        this.sensDuChiffrement = sensDuChiffrement
        this.librairie = librairie
        this.resultat = resultat
        this.image = "img/des.jpg"
    }

    // Méthode qui valide la librairie et l'enregistre dans l'objet
    validerLibrairie() {
        if (this.librairie === "") {
            this.librairie = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ."
        }

        for (let i = 0; i < this.librairie.length; i++) {
            if (this.librairie.substring(i + 1).includes(this.librairie[i])) {
                document.getElementById("messageUtilisateur").classList.remove("couleurTexte")
                document.getElementById("messageUtilisateur").classList.add("erreur")
                document.getElementById("messageUtilisateur").textContent = `Votre librairie ne doit pas contenir plus d'une fois le même caractère.`
                throw new Error()
            }
        }
    }

    // Méthode qui valide le message et l'enregistre dans l'objet. Si le message est trop court, on ajoute des caractères
    // à la fin du string, de façon à ce que le message fasse la même longueur que la librairie de caractères
    validerMessage() {
        // Si le message est vide ou trop long, afficher un message d'erreur, puis lancer une erreur
        if (this.message.length < 1 || this.message.length > this.librairie.length) {
            document.getElementById("messageUtilisateur").classList.remove("couleurTexte")
            document.getElementById("messageUtilisateur").classList.add("erreur")
            document.getElementById("messageUtilisateur").textContent = `Votre message doit faire de 1 à ${this.librairie.length} caractères de long.`
            throw new Error()
        }

        // Si le message ne fait pas la même longueur que la librairie, ajouter des caractères à la fin du string, afin que le string fasse
        // exactement la même longueur
        for (let i = this.message.length; i < this.librairie.length; i++) {
            let index = this.randomiser(this.librairie.length)
            this.message = this.message + this.librairie[index].toString()
        }
    }

    // Méthode qui valide la clé et retourne la clé validée. Si la clé est trop courte, on ajoute des caractères
    // à la fin du string, de façon à ce que la clé fasse la même longueur que la librairie
    validerCle(cle) {
        // Si la clé n'est pas vide et qu'elle possède moins ou autant de caractères que la librairie
        if (cle !== "" && cle.length <= this.librairie.length) {
            // Pour chaque caractère de la clé, valider que le caractère fait partie de la librairie
            for (let i = 0; i < cle.length; i++) {
                // Si un des caractères de la clé n'est pas valide, afficher un message d'erreur
                if (!this.librairie.includes(cle[i])) {
                    document.getElementById("messageUtilisateur").classList.remove("couleurTexte")
                    document.getElementById("messageUtilisateur").classList.add("erreur")
                    document.getElementById("messageUtilisateur").innerHTML = `Votre clé contient des caractères invalides. Les caractères valides sont :<br>${this.librairie.toString()}`
                    throw new Error()
                }
            }
        }

        // Si la clé est trop longue, afficher un message d'erreur, puis lancer une erreur
        else if (cle.length > this.librairie.length) {
            document.getElementById("messageUtilisateur").classList.remove("couleurTexte")
            document.getElementById("messageUtilisateur").classList.add("erreur")
            document.getElementById("messageUtilisateur").textContent = `Votre clé contient plus de ${this.librairie.length} caractères.`
            throw new Error()
        }

        // Si la clé ne fait pas la même longueur que la librairie, ajouter des caractères à la fin du string, afin que le string fasse
        // exactement la même longueur
        for (let i = cle.length; i < this.librairie.length; i++) {
            let index = this.randomiser(this.librairie.length)
            cle = cle.toString() + this.librairie[index].toString()
        }

        return cle
    }

    // Méthode qui substitue les caractères du message, en utilisant la clé de substitution, le sens du chiffrement et la librairie
    substituerLesCaracteres(message, sens) {
        let extrant = ""

        for (let i = 0; i < message.length; i++)
        {
            // Pour chaque caractère du message et de la clé de substitution, trouver l'index des caractères dans la librairie
            let indexCaractere1 = this.librairie.indexOf(message[i].toString())
            let indexCaractere2 = this.librairie.indexOf(this.cleSubstitution[i].toString())

            if (indexCaractere1 !== -1)
            {
                let indexCaractereFinal = this.trouverIndexFinal(indexCaractere1, indexCaractere2, sens)

                extrant += this.librairie[indexCaractereFinal].toString()
            }

            // Si le caractère n'y est pas, afficher un message d'erreur, et lancer une erreur
            else
            {
                this.erreurChiffrement()
            }
        }

        this.resultat = extrant.toString()
    }

    // Méthode qui retourne la valeur de l'index final pour la substitution, en utilisant deux index et le sens du chiffrement
    trouverIndexFinal(indexCaractere1, indexCaractere2, sens) {
        if (sens) {
            // Si on a trouvé le caractère dans la librairie, alors additionner les index des deux caractères,
            // puis faire le résultat modulo librairie.length. Finalement, aller chercher le nouveau caractère avec le
            // nouvel index, et le concaténer avec le reste du string
            // Référence : Wikipedia - Caesar cipher
            // Lien : https://en.wikipedia.org/wiki/Caesar_cipher
            return (indexCaractere1 + indexCaractere2) % this.librairie.length
        }

        else {
            // Si on a trouvé le caractère dans la librairie, alors soustraire l'index du deuxième caractère du premier
            // caractère, ensuite lui additionner librairie.length, puis faire le résultat modulo librairie.length. J'additionne
            // librairie.length à la soustraction afin de ne pas avoir de résultats d'une valeur négative, avant d'appliquer le
            // modulo. Finalement, aller chercher le nouveau caractère avec le nouvel index, et le concaténer avec le reste du
            // string
            // Référence : Wikipedia - Caesar cipher
            // Lien : https://en.wikipedia.org/wiki/Caesar_cipher
            return (indexCaractere1 - indexCaractere2 + this.librairie.length) % this.librairie.length
        }
    }

    // Méthode qui transpose les caractères du message, en utilisant la clé de transposition, le sens du chiffrement et la librairie
    transposerLesCaracteres(message, sens) {
        // Référence : MDN Web Docs - Array.from()
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        let extrant = Array.from(message.toString())

        if (sens) {
            for (let indexPosition1 = 0; indexPosition1 < extrant.length; indexPosition1++) {
                extrant = this.echangerPositions(extrant, indexPosition1, this.librairie)
            }
        }

        else {
            for (let indexPosition1 = extrant.length - 1; indexPosition1 >= 0; indexPosition1--) {
                extrant = this.echangerPositions(extrant, indexPosition1, this.librairie)
            }
        }

        // Référence : MDN Web Docs - Array.prototype.join()
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
        this.resultat = extrant.join("")
    }

    // Méthode qui retourne le tableau sous une transposition, en utilisant un index et le string extrant
    echangerPositions(extrant, indexPosition1) {
        let indexPosition2 = this.librairie.indexOf(this.cleTransposition[indexPosition1].toString())

        let indexPositionFinale = (indexPosition1 + indexPosition2) % this.librairie.length

        // Référence : Wikipedia - Fisher–Yates shuffle
        // Lien : https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        let valeurTemp = extrant[indexPositionFinale]
        extrant[indexPositionFinale] = extrant[indexPosition1]
        extrant[indexPosition1] = valeurTemp

        return extrant
    }

    // Méthode pour créer des nombres aléatoires sur mesure
    randomiser(borneSup) {
        return Math.floor(Math.random() * borneSup)
    }

    // Méthode pour gérer les erreurs lors du chiffrement
    erreurChiffrement() {
        document.getElementById("messageUtilisateur").classList.remove("couleurTexte")
        document.getElementById("messageUtilisateur").classList.add("erreur")
        document.getElementById("messageUtilisateur").innerHTML = `Votre message contient des caractères invalides. Les caractères valides sont :<br>${this.librairie.toString()}`
        throw new Error()
    }
}

class Liste {
    constructor(messages = []) {
        this.messages = messages
        this.exemples = [
            {
                "id": 0,
                "message": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleSubstitution" : "0000000000000000000000000000000000000000000000000000000000000000",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : true,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "12x6haze9iBmjqDu5yFClGHKbOJSnWL 34NcpkPsdARIrQTY78VotEXUfgZMvw.0",
                "image" : "img/des.jpg",
            },

            {
                "id": 1,
                "message": "12x6haze9iBmjqDu5yFClGHKbOJSnWL 34NcpkPsdARIrQTY78VotEXUfgZMvw.0",
                "cleSubstitution" : "0000000000000000000000000000000000000000000000000000000000000000",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : false,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "image" : "img/des.jpg"
            },

            {
                "id": 2,
                "message": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0000000000000000000000000000000000000000000000000000000000000000",
                "sensDuChiffrement" : true,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "02468acegikmoqsuwyACEGIKMOQSUWY 02468acegikmoqsuwyACEGIKMOQSUWY ",
                "image" : "img/des.jpg"
            },

            {
                "id": 3,
                "message": "02468acegikmoqsuwyACEGIKMOQSUWY 02468acegikmoqsuwyACEGIKMOQSUWY ",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0000000000000000000000000000000000000000000000000000000000000000",
                "sensDuChiffrement" : false,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "image" : "img/des.jpg"
            },

            {
                "id": 4,
                "message": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : true,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "13z9lfFlhrLxvDRJlPXVF.15zb7hPndtzBjLZVp3Rdvn7xBHTVHbhtNL79THrtZ.",
                "image" : "img/des.jpg"
            },

            {
                "id": 5,
                "message": "13z9lfFlhrLxvDRJlPXVF.15zb7hPndtzBjLZVp3Rdvn7xBHTVHbhtNL79THrtZ.",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : false,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "image" : "img/des.jpg"
            }
        ]
    }

    // Méthode qui effectue le traitement général de l'objet, et qui l'ajoute ensuite à la liste d'es 'objets
    // Cette méthode prend comme arguments :
    // - le message;
    // - deux clés (facultatives);
    // - un sens de chiffrement.
    traiterObjet(objetMessage) {
        objetMessage.validerLibrairie()
        objetMessage.validerMessage()
        objetMessage.cleSubstitution = objetMessage.validerCle(objetMessage.cleSubstitution)
        objetMessage.cleTransposition = objetMessage.validerCle(objetMessage.cleTransposition)

        if (objetMessage.sensDuChiffrement) {
            objetMessage.transposerLesCaracteres(objetMessage.message, objetMessage.sensDuChiffrement)
            objetMessage.substituerLesCaracteres(objetMessage.resultat, objetMessage.sensDuChiffrement)
        }

        else {
            objetMessage.substituerLesCaracteres(objetMessage.message, objetMessage.sensDuChiffrement)
            objetMessage.transposerLesCaracteres(objetMessage.resultat, objetMessage.sensDuChiffrement)
        }

        document.getElementById("librairie").value = ""
        document.getElementById("messageIntrant").value = ""
        document.getElementById("cleIntrantSub").value = ""
        document.getElementById("cleIntrantTra").value = ""
        document.getElementById("encoder").checked = true
        document.getElementById("messageExtrant").value = objetMessage.resultat

        this.ajouterMessage(objetMessage)
    }

    // Méthode qui ajoute l'argument message à la liste d'objets
    ajouterMessage(message) {
        this.messages.push(message)
        this.enregistrerListe()
        this.toString()

        document.getElementById("supprimerTout").disabled = false
    }

    // Méthode qui supprime un message de la liste d'objets, basé sur l'id passé en paramètre. L'argument modifier
    // sert içi à identifier si on modifie un objet, ou si on supprime un objet. Si modifier === true, c'est qu'on modifie
    // l'objet, et sinon alors c'est qu'on supprime l'objet.
    supprimerMessage(id) {
        // Référence : MDN Web Docs - Array.prototype.splice()
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        this.messages.splice(id, 1)

        if (this.messages.length !== 0) {
            let copieTableau = this.messages

            this.supprimerTousLesMessages()

            // Si ce n'est pas égal à 0, ça ne fonctionnera pas comme il le faut
            for (let index = 0; index < copieTableau.length; index++) {
                let objetMessage = new Message(index, copieTableau[index].message, copieTableau[index].cleSubstitution,
                        copieTableau[index].cleTransposition, copieTableau[index].sensDuChiffrement, copieTableau[index].librairie, copieTableau[index].resultat)
                this.ajouterMessage(objetMessage)
            }
        } else {
            this.supprimerTousLesMessages()
        }
    }

    // Méthode qui supprime tous les objets
    supprimerTousLesMessages() {
        this.messages = []
        localStorage.clear()

        document.getElementById("supprimerTout").disabled = true
        document.getElementById("card-container").innerHTML = ""
    }

    // Méthode qui modifie un objet, basé sur l'id passé en paramètre
    modifierMessage(id) {
        document.getElementById("librairie").value = this.messages[id].librairie.toString()
        document.getElementById("messageIntrant").value = this.messages[id].message.toString()
        document.getElementById("cleIntrantSub").value = this.messages[id].cleSubstitution.toString()
        document.getElementById("cleIntrantTra").value = this.messages[id].cleTransposition.toString()
        document.getElementById("messageExtrant").value = this.messages[id].resultat.toString()

        // MDN Web Docs - Conditional (ternary) operator
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        this.messages[id].sensDuChiffrement === true ?
            document.getElementById("encoder").checked = true :
            document.getElementById("decoder").checked = true

        document.getElementById("messageIntrant").focus()

        this.supprimerMessage(id)
        this.toString()
    }

    // Méthode qui charge les messages enregistrés
    allerChercherListe() {
        let messages = JSON.parse(localStorage.getItem("messages"))

        if (messages === null) {
            messages = this.exemples
        }

        for (let i = 0; i < messages.length; i++) {
            let objetMessage = new Message(messages[i].id, messages[i].message.toString(), messages[i].cleSubstitution,
                messages[i].cleTransposition, messages[i].sensDuChiffrement, messages[i].librairie, messages[i].resultat)
            this.traiterObjet(objetMessage)
        }
    }

    // Méthode qui enregistre les messages
    enregistrerListe() {
        localStorage.setItem("messages", JSON.stringify(this.messages))
    }

    // Méthode qui sert à afficher les objets sous la forme de cartes Bootstrap
    toString() {
        document.getElementById("card-container").innerHTML = ""

        let cartes = ""

        for (let index = 0; index < this.messages.length; index++) {
            let sens

            this.messages[index].sensDuChiffrement ? sens = "Encoder" : sens = "Décoder"


            cartes += `<div class="col-md-3 mb-4">
                        <div class="card h-100 p-2">
                            <div class="card-body">
                                <p class="card-title couleurTexte fs-4">Objet no. ${this.messages[index].id + 1}</p>
                                <img src="${this.messages[index].image}" class="img-fluid" alt="Image de l'objet">
                                <p class="card-text"><span class="couleurTexte fs-5">Message initial :</span><br><span class="couleurObjet">${this.messages[index].message.toString()}</span><br>
                                                     <span class="couleurTexte fs-5">Message final :</span><br><span class="couleurObjet">${this.messages[index].resultat}</span><br>
                                                     <span class="couleurTexte fs-5">Clé de substitution :</span><br><span class="couleurObjet">${this.messages[index].cleSubstitution.toString()}</span><br>
                                                     <span class="couleurTexte fs-5">Clé de transposition :</span><br><span class="couleurObjet">${this.messages[index].cleTransposition.toString()}</span><br>
                                                     <span class="couleurTexte fs-5">Librairie de caractères :</span><br><span class="couleurObjet">${this.messages[index].librairie.toString()}</span><br>
                                                     <span class="couleurTexte fs-5">Sens du chiffrement :</span><br><span class="couleurObjet">${sens}</span></p>
                            </div>
                            <button class="btn btn-primary btn-sm col-md-9 mx-auto mb-2" onclick="listeDeMessages.modifierMessage(${index})" type="button">Modifier cet objet</button>
                            <button class="btn btn-danger btn-sm col-md-9 mx-auto mb-2" onclick="listeDeMessages.supprimerMessage(${index})" type="button">Supprimer cet objet</button>
                        </div>
                      </div>`
        }

        document.getElementById("card-container").innerHTML = cartes
    }
}

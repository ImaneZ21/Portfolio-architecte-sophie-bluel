import * as config from "./config.js";

function loginForm() {
    const formLogin = document.querySelector("#form-login");

    formLogin.addEventListener("submit", (event) => {
        //Empêchement du rechargement de la page
        event.preventDefault();

        //Récupération des valeurs
        const getEmail = document.getElementById("email");
        const getPassword = document.getElementById("password");
        email = getEmail.value.trim();
        password = getPassword.value.trim();

        //Vérification du contenu
        if (email === "" || password === "") {
            const errorElement = document.querySelector(".error-messages")
            errorElement.style.display = 'unset',
            errorElement.textContent = "Le champ email ou mot de passe est vide.";

            return;
        }

        //Vérification du regex
        if (checkLogin(email, password) === false) {
            return;
        }

        //Envoi des données vers l'api
        postData();

    });
}

loginForm()

//Permet de vérifier la validité du login
function checkLogin(email, password) {
    //Vérification E-mail
    let regex = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]+$");
    const errorElement = document.querySelector(".error-messages")
    if (!regex.test(email)) {
        errorElement.style.display = 'unset',
        errorElement.textContent = "Adresse mail eronnée";

        return false;
    }

    //vérification password
    regex = new RegExp("^[a-zA-Z0-9._-]{5,}$")
    if (!regex.test(password)) {
        errorElement.style.display = 'unset',
        errorElement.textContent = "Le mot de passe doit contenir au moins 6 caractères, uniquement des lettres (majuscules et minuscules), des chiffres, des points, des underscores ou des tirets";

        return false;
    }

    return true;
}

//Permet d'envoyer les données à l'api et de rediriger vers la homepage
async function postData() {
    const url_login = config.url_login;
    const errorElement = document.querySelector(".error-messages")
    // Données à envoyer à l'API
    const login = {
        email: email,
        password: password
    };

    try {
        // Envoi des données via une requête POST
        const response = await fetch(url_login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
        });

        if (response.ok) {
            //récupération du token
            const dataLogin = await response.json();
            const token = dataLogin.token;
            window.localStorage.setItem("token", token);

            //redirection
            window.location.href = './index.html';
        } else {
            errorElement.style.display = 'unset',
            errorElement.textContent = "Erreur dans l’identifiant ou le mot de passe";
        }
    }
    catch (error) {
        alert("erreur liée à l'api");
    }
}


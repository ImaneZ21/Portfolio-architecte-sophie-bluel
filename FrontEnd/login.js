/*import * as config from './config';*/

function form() {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        //on empêche le rechargement le page
        event.preventDefault();

        //on récupère les valeurs des éléments
        const getEmail = document.getElementById("email");
        const getPassword = document.getElementById("password");

        email = getEmail.value.trim();
        password = getPassword.value.trim();

        if (email === "" || password === "") {
            alert("Attention ! E-mail ou Mot de passe manquant");
            return;
        }

        regex(email, password);

        postData();

    });
}

form()

function regex(email, password) {
    let regex = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]+$");
    if (!regex.test(email)) {
        alert("Email invalide");
    }
    regex = new RegExp("^[a-zA-Z0-9._-]{5,}$")
    if (!regex.test(password)) {
        alert("Le mot de passe doit contenir au moins 6 caractères, uniquement des lettres (majuscules et minuscules), des chiffres, des points, des underscores ou des tirets");
    }
}

async function postData() {
    // L'URL de l'API
    const url_login = "http://localhost:5678/api/users/login";
    // Données envoyées à l'API
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
            const loginToken = await response.json();
            const token = loginToken.token;
            window.localStorage.setItem("token", token);

            window.location.href = '/FrontEnd/index.html';
           

        } else {
            alert("Compte n'existe pas");
        }
    }
    catch (error) {
        alert("erreur liée à l'api");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (token) {
        let filtersElement = document.querySelector('.portfolio-filters');
        let editHeader = document.querySelector('.edit')
        filtersElement.style.display = 'none';
        editHeader.style.display = 'flex';

        logout();

        addModifyButton();
    }
})

//Permet de modifier le bouton login en logout et d'être redirigé vers la page de connexion
function logout() {
    const login = document.getElementById('login');
    login.id = 'logout';
    login.textContent = 'logout';

    const logoutElement = document.getElementById("logout");

    logoutElement.addEventListener("click", () => {
        window.location.href = './login.html';
        window.localStorage.removeItem('token');
    })
}

//Permet d'ajouter le bouton modifier
function addModifyButton() {

    const modifyFont = document.querySelector(".title i");
    const modifyText = document.querySelector(".button");

    //faire figurer le style
    modifyFont.style.display = 'unset'
    modifyText.style.display = 'unset'

    //ouverture de la modale au click
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal)
    })

}

let modal = null

//Permet d'ouvrir la modale
function openModal(e) {

    e.preventDefault()

    //faire apparaitre la modale
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = 'flex'
    target.setAttribute('aria-hidden', 'false')
    target.setAttribute('aria-modal', 'true')
    modal = target

    // ajout évènement pour fermer la modale
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

}

//Permet de fermer la modale
function closeModal(e) {

    if (modal === null) {
        return
    }
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('aria-modal', 'false')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

    modal = null
}

// Empêcher de cliquer n'importe où pour fermer la modale
function stopPropagation(e) {
    e.stopPropagation()
}
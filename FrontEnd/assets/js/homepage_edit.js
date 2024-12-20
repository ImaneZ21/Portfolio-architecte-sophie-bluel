document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (token) {
        let filtersElement = document.querySelector('.portfolio-filters');
        filtersElement.style.display = 'none';

        logout();

        addModifyButton();
    }
})

//Permet de modifier le bouton login en logout et d'être redirigé vers la page de connexion
function logout() {
    let login = document.getElementById('login');
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
    document.querySelector("#portfolio").innerHTML = `
    <div class="title">
        <h2>Mes Projets</h2>
        <i class="fa-regular fa-pen-to-square"></i>
        <div class="button">modifier</div>
    </div>
	<div class="gallery"></div>
     `;

    openModal();


}

//Permet d'ouvrir la modale
function openModal() {
    let modifyElement = document.querySelector('.button')
    modifyElement.addEventListener("click", () => {
        modal.showModal();
    })

    closeModal();
}

function closeModal() {
    let closeElement = document.querySelector('#close')
    closeElement.addEventListener("click", () => {
        modal.close();
    })
}









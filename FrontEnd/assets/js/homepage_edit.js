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
    
    let modifyFont = document.querySelector(".title i");
    let modifyText = document.querySelector(".button");

    modifyFont.style.display = 'unset',
    modifyText.style.display = 'unset',

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









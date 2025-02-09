import * as config from "./config.js";

// Permet de récupérer le token et vérifier sa validité
function isTokenValid() {
    const token = localStorage.getItem("token");
    if (token) {
        return true;
    }
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    if (isTokenValid() === true) {
        let filtersElement = document.querySelector('.portfolio-filters');
        let editHeader = document.querySelector('.edit')
        filtersElement.style.display = 'none';
        editHeader.style.display = 'flex';

        logout();

        addModifyButton();
    }
})

// Permet de modifier le bouton login en logout et d'être redirigé vers la page de connexion
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

// Permet d'ajouter le bouton modifier
function addModifyButton() {
    const modifyFont = document.querySelector(".title i");
    const modifyText = document.querySelector(".button");

    // Faire figurer le style
    modifyFont.style.display = 'unset'
    modifyText.style.display = 'unset'

    // Ouverture de la modale au click
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal1)
    })
}

let modal = null

// Permet d'ouvrir la modale
async function openModal1(e) {
    e.preventDefault()

    const modal1 = document.querySelector('.content-modal');
    modal1.style.display = 'flex';

    // Faire apparaitre la modale 1
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = 'flex'
    target.setAttribute('aria-hidden', 'false')
    target.setAttribute('aria-modal', 'true')
    modal = target

    // Ajout des projets
    await displayWorks();

    // Faire disparaitre la modale 2
    const modal2 = document.querySelector(".content-modal2");
    modal2.style.display = 'none'

    // Transfert vers la seconde modale
    modal.querySelector('.add-picture-modal').addEventListener('click', openModal2)

    // Ajout évènement pour fermer la modale
    modal.addEventListener('click', closeModalButton)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModalButton)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    // Event listener sur les trashCan
    EventListenertoRemoveWorks();
}

// Permet de fermer la modale
function closeModalButton(e) {
    if (modal === null) {
        return;
    }
    e.preventDefault();

    // Réinitialiser la modale 2
    resetModal2();

    // Modifier le style des modales
    let modal2 = document.querySelector('.content-modal2');
    modal.style.display = "none";
    modal2.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');

    // Fonction permettant de fermer les modales
    modal.removeEventListener('click', closeModalButton)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModalButton)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

    // Réinitialiser la modale
    modal = null;
}

// Empêcher de cliquer n'importe où pour fermer la modale
function stopPropagation(e) {
    e.stopPropagation()
}

// Récupérer les projets
async function fetchWorks() {
    const url = config.url_works;
    try {
        const response = await fetch(url);

        if (response.ok) {
            const works = await response.json();
            return works;
        } else {
            throw new Error(`Works non trouvés`, error);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
    }
}

// Afficher les projets dans la modale 1
async function displayWorks() {

    // Récupérer la modale
    const galleryElement = document.querySelector('.works-modal');

    // Récupérer les projets
    const works = await fetchWorks();

    // Réinitialiser les projets
    galleryElement.innerHTML = '';

    // Création des projets
    works.forEach((work) => {
        const figureCard = document.createElement('figure');
        figureCard.setAttribute('data-id', work.id);

        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;

        const trashCan = document.createElement('i');
        trashCan.classList.add('fa-solid', 'fa-trash-can');


        figureCard.appendChild(image);
        figureCard.appendChild(trashCan);

        galleryElement.appendChild(figureCard);
    });
}

// Permet de supprimer un projet au clic
function EventListenertoRemoveWorks() {
    // Parcours les poubelles pour placer les eventsListeners
    const trashCans = document.querySelectorAll('.fa-solid.fa-trash-can');

    trashCans.forEach((trashCan) => {
        // Placer un eventListener 
        trashCan.addEventListener('click', () => {
            // Appeler la fonction removeWorks
            RemoveWorks(trashCan);
            trashCan.removeEventListener('click', RemoveWorks);
        })
    })
}

//Permet de supprimer un projet
async function RemoveWorks(trashCan) {
    const token = localStorage.getItem("token");
    const url = config.url_remove_works;

    // Retrouver l'ID du parent dans la modale
    const modalFigure = trashCan.closest('figure');
    const modalFigureId = modalFigure.getAttribute('data-id');

    // Retrouver l'ID du parent dans la gallery
    const workGalleryFigure = document.querySelector(
        'figure[figure-id="' + modalFigureId + '"]'
    );

    if ((isTokenValid())) {
        try {
            // Appel à l'API pour supprimer un projet
            const response = await fetch((url) + modalFigureId, {
                method: 'DELETE',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {

                // Supprimer le work de la modale
                if (modalFigureId) {
                    modalFigure.remove();
                }

                // Supprimer le work de la gallery
                if (workGalleryFigure) {
                    workGalleryFigure.remove();
                }

            } else {
                console.log('Impossible de supprimer');
            }
        } catch (error) {
            console.log('Erreur lors de la suppression', error);
        }
    } else {
        throw new Error('Token non trouvé');
    }
}


//fonction qui permet d'ouvrir la modale 2
async function openModal2(e) {
    e.preventDefault()

    // Faire disparaitre la modale 1
    const target = document.querySelector('.content-modal');
    target.style.display = 'none';

    // Faire apparaitre la modale 2
    const modal2 = document.querySelector(".content-modal2");
    modal2.style.display = 'flex';

    // Réinitialisation de la modale 2
    resetModal2();

    // Créer les catégories
    await createCategories();

    // Envoyer le formulaire à l'api
    postDataWorks();

    // Fermer la modale 2
    modal2.querySelector('.js-modal-close').addEventListener('click', closeModalButton)

    // Revenir sur la modale 1
    goBackModal1();

}
// Permet de réinitialiser la modale 2 
function resetModal2() {

    // Réinitialiser le formulaire de la modale 2
    const formWorks = document.getElementById("formWorks");
    if (formWorks) {
        formWorks.reset();
    }

    // Réinitialiser la prévisualisation de l'image de la modale 2
    const imagePreview = document.getElementById("imagePreviewImg");
    const addPictureButton = document.getElementById("add-picture");
    const paragraph = document.getElementById("file-info");
    if (imagePreview) {
        imagePreview.src = './assets/icons/placeholder.png';
        addPictureButton.style.display = 'unset'
        paragraph.style.display = 'unset'
    }

    // Réinitialiser la couleur du bouton de validation 
    const validateButton = document.querySelector("form .add-picture-modal[type='submit']");
    validateButton.style.backgroundColor = "#A6A6A6";

}

// Permet de revenir sur la modale 1 à l'aide de la flêche
function goBackModal1() {
    const arrow = document.querySelector('.fa-arrow-left');

    arrow.addEventListener('click', () => {
        const modal1 = document.querySelector(".content-modal");
        const modal2 = document.querySelector(".content-modal2");
        modal1.style.display = 'flex';
        modal2.style.display = 'none';
    })

    resetModal2();

}

// Permet d'envoyer les informations du formulaire à l'api et de créer les nouveaux projets
function postDataWorks() {

    // Prévisualisation de l'image
    previsualisationImage();

    // Ecouteur sur le bouton submit et envoi des works vers l'api
    eventListenerSubmitWorks()

    //modifier la couleur du boutton de validation
    document.getElementById("image").addEventListener("change", colorValidationButton);
    document.getElementById("title").addEventListener("input", colorValidationButton);
    document.getElementById("category").addEventListener("change", colorValidationButton);

}


// Fonction pour ajouter l'écouteur d'événement
function eventListenerSubmitWorks() {
    const formWorks = document.getElementById("formWorks");
    // On retire d'abord l'ancien écouteur pour éviter les doublons
    formWorks.removeEventListener("submit", submitWorks);
    // Puis on ajoute le nouveau
    formWorks.addEventListener("submit", submitWorks);
}


let submitWorks = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const url = config.url_works;

    // Récupérer les valeurs du formulaire
    const title = document.getElementById("title").value.trim();
    const imageFile = document.getElementById("image").files[0];
    const categoryId = parseInt(document.getElementById("category").value.trim());

    // Création de l'objet
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", imageFile);

    try {
        // Envoyer la requête POST
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const work = await response.json();
            const galleryElement = document.querySelector('.gallery');

            // Création de la figure
            const figureCard = document.createElement('figure');
            figureCard.setAttribute('figure-id', work.id);

            // Création de l'image
            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.setAttribute('worksCategory-id', work.categoryId);

            // Création du figcaption
            const title = document.createElement('figcaption');
            title.textContent = work.title;

            // AppendChild
            figureCard.appendChild(image);
            figureCard.appendChild(title);
            galleryElement.appendChild(figureCard);

            // Fermer la modale et réinitialiser le formulaire
            resetModal2();

            // Appeler la fonction displayWorks
            await displayWorks(work);
        
        } else {
            throw new Error("Echec lié au formulaire");
        }

    } catch (error) {
        alert("erreur liée à l'api");
    }
};

// Permet de créer les catégories
async function createCategories() {
    const url = config.url_categories;
    try {
        const response = await fetch(url);

        if (response.ok) {
            let categories = await response.json();

            const labelCategory = document.getElementById('category-label');

            // Vérifier si le select existe 
            const existSelect = document.getElementById('category');
            if (existSelect) {
                existSelect.remove();
            }

            // Création du select 
            let select = document.createElement('select');
            select.name = 'category';
            select.id = 'category'
            select.required = true;

            labelCategory.appendChild(select);

            // Création de l'option vide par défaut 
            let blankOption = document.createElement('option');
            blankOption.value = '';
            blankOption.textContent = '';

            select.appendChild(blankOption);

            // Création des options 
            categories.forEach((category) => {
                let options = document.createElement('option');
                options.value = category.id;
                options.textContent = category.name;
                select.appendChild(options);
            })
        } else {
            throw new Error('catégories non trouvées', error);
        }
    }
    catch (error) {
        console.error('Erreur lors de la récupération des filtres', error);
    }
}

// Permet de prévisualider l'image 
function previsualisationImage() {
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("imagePreviewImg");

    // Event Listener lorsque les valeurs du formulaire sont modifiées
    imageInput.addEventListener("change", () => {
        const imageFile = document.getElementById("image").files[0];
        const addPictureButton = document.getElementById("add-picture");
        const paragraph = document.getElementById("file-info");
        const errorElement = document.querySelector(".error-messages");

        // Réinitialiser les erreurs
        errorElement.style.display = "none";

        // Contrôle sur la taille de l'image
        if (imageFile.size > 4 * 1024 * 1024) {
            errorElement.style.display = 'unset',
                errorElement.textContent = "Le fichier doit contenir 4mo max";

            return;
        }

        // Rendre visible l'image
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "flex";
            };
            reader.readAsDataURL(imageFile);
            addPictureButton.style.display = "none";
            paragraph.style.display = "none";
        }
    });
}

// Permet de modifier la couleur du bouton de validation en fonction du remplissage des champs
function colorValidationButton() {
    const image = document.getElementById("image");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const validateButton = document.querySelector("form .add-picture-modal[type='submit']");

    if (image.files && image.files.length > 0 && title.value.trim().length > 0 && category.value.trim().length > 0) {
        validateButton.style.backgroundColor = "#1D6154";
    } else {
        validateButton.style.backgroundColor = "#A6A6A6";
    }
}
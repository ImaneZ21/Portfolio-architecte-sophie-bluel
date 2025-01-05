import * as config from "./config.js";

//Permet de récupérer le token et vérifier sa validité
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
async function openModal(e) {
    e.preventDefault()

    //faire apparaitre la modale 1
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = 'flex'
    target.setAttribute('aria-hidden', 'false')
    target.setAttribute('aria-modal', 'true')
    modal = target

    //ajout des projets
    await displayWorks();

    //faire disparaitre la modale 2
    const modal2 = document.querySelector(".content-modal2");
    modal2.style.display = 'none'

    //Transfert vers la seconde modale
    modal.querySelector('.add-picture-modal').addEventListener('click', openModal2)

    // ajout évènement pour fermer la modale
    modal.addEventListener('click', closeModalButton)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModalButton)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    //Event listener sur les trashCan
    EventListenertoRemoveWorks();
}

//Permet de fermer la modale
function closeModalButton(e) {
    if (modal === null) {
        return;
    } else {
        e.preventDefault()
        modal.style.display = "none"
        modal.setAttribute('aria-hidden', 'true')
        modal.setAttribute('aria-modal', 'false')
        modal.removeEventListener('click', closeModalButton)
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModalButton)
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

        //réinitialiser la modale
        modal = null
    }
}

// Empêcher de cliquer n'importe où pour fermer la modale
function stopPropagation(e) {
    e.stopPropagation()
}

//Récupérer les projets
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

//Afficher les projets
async function displayWorks() {
    const galleryElement = document.querySelector('.works-modal');
    const works = await fetchWorks();

    //réinitialiser les projets
    galleryElement.innerHTML = '';

    //création des projets
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
    //parcours les poubelles pour placer les eventsListeners
    const trashCans = document.querySelectorAll('.fa-solid.fa-trash-can');

    trashCans.forEach((trashCan) => {
        //placer un eventListener 
        trashCan.addEventListener('click', () => {
            //appeler la fonction removeWorks en envoyant l'id
            RemoveWorks(trashCan);
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

    // Retrouve l'ID du parent dans la gallery
    const workFigure = document.querySelector(
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


                if (modalFigureId) {
                    modalFigure.remove();
                }

                if (workFigure) {
                    workFigure.remove();
                    console.log(workFigure);
                    console.log('yes')
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
async function openModal2() {
    //faire disparaitre la modale 1
    const target = document.querySelector('.content-modal');
    target.style.display = 'none';

    //faire apparaitre la modale 2
    const modal2 = document.querySelector(".content-modal2");
    modal2.style.display = 'flex';

    //créer les catégories
    await createCategories();

    // Envoyer le formulaire à l'api
    postDataWorks();

    //fermer la modale 2
    modal2.querySelector('.js-modal-close').addEventListener('click', closeModalButton)
}

//Permet d'envoyer les informations du formulaire à l'api et de créer les nouveaux projets
function postDataWorks() {
    const formWorks = document.getElementById("formWorks");
    const token = localStorage.getItem("token");
    const url = config.url_works;

    //prévisualisation de l'image
    previsualisationImage();

    //Event listener sur le bouton submit
    formWorks.addEventListener("submit", async (event) => {
        event.preventDefault();

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
            const response = await fetch((url), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                //Redirection vers la homepage
                window.location.href = './index.html';
            } else {
                throw new Error(" Echec liée au formulaire");
            }
        } catch (error) {
            alert("erreur liée à l'api");
        }
    });

    //modifier la couleur du boutton de validation
    document.getElementById("image").addEventListener("change", colorValidationButton);
    document.getElementById("title").addEventListener("input", colorValidationButton);
    document.getElementById("category").addEventListener("change", colorValidationButton);
}

async function createCategories() {
    const url = config.url_categories;
    try {
        const response = await fetch(url);

        if (response.ok) {
            const categories = await response.json();

            const labelCategory = document.getElementById('category-label');

            // Création du select 
            let select = document.createElement('select');
            select.name = 'category';
            select.id = 'category'
            select.required = true;
            
            labelCategory.appendChild(select);

            let blankOption = document.createElement('option');
            blankOption.value = '';
            blankOption.textContent = '';

            select.appendChild(blankOption);

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

//permet de prévisualider l'image 
function previsualisationImage() {
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("imagePreviewImg");


    //Event Listener lorsque les valeurs du formulaire sont modifiées
    imageInput.addEventListener("change", () => {
        const imageFile = document.getElementById("image").files[0];
        const addPictureButton = document.getElementById("add-picture");
        const paragraph = document.getElementById("file-info");
        const errorElement = document.querySelector(".error-messages");

        // Réinitialisez les erreurs
        errorElement.style.display = "none";

        //contrôle sur la taille de l'image
        if (imageFile.size > 4 * 1024 * 1024) {
            errorElement.style.display = 'unset',
                errorElement.textContent = "Le fichier doit contenir 4mo max";
            return;
        }

        //rendre visible l'image
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "flex";
            };
            reader.readAsDataURL(imageFile);

            addPictureButton.style.display = "none";
            paragraph.style.display = "none";

        } else {

            imagePreview.style.display = "none";
        }
    });
}

function colorValidationButton() {
    const image = document.getElementById("image");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const validateButton = document.querySelector("form .add-picture-modal[type='submit']");

    if (image.files && image.files.length > 0 && title.value.trim().length > 0 && category.value.trim().length > 0) {
        validateButton.style.backgroundColor = "#1D6154";
    }
}
import * as config from "./config.js";
import { createWorks } from "./gallery.js";
import { fetchWorks } from "./gallery.js";

async function fetchCategories() {
    const url = config.url_categories;
    try {
        const response = await fetch(url);

        if (response.ok) {
            const categories = await response.json();

            createFilters(categories);

            addEventListenersFilters();

        } else {
            throw new Error('catégories non trouvées', error);
        }
    }
    catch (error) {
        console.error('Erreur lors de la récupération des filtres', error);
    }
}

fetchCategories();

function createFilters(categories) {
    //Recherche de la class concernée
    let filtersElement = document.querySelector('.portfolio-filters');
    filtersElement.innerHTML = '';

    //Création de l'élement div
    let divFilter = document.createElement('div');
    divFilter.classList.add('filters');

    //Création de l'élément boutton Tous
    let buttonAllfilter = document.createElement('button');
    buttonAllfilter.textContent = "Tous";
    buttonAllfilter.setAttribute('data-category-id', 'all');

    //Rattachement du boutton Tous au parent
    divFilter.appendChild(buttonAllfilter);

    //Ajouter boutton pour chaque catégorie
    categories.forEach(category => {
        let buttonFilter = document.createElement('button');
        buttonFilter.textContent = category.name;
        buttonFilter.setAttribute('data-category-id', category.id);
        divFilter.appendChild(buttonFilter);
    });

    //Rattachement des boutons à l'élément div
    filtersElement.appendChild(divFilter);
}

function addEventListenersFilters() {
    // Sélectionner tous les boutons
    const filterButtons = document.querySelectorAll('.filters button');

    filterButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const works = await fetchWorks();
            const categoryId = button.getAttribute('data-category-id');

            if (categoryId !== 'all') {
                document.querySelector(".gallery").innerHTML = "";
                const filteredWorks = works.filter(work => work.categoryId === parseInt(categoryId));
                createWorks(filteredWorks)
            }else{
                document.querySelector(".gallery").innerHTML = "";
                createWorks(works)
            }
        });
    });
}
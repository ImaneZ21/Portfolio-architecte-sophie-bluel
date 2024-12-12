import * as config from './config.js';
import { createWorks } from "./gallery.js";
import { fetchWorks } from "./gallery.js";

async function fetchCategories(){
    const url = config.url_categories;
    try{
        const response = await fetch(url);

        if (response.ok) {
        const categories = await response.json();
        console.log(categories);
        
        createFilters(categories);

        addEventListeners();

        } else {
        throw new Error(`Travaux non trouvés`);
        }
    }
    catch (error) {
        console.error('Erreur lors de la récupération des filtres', error);
    }
   
}

fetchCategories();

function createFilters(categories){

    //Recherche de la class concernée
    let filtersElement = document.querySelector('.portfolio-filters');
    filtersElement.innerHTML = ''; // Réinitialiser la galerie

    //Création de l'élement div
    let divFilter = document.createElement('div');
    divFilter.classList.add('filters'); 

    //Création de l'élément boutton Tous
    let  buttonAllfilter = document.createElement('button');
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

async function addEventListeners() {
    // Sélectionner tous les boutons
    const filterButtons = document.querySelectorAll('.filters button');
    const works = await fetchWorks();

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category-id');
            console.log('Catégorie sélectionnée:', categoryId);
            
            if (categoryId === 'all') {
                fetchWorks();
            } else if (categoryId === "1" ) {
                const filteredWorks = works.filter(work => work.categoryId === 1);
                createWorks(filteredWorks)
            } else if (categoryId === "2" ) {
                const filteredWorks = works.filter(work => work.categoryId === 2);
                createWorks(filteredWorks)
            } else if (categoryId === "3" ) {
                const filteredWorks = works.filter(work => work.categoryId === 3);
                createWorks(filteredWorks)
            }
        });
    });
}
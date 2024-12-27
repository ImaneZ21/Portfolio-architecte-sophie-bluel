import * as config from "./config.js";

//Permet d'appeler l'api afin de récupérer la gallery
export async function fetchWorks() {
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

//Permet de créer la gallery
export function createWorks(works) {

    const galleryElement = document.querySelector('.gallery');
    galleryElement.innerHTML = '';

    works.forEach((work) => {
        const figureCard = document.createElement('figure');
        figureCard.setAttribute('figure-id', work.id);


        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;
        image.setAttribute('worksCategory-id', work.categoryId);

        const title = document.createElement('figcaption');
        title.textContent = work.title;

        figureCard.appendChild(image);
        figureCard.appendChild(title);

        galleryElement.appendChild(figureCard);
    });

}
const works = await fetchWorks();
createWorks(works);
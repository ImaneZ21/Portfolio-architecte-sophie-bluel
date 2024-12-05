async function fetchWorks() {
    const url = 'http://localhost:5678/api/works';
    const galleryElement = document.querySelector('.gallery'); 

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const works = await response.json();
        console.log(works);

        works.forEach(work => {
            const workCard = document.createElement('div');

            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.alt = work.title; 

            const title = document.createElement('h3');
            title.textContent = work.title;

            workCard.appendChild(image);
            workCard.appendChild(title);

            galleryElement.appendChild(workCard);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
    }
}

fetchWorks();
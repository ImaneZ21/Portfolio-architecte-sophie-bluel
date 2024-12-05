// Fonction pour récupérer les projets depuis l'API
async function fetchGallery() {
    const url = 'http://localhost:5678/api/works'; // URL de l'API
    const galleryElement = document.querySelector('.gallery'); // Sélecteur de la galerie

    try {
        // Récupérer les données de l'API
        const response = await fetch(url);

        // Vérification si la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Convertir la réponse en JSON
        const works = await response.json();
        console.log(works); // Affiche les projets dans la console pour déboguer

        // Pour chaque projet, créer un élément HTML et l'ajouter à la galerie
        works.forEach(work => {
            // Créer un élément pour chaque projet (une carte avec une image et un titre)
            const workCard = document.createElement('div');
            workCard.classList.add('work-card'); // Ajouter une classe pour le style

            // Créer l'image du projet
            const image = document.createElement('img');
            image.src = work.imageUrl; // URL de l'image
            image.alt = work.title; // Le titre comme texte alternatif pour l'image

            // Créer le titre du projet
            const title = document.createElement('h3');
            title.textContent = work.title;

            // Ajouter l'image et le titre à la carte
            workCard.appendChild(image);
            workCard.appendChild(title);

            // Ajouter la carte à la galerie
            galleryElement.appendChild(workCard);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
    }
}

// Appeler la fonction pour récupérer et afficher les projets
fetchGallery();
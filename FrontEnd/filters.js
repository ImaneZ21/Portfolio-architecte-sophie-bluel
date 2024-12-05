async function fetchCategories(){
    const url = 'http://localhost:5678/api/categories';
    const filtersElement = document.querySelector('.portofolio-filters');


    try{
        const response = await fetch(url);
        console.log('ok url');

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const categories = await response.json();
        console.log(categories);

        //fonction pour créer les filtres

        function createFilters(){

            const buttonAllfilter = document.createElement('button');
            buttonAllfilter.textContent = "Tout";
    
            categories.forEach(category => {
            
            const categoriesFilters = document.createElement('div');

            const buttonFilters = document.createElement('button');
            buttonFilters.textContent = category.name;

            categoriesFilters.appendChild(buttonAllfilter);

            categoriesFilters.appendChild(buttonFilters);

            filtersElement.appendChild(categoriesFilters);

            });
            
        };

        createFilters();
        
    }
    catch (error) {
        console.error('Erreur lors de la récupération des filtres', error);
    }
   
}

fetchCategories();
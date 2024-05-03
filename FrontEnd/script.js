// Fonction qui permet d'initialiser le programme
function init() {
    //Récupère et affiche les catégories
    getCategories();

    //Récupère et affiche les travaux 
    getWorks();
}

init();
// Fonction qui fait appel à l'API sur les catégories et les affiche sur le DOM
async function getCategories() {
    // appel à l'API avec fetch
    const req = await fetch("http://localhost:5678/api/categories");
    // récupère et formatte dans un format qui peut être manipulé par JS
    const datas = await req.json();

for (let i = 0; i < datas.length; i++) {
    const button = `<button data-categoryid="${datas[i].id}">${datas[i].id}">${datas[i].name}</button>`;

    // j'ajoute le bouton sur le DOM
    document.querySelector(".filters").insertAdjacentHTML("beforeend", button)
    }

    // Sur chaque bouton, ajout d'un écouteur d'évènement (click)
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
      // A chaque bouton, ajoute l'écouteur d'évènement
      button.addEventListener("click", (e) => {
        const categoryId = e.target.dataset.categoryid;
  
        // Filtrer les travaux dans la catégorie cliquée
        filterWork(categoryId);
      });
    });
  }

// Fonction qui filtre les travaux en fonction de l'id de la catégorie
function filterWork(categoryId) {
  // Tes figures vont avoir un attribut data-categoryid
// Au lancement de cette fonction, tu sélectionnes toutes tes figures et tu display none
   const figures = document.querySelectorAll(".gallery figure");
   figures.forEach((figure) => {
    if (categoryId == 0) {
    figure.style.display = "block";
    } else {
   figure.style.display = "none";
    }
    });
   // Ensuite tu sélectionnes toutes les figures avec data-categoryid="la catégorie transmise"
    const figuresToShow = document.querySelectorAll(
    `figure[data-categoryid="${categoryId}"]`
    );
    figuresToShow.forEach((figure) => {
    figure.style.display = "block";
    });
}
    
async function getWorks() {
   // Code qui récupère les travaux depuis l'API et qui les affiche
    const reqWorks = await fetch("http://localhost:5678/api/works");
    // Récupère et formatte dans un format qui peut être manipulé par JS
    const dataWorks = await reqWorks.json();
    
    for (let i = 0; i < dataWorks.length; i++) {
        const figure = `<figure data-id="${dataWorks[i].id}" 
        data-categoryid="${dataWorks[i].categoryId}">
        <img src="${dataWorks[i].imageUrl}" alt= "${dataWorks[i].title}">
        <figcaption>${dataWorks[i].title}</figcaption>
        </figure>`;
    
        // J'ajoute les figures sur le DOM
        document.querySelector(".gallery").insertAdjacentHTML("beforeend", figure);
    }
}
    


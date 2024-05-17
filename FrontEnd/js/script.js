// Fonction qui permet d'initialiser le programme
function init() {
    //Vérifie si l'utilisateur est connecté
    const isConnected = testConnexion();
    //Récupère et affiche les catégories
    getCategories();

    //Récupère et affiche les travaux 
    getWorks();

  // Je remplace le mot Login par Logout, si connexion réussie
  if(isConnected) {
    document.querySelector(".login").innerText = "logout";

    // AEL sur logout
    const logout = document.querySelector(".login");
    logout.addEventListener("click" , (e) => {
      e.preventDefault();

      // je déconnecte en supprimant le token
      localStorage.removeItem("token");

      //je renvoie à la page login
      window.location.href = "login.html";
    });
   
    // je masque les filtres
    const hideFilters = document.querySelector(".filters");
    hideFilters.style.display = "none";

    //j'ajoute les éléments sur la page de connexion (bouton modifier + bannière mode édition)
      // icone + bouton modifier
      // Je crée une balise
      const btnChange = document.createElement("div")
      btnChange.innerHTML = `<button>
      <i class="fa-regular fa-pen-to-square"></i>
      modifier
      </button>`
      //J'insère la balise dans la page : 
      //en récupérant l'élément parent existant
      const mesProjets = document.querySelector("#portfolio>h2")
      //J'ajoute le nouvel élément au parent
      mesProjets.appendChild(btnChange)



  }

}



init();

//Fonction qui vérifie si l'utilisateur est connecté
function testConnexion(){
  if(localStorage.getItem("token") == ""|| localStorage.getItem("token") == undefined){
    return false
  } else {
    return true
  }
}




// Fonction qui fait appel à l'API sur les catégories et les affiche sur le DOM
async function getCategories() {
    // appel à l'API avec fetch
    const req = await fetch("http://localhost:5678/api/categories");
    // récupère et formatte dans un format qui peut être manipulé par JS
    const datas = await req.json();

for (let i = 0; i < datas.length; i++) {
    const button = `<button data-categoryid="${datas[i].id}">
                      ${datas[i].name}
                    </button>`;

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
    


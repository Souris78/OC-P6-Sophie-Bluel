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

    document.querySelector(".login").innerText = "logout"
    // AEL sur logout
    const logout = document.querySelector(".login")
      
      logout.addEventListener("click" , (e) => {
          e.preventDefault()
          // je déconnecte en supprimant le token
          localStorage.removeItem("token")
          //je renvoie à la page login
          window.location.href = "login.html"
      });
   
    // je masque les filtres
    const hideFilters = document.querySelector(".filters")
      hideFilters.style.display = "none"

    //j'ajoute les éléments sur la page de connexion (bouton modifier + bannière mode édition)
      
    // 1. Icone + bouton modifier
    const btnChange = document.createElement("a");
    btnChange.innerHTML = `
              <i class="fa-regular fa-pen-to-square"></i>
              <p>modifier</p>`;
       
      //J'insère la balise dans la page :

        // - en récupérant l'élément parent existant
        const mesProjets = document.querySelector("#portfolio>h2")
          // - en ajoutant le nouvel élément au parent
          mesProjets.appendChild(btnChange)

        // 2. Bannière mode édition
        //je crée d'abord le bandeau
        const banner = `<button id="banner">
          <i class="fa-regular fa-pen-to-square"></i>
          Mode édition
          </button>`
          //et je l'ajoute sur le DOM
          document.querySelector("body").insertAdjacentHTML("beforebegin", banner)

    // la modale

      //Fonction pour ouvrir/fermer la modale
      const dialog = document.querySelector("dialog");
      const showLink = document.querySelector("h2 a");
      const closeLink = document.querySelector(".close-button");
  
      //Ouvre la modale
      showLink.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.showModal();
      });
  
      //ferme la modale quand on appuie sur la croix
      closeLink.addEventListener("click", (e) => {
        dialog.close();
      });
  
      // Ferme la modale quand on clique à l'extérieur
  
      window.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close();
      });
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
  // figures vont avoir un attribut data-categoryid
// Au lancement de cette fonction, je sélectionne toutes tes figures et je display none
   const figures = document.querySelectorAll(".gallery figure");
   figures.forEach((figure) => {
      if (categoryId == 0) {
      figure.style.display = "block";
      } else {
      figure.style.display = "none";
      }
    });
   // Je sélectionnes toutes les figures avec data-categoryid="la catégorie transmise"
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
    
    //j'affiche les travaux dans la galerie
      for (let i = 0; i < dataWorks.length; i++) {
          const figure = `<figure data-id="${dataWorks[i].id}" 
          data-categoryid="${dataWorks[i].categoryId}">
          <img src="${dataWorks[i].imageUrl}" alt= "${dataWorks[i].title}">
          <figcaption>${dataWorks[i].title}</figcaption>
          </figure>`;
      
          // J'ajoute les figures sur le DOM
          document.querySelector(".gallery").insertAdjacentHTML("beforeend", figure);
      }

     //j'ajoute les travaux dans la modale
      for (let i = 0; i < dataWorks.length; i++) {
        const modalFigure = `<figure 
          data-id="${dataWorks[i].id}" 
          >
          <img src="${dataWorks[i].imageUrl}" alt= "${dataWorks[i].title}">
          <span>
          <i class="fa-solid fa-trash-can"
          data-id="${dataWorks[i].id}" 
          ></i></span>
          </figure>`;

        document
          .querySelector(".modal-gallery")
          .insertAdjacentHTML("beforeend", modalFigure);
      }
      //Je supprime les photos quand clique sur corbeille dans la modale
      const trashes = document.querySelectorAll('.fa-trash-can')
      trashes.forEach((trash) => {
        trash.addEventListener("click" , async (e) => {
          const id = e.target.dataset.id
          const figures = document.querySelectorAll(`[data-id= "${id}"]`)
            figures.forEach((figure) => {
              figure.remove()
            })
        
      
      //Je supprime les photos du back

            try {
              const deleteWorks = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method:"DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      "authorization": `Bearer ${localStorage.getItem('token')}`
                    }
              })
              if(!deleteWorks.ok) {
                throw new Error ("Erreur lors de la suppression des travaux")
              }
                figures.forEach((figure) => {
                figure.remove()
                })

            }catch (error) {
              console.error("Erreur lors de la suppression :" , error)
            }

      })
         }) 
    
    }

// Fonction pour ouvrir/fermer la modale
      const dialog = document.querySelector(".add-project");
      const dialogOne = document.querySelector('.dialog-one')
      const showLinkTwo = document.querySelector(".link-add-pics");
      const closeLinkTwo = document.querySelector(".add-project-close-button");
      const closeLinkArrow = document.querySelector(".fa-arrow-left");
    
      //Ouvre la modale
      showLinkTwo.addEventListener("click", (e) => {
        e.preventDefault();
          dialog.showModal();
          dialogOne.close()
      });
  
        //ferme la modale quand on appuie sur la croix
        closeLinkTwo.addEventListener("click", (e) => {
          dialog.close();
        });
    
          // Ferme la modale quand on clique à l'extérieur et retour sur la première modale quand on clique sur la flèche
      
          window.addEventListener("click", (e) => {
            if (e.target === dialog) dialog.close()
         
            if (e.target === closeLinkArrow) dialogOne.showModal()
           })

  //affichage image
  const labelFile = document.querySelector(".add-pic-box label[for='file']")
  const inputFile = document.getElementById("file")
  const previewImage = document.querySelector(".add-pic-box img")
  const iconeFile = document.querySelector(".add-pic-box i")
  const textFile = document.querySelector(".add-pic-box span")
            
          inputFile.addEventListener('change' , () => {
              const file = inputFile.files[0] //récup ce qu'il y'a dans le fichier
              
                if (file) {
                  const fileReader = new FileReader()
                  fileReader.readAsDataURL(file)
                    fileReader.addEventListener('load' , () => {
                        const url = fileReader.result
                        previewImage.src = url
                        previewImage.style.display = "block"
                        previewImage.style.width = "35%"
                        previewImage.style.height = "100%"
                        iconeFile.style.display = "none"
                        labelFile.style.display = "none"
                        textFile.style.display = "none"
                    })
                }
          })
          
          // récuperation liste catégories
          async function getModalCategories() {
            const req = await fetch("http://localhost:5678/api/categories");
            return await req.json();
          }

          // affichage liste catégories dans la sélection
          async function showSelectedCategory() {
            
            const selectCategory = document.querySelector("select#category")
            const categories = await getModalCategories()
           
            //vider les options pour éviter doublons
            selectCategory.options.length = 0

              categories.forEach(category => {
                const option = document.createElement("option")
                option.value = category.id
                option.textContent = category.name
                selectCategory.appendChild(option)
              })
          }
            showSelectedCategory()
            
            // POST formulaire
            const form = document.querySelector("form")
            const title = document.getElementById("title")
            const category = document.getElementById("category")
          
            form.addEventListener("submit" , async (e) => {
              // Lors de l'envoi du formulaire, j'empêche l'envoi normal 
              e.preventDefault()
              // Je construis un objet FormData qui déclenche l'événement formdata
              const formData = new FormData(form)

              try {
                  const submitForm = await fetch("http://localhost:5678/api/works", {
                      method:"POST",
                      body: formData,
                      headers: {
                              "authorization": `Bearer ${localStorage.getItem('token')}`
                      }
                  })
                
                  if(!submitForm.ok) {
                      throw new Error ("Erreur lors de l'ajout des travaux")
                  }
 
                  const dataModal = await submitForm.json()
                  console.log("projet ajouté" , dataModal)
                  
                  form.reset()
                 
                  showSelectedCategory()
                   
                  //réinitialise l'affichage de l'image
                  previewImage.src = "";
                  previewImage.style.display = "none";
                  iconeFile.style.display = "block";
                  labelFile.style.display = "block";
                  textFile.style.display = "block";

                  getWorks()

              } catch (error) {
                    console.error("Erreur lors de l'ajout des travaux :" , error)
                }
            })

      

            // fonction pour vérifier que les champs sont remplis
            function checkForm() {
              const submit = document.getElementById("valider") 
              form.addEventListener("input" , () => {
                if (title.value !=="" && category.value !=="" && inputFile.value !=="") {
                  
                  submit.disabled = false
                  submit.classList.remove("not-valid")

                } else {
                        submit.classList.add("not-valid")
                        submit.disabled = true
                  }
              })

            }
           
            checkForm()
            
          

        

         




          


  


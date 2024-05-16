//Quand utilisateur clique sur le bouton valider j'écoute le clic
//
const button = document.getElementById("button")
button.addEventListener("click", async (event) => {
    event.preventDefault();


// une fois cliqué je lance une fonction qui va faire la connexion
//je récupère l'email
//le mot de passe

    const email =document.getElementById("email").value;
    const password = document.getElementById("password").value;

//Je fais un fetch POST en envoyant email et mot de passe

    try {
        const datasLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: JSON.stringify({ email , password }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!datasLogin.ok) {
            throw new Error("Échec de la requête de connexion")
        }
        
        const datas = await datasLogin.json()
        localStorage.setItem("token" , datas.token);    
        window.location.href = "index.html"
    }catch (error) {
        console.error("Erreur de connexion :", error)
    }
})
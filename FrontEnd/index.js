let allButtons=[];
let works = [];

// Récupération des travaux depuis API 
async function main(){
    const reponse = await fetch('http://localhost:5678/api/works');
    works = await reponse.json();
    generateWorks(works);


// PARTIE FILTRES //

// Récupérer la division concernée pr faire appendChild

allButtons = document.querySelector(".btn-filter-container");
const btnAllWorks= document.createElement('button');
btnAllWorks.innerText="Tous"
allButtons.appendChild(btnAllWorks);

btnAllWorks.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML="";
    generateWorks(works);
});

//Appel API pour récupérer les catégories 

const r = await fetch('http://localhost:5678/api/categories'); 
const categories = await r.json();
console.log(categories);

categoryFilter(categories);

}

function generateWorks(works){
    for (let i=0; i< works.length; i++){
        const project = works[i];

        // Récupération de l'élément du DOM qui accueillera les travaux
        const galleryWorks = document.querySelector('.gallery');

        // Création d'une balise dédiée à un projet
        const workFigure = document.createElement("figure");

        // Création des balises
        const workImage= document.createElement("img");
        workImage.src= project.imageUrl;
        workImage.alt= project.title;
        workImage.crossOrigin="anonymous";

        const workTitle = document.createElement("figcaption");
        workTitle.innerText=project.title;

        // Rattacher balise figure à la gallerie de projets
        galleryWorks.appendChild(workFigure);
        workFigure.appendChild(workImage);
        workFigure.appendChild(workTitle);
    }
    console.log(works);
}

function categoryFilter(categories){
    console.log(categories);
    for (let i=0; i<categories.length; i++){
        const btnCategory= document.createElement('button');
            btnCategory.innerText=categories[i].name;
            allButtons.appendChild(btnCategory);
            btnCategory.addEventListener("click", function(){
                const categoryX= works.filter(function(work){
                        return work.category.name === categories[i].name;                    
                });
                document.querySelector(".gallery").innerHTML= "";
                generateWorks(categoryX);
            })

    };
};

main();

// Changements une fois utilisateur connecté 

let token = localStorage.getItem("token");

// cacher boutons catégories qd utilisateur connecté

if (token){
    console.log("Bienvenue Sophie");
    document.querySelector(".btn-filter-container").style.display="none";
    let log=document.getElementById("log");
    log.innerText="logout";

    //bannière noire supérieure 
    const banniereContainer = document.querySelector(".banniere-display");
    banniereContainer.style.display="flex";

    const body= document.querySelector('body');
    body.style.paddingTop="40px";

    const modifierModeUtilisateur = document.querySelector('.modifier-mode-utilisateur');
    modifierModeUtilisateur.style.display="flex";


    const container2= document.querySelector('.container2');
    container2.style.marginBottom= "45px";


    ////////////////////////////////////////////////////////////////
    //POUR DÉCONNECTER UTILISATEUR AUTOMATIQUEMENT APRÈS 30 MINUTES//
    ////////////////////////////////////////////////////////////////

    //Détermine le temps limite pour la session en millisecondes
    const sessionTimeLimit= 30*60*1000 // 30 minutes

    //Lancer le compteur pr la session
    let sessionTimer= setTimeout(logout,sessionTimeLimit);

    //Remettre le compteur à zéro en cas d'activité
    document.addEventListener("mousemove",resetSessionTimer);
    document.addEventListener("keypress",resetSessionTimer);

    //Fonction pr remettre le compteur à zéro
    function resetSessionTimer(){
        clearTimeout(sessionTimer);
        sessionTimer=setTimeout(logout,sessionTimeLimit);
    }
    //Fonction pr déconnecter utilisateur
    function logout(){
        //effacer le token
        localStorage.clear();
        //Redirige l'utilisateur vers la page de login
        window.location.href="login.html";
    }


    ////////////////////////////////////////////////////////////////
            //pour se déconnecter en cliquant sur logout//
    ////////////////////////////////////////////////////////////////

    
    const logClick = document.querySelector("#log");
    logClick.addEventListener("click",function(e){
        e.preventDefault();
        localStorage.removeItem("token");
        location.href="index.html";
    })
    
    //la modale 

    const modalWrapper= document.querySelector('.modal-wrapper');
    const modaleGrid= document.querySelector('.modal-grid');
    const bigContainer= document.querySelector('.big-container')
    
    const divContainer= document.createElement('div');
    bigContainer.appendChild(divContainer);
    divContainer.className="container-wrapper-js";

    let buttonAjouterUnePhoto= document.createElement('button');
    buttonAjouterUnePhoto.innerHTML="Ajouter une photo";
    
    divContainer.appendChild(buttonAjouterUnePhoto);
    buttonAjouterUnePhoto.className="button-ajouter-photo";

    let paragrapheSupprimerGalerie = document.createElement('p');
    paragrapheSupprimerGalerie.innerHTML="Supprimer la galerie";
    divContainer.appendChild(paragrapheSupprimerGalerie);
    paragrapheSupprimerGalerie.className="supprimer-galerie-js";

    




function fetchData(){
        fetch('http://localhost:5678/api/works')
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        for (let i=0;i<data.length;i++){
            let div= document.createElement('div');           
            div.className="div"+[i];
            modaleGrid.appendChild(div);

            let trashCan= document.createElement('i');
            trashCan.className="fas fa-regular fa-trash-can"

            let buttonTrashCan= document.createElement('button');
            buttonTrashCan.appendChild(trashCan);
            div.appendChild(buttonTrashCan);
            buttonTrashCan.className="button-trash-can-modale"

            let extendPhoto= document.createElement('i');
            extendPhoto.className='fas fa-solid fa-arrows-up-down-left-right';

            let buttonExtendPhoto= document.createElement('button');
            buttonExtendPhoto.className="button-extend-photo-js";
            buttonExtendPhoto.appendChild(extendPhoto);
            div.appendChild(buttonExtendPhoto);
            buttonExtendPhoto.style.display="none"; // on le fait apparaitre avec JS au moment où on survole photo 
            buttonExtendPhoto.style.transition="none";


            let figureProject= document.createElement('figure');
            div.appendChild(figureProject);


            let imageProject = document.createElement('img');
            imageProject.src=data[i].imageUrl;
            imageProject.crossOrigin="anonymous";
            figureProject.appendChild(imageProject);
           
            //Pour faire apparaitre le bouton agrandir la photo au survol de la photo

            figureProject.addEventListener("mouseenter",function(){
                buttonExtendPhoto.style.display="block";
                figureProject.style.transition="none";
            })
            figureProject.removeEventListener("mouseleave",function(){
                buttonExtendPhoto.style.display="none";
            })

            let paragrapheEditer= document.createElement("p");
            paragrapheEditer.innerText="éditer";
            div.appendChild(paragrapheEditer);

            //Pour supprimer un projet en appuyant sur bouton poubelle

            buttonTrashCan.addEventListener("click", function(){
                console.log(data[i]);
                fetch(`http://localhost:5678/api/works/${data[i].id}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${localStorage.token}`
                },
            
            })
                .then(response => {
                    if (response.status===204){
                        console.log("Projet correctement supprimé, félicitations")

                        const galleryWorks= document.querySelector(".gallery");
                        galleryWorks.innerHTML= ""; // on le vide puis on fait un appel à la fonction main 
                        main();

                        //mettre à jour le contenu de la modale en fonction de response
                        modaleGrid.innerHTML=""; // on vide contenu gallerie modale 
                        fetchData(); // on appelle la fonction fetchData pr rempir de nouveau

                        return response.json // parser la réponse en json
                    }
                })
                
                
                
            })
            
        }
    });
    }

fetchData();


    //////////////////////////////////////////
    // GESTION DE L'APPARITION DE LA MODALE //
    //////////////////////////////////////////

    //Récupération de l'élément 
    const modal = document.querySelector(".modal");

    //Pour ouvrir la modale en cliquant sur bouton modifier
        //Récupération bouton "modifier" pr ouvrir la modale
    const openModaleButton = document.querySelector("#button-modal1");

    openModaleButton.addEventListener("click", function(){
        modal.style.display="flex";
        //enregistrer l'état de la modale dans localstorage
        localStorage.setItem("modaleState","open")
    })

    
    ////////////////////////////////////////////
    //         GESTION AJOUT PROJET           //
    ////////////////////////////////////////////

    const ajouterProjetButton= document.querySelector(".button-ajouter-photo");
    const bigContainer2=document.querySelector('.big-container2');
    ajouterProjetButton.addEventListener("click",function(){
        bigContainer.style.display="none";
        bigContainer2.style.display="block";        
    })

    //Pour revenir en arrière dans la modale

    const previousModaleButton = document.querySelector(".previous-modale-button");
    previousModaleButton.addEventListener("click",function(){
        bigContainer2.style.display="none";
        bigContainer.style.display="";
    })


    //Pour avoir les catégories directement depuis l'API dans le formulaire d'ajout de projet

    const categoryChoicesContainer= document.querySelector('#category-choice');

    //Appel API pour récupérer les catégories pour avoir la liste des catégories dans le formulaire de manière dynamique

    fetch('http://localhost:5678/api/categories')
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        for (let i=0; i<data.length;i++){
            const optionCategorie= document.createElement('option');
            optionCategorie.innerHTML=data[i].name;
            optionCategorie.value=data[i].id;
            categoryChoicesContainer.appendChild(optionCategorie)
        }
    })   
    
    //Gestion affichage de la photo sélectionnée pour l'ajouter au portfolio

        // on récupère l'input de type file dont l'id est fichier-photo et l'élément div servant à la prévisualisation

    const input= document.querySelector('#fichier-photo');
    let preview= document.querySelector('.preview');
    const buttonSubmitFormAjoutPhoto= document.querySelector('.submit-form-ajout-photo');

    input.addEventListener('change',updateImageDisplay);
    function updateImageDisplay(){
        const fileList= this.files //pour avoir le(s) fichier(s) sélectionné(s)

        //créer un nouveau objet FileReader pour lire le fichier
        const reader= new FileReader();
        
        // mettre en place le gestionnaire d evenement pr quand le reader a chargé le fichier 
        reader.onload = function() {

        // creer un nv element image à afficher dans le preview
        const image = new Image();
        image.src = reader.result;
        image.crossOrigin="anonymous";
        preview.innerHTML="";
        image.style.width="130px";
        image.style.height="190px";
        preview.appendChild(image);
        preview.style.padding="0"
    };
        console.log(fileList)
        // lire le fichier comme une data URL 
        reader.readAsDataURL(fileList[0]);

        buttonSubmitFormAjoutPhoto.style.backgroundColor="#1D6154";
        buttonSubmitFormAjoutPhoto.style.color="white";
    }
    
    //On récupère le formulaire 

    const formAjoutProjet = document.querySelector('.form-ajout-photo');


    formAjoutProjet.addEventListener("submit", function(event){
        event.preventDefault();
        const newForm= new FormData();

        console.log(input.files[0]);
        newForm.append("image",input.files[0]);
        const titleProject = document.querySelector('#title-project');
        newForm.append("title",titleProject.value);
        const categoryNewProject= document.querySelector('#category-choice');
        newForm.append("category",categoryNewProject.value);
        console.log(newForm);
        

        fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            // 'content-type':'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: newForm
    
    })

    //conditions à ajouter pr vérifier que formulaire est rempli avant de l'envoyer à l'API
    
        .then(response =>{
            if (response.status ===201){
                console.log("formulaire correctement envoyé, félicitations")
                // return response.json(); // parser la réponse en json
                const galleryWorks= document.querySelector(".gallery");
                galleryWorks.innerHTML= ""; // on le vide puis on fait un appel à la fonction main 
                main();

                //mettre à jour le contenu de la modale en fonction de response
                modaleGrid.innerHTML=""; // on vide contenu gallerie modale 
                fetchData(); // on appelle la fonction fetchData pr rempir de nouveau

                const buttonSubmitFormAjoutPhoto= document.querySelector('.submit-form-ajout-photo');
                buttonSubmitFormAjoutPhoto.style.backgroundColor="#1D6154";
                buttonSubmitFormAjoutPhoto.style.color="white";
                formAjoutProjet.reset();// on vide les inputs du formulaire en appelant la méthode reset()
                
                // const fichierPhoto= document.querySelector('#fichier-photo');
                // fichierPhoto.value=""; ne fonctionne pas 

                // preview.innerHTML="";
                // preview.innerHTML= `<i class="fas fa-sharp fa-regular fa-image"></i>
                // <label for="fichier-photo">+ Ajouter photo</label>
                // <input type="file" name="fichier-photo" id="fichier-photo" accept="image/png, image/jpg" max-size="4194304">
                // <p>jpg, png : 4mo max</p>`;
                // preview.style.padding="30px";

                // closeModale(); // on ferme la modale
                bigContainer.style.display=""; 
                bigContainer2.style.display="none"; //on fait disparaitre la partie 2 de la modale et on fait apparaitre partie 1                

                console.log(input.files[0]);
                
                return response.json
                
            }else{
                console.log("formulaire pas envoyé")
                throw new Error("La requête a échoué")
            }
        })
        .then(data => {console.log(data)})
        .catch(erreur => console.error(erreur))
    
    
    
    })





    ////////////////////////////////////////////
    // GESTION DE LA FERMETURE DE LA MODALE //
    ////////////////////////////////////////////

    
    //Pour fermer la modale 
        // 1/ En cliquant sur bouton fermer
    let closeModaleButton = document.getElementsByClassName('close-modale-button');
    console.log(closeModaleButton)
    for (let k=0; k<closeModaleButton.length; k++){
            closeModaleButton[k].addEventListener("click",function(){
            //enregistrer l'état de la modale dans localstorage
            localStorage.setItem("modaleState2","closed");
            
            modal.style.display="none";
            
        })
    }
        // 2/ En cliquant n'importe où en dehors de la modale

    function closeModale(){
        //enregistrer l'état de la modale dans localstorage
        localStorage.setItem("modaleState2","closed");

        modal.style.display="none"
    }    
        //on écoute les clics en dehors de la modale
    window.addEventListener("click",function(event){
        if (event.target===modal){
            closeModale()
        };
    })        


        // 3/ En appuyant sur la touche esc ou escape
    window.addEventListener("keydown",function(event){

        if (event.key==='Escape' || event.key==='Esc'){
            closeModale()
        }    
        }) 
}



// Message d'erreur en cas de mauvaise combinaison mot de passe-identifiant //
let errorMsg = document.createElement("p");
errorMsg.innerHTML="Erreur dans l'identifiant ou le mot de passe";
const containerErrorMsg= document.querySelector(".error-msg");
containerErrorMsg.appendChild(errorMsg);
containerErrorMsg.style.display="none"; // modifier cela si combinaison mauvaise dans la suite //

//Récupérer les éléments nécessaires //


const form = document.querySelector('#login-form');

form.addEventListener("submit",function(event){
    event.preventDefault();

    const newForm = new FormData(form);
    const payload = new URLSearchParams(newForm);
    
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'accept': 'application/json'
          },
        body: payload
    })
    .then((response) =>response.json())
    .then((data)=>{

        if (data.userId==1){
            localStorage.setItem("token",data.token);
            //avec ceci le token reste stocké 
            location.href="index.html";
        }
        else{
            
            containerErrorMsg.style.display="flex";
            document.querySelector('#email').value=null;
            document.querySelector('#password').value=null;
        }
    });

   
}); 








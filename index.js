import apiKey from "./module/secret.js";

let villeChoisie; 

if ('geolocation' in navigator) { // recherche si geolocation est dans le navigator

    let options = {
        enableHighAccuracy: true // force une recherche plus précise, par defaut en false
    }

    let watch = navigator.geolocation.watchPosition((position) => {

        async function meteoGeo() {
            const urlGeo ='https://api.openweathermap.org/data/2.5/weather?lon=' + position.coords.longitude + '&lat=' + position.coords.latitude + '&appid=' + apiKey + '&units=metric';
            // url qui contient les coordonnées ce qui change l'appe ajax par rapport à la ville qui correspond au coordonnée

            const requete = await fetch(urlGeo, { // requête fetch
                method: 'GET'
            });
        
            if (!requete.ok) { // si la requete n'est pas ok, il y a une erreur
                alert('Un problème est survenu.');
            }
            else {
                let donnee = await requete.json(); //récupère les données
                document.querySelector('#temperaturePrin').textContent = donnee.main.temp; // on choisit ce qu'on veut par rapport au donnée récupéré
                document.querySelector('#ville').textContent = donnee.name; // le textcontent change la valeur de base de l'id ville par la valeur donnée par l'api nommé "name", qui est le nom de la ville
            }
        }
        meteoGeo(); // appel de la fonction qui fait une requête ajax

        navigator.geolocation.clearWatch(watch); // efface les données de géolocalisation, après utilisation

    },error, options); // paramètre de la fonction, si il y a une erreur c'est que la géolocalisation est possible, mais que l'utilisateur à interdit l'accès à sa position

    function error() { // la fonction erreur qui indique par defaut la météo de montréal
        recevoirMeteo("Montréal");
    };
}
else { // si geolocalisation pas disponible je force une ville à apparaître
    error(); // appel de la fonction erreur
}

const recherche = document.querySelector('#recherche'); // input
const btnRechercher = document.querySelector('#btnRechercher'); //btn input

btnRechercher.addEventListener('click', e => { // à l'véènement du bouton "click" execute v
    e.preventDefault(); // supprime l'évènement pas défault du formulaire grâce au paramètre "e" = "event" l'evenement du click
    recevoirMeteo(recherche.value); // demande la météo en requete ajax avec le nom de la ville stocker qui est la valeur de l'input
    recherche.value = ""; // efface pour avoir un champs vide lors de prochaine saisie
});

const btnChangerVille = document.querySelector('#btnChangerVille');
const inputModal = document.querySelector('#inputModal'); // input modal
const btnValider = document.querySelector('#btnValider'); // btn modal

btnChangerVille.addEventListener('click', e => {
    e.preventDefault();
    inputModal.value.focus(); // met le focus dans l'input quand le modal s'ouvre
});

btnValider.addEventListener('click', e => {
    e.preventDefault();
    recevoirMeteo(inputModal.value);
    inputModal.value = "";
});

async function recevoirMeteo(ville) { // fonction principal qui permet de reçevoir la météo par rapport au nom de la ville et pas de sa localisation
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + ville + '&appid=' + apiKey + '&units=metric';

    const requete = await fetch(url, {
        method: 'GET'
    });

    if (!requete.ok) {
        alert('Un problème est survenu.');
    }
    else {
        let donnee = await requete.json(); //récupère les données
        document.querySelector('#temperaturePrin').textContent = donnee.main.temp; 
        document.querySelector('#ville').textContent = donnee.name;
    }
}

// console.log("chose à aborder : changer la phrase du temps et voir pour image, mettre la météo dans les cartes de la section accordéon")
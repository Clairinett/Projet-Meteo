import apiKey from "./module/secret.js";

// FETCH DE RECHERCHE PAR VILLE //

async function recevoirMeteo(ville, idVille, idCodePays, idTemperature, idDescription, idImg) { 
    // fonction principal qui permet de reçevoir la météo par rapport au nom de la ville et pas de sa localisation
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + ville + '&appid=' + apiKey + '&units=metric';

    const requete = await fetch(url, {
        method: 'GET'
    });

    if (!requete.ok) {
        alert('Un problème est survenu.');
    }
    else {
        const donnee = await requete.json(); //récupère les données
        document.querySelector(idVille).textContent = donnee.name;
        document.querySelector(idCodePays).textContent = donnee.sys.country;
        document.querySelector(idTemperature).textContent = donnee.main.temp;

        let descriptionTemps = donnee.weather[0].main;

        const paragrapheTemps = document.querySelector(idDescription);
        const iconMeteo = document.querySelector(idImg);

        switch(descriptionTemps) {
            case 'Clear':
                iconMeteo.innerHTML = '<img src="./assets/img/soleil.png" alt="icon soleil">';
                paragrapheTemps.textContent = "Le ciel est ensoleillé.";
            break;
            case 'Clouds':
                iconMeteo.innerHTML = '<img src="./assets/img/des-nuages.png" alt="icon nuage">';
                paragrapheTemps.textContent = "Le ciel est nuageux.";
            break;
            case 'Snow':
                iconMeteo.innerHTML = '<img src="./assets/img/flocon-de-neige.png" alt="icon neige">';
                paragrapheTemps.textContent = "Le ciel est neigeux.";
            break;
            case 'Rain':
                iconMeteo.innerHTML = '<img src="./assets/img/pluie.png" alt="icon pluie">';
                paragrapheTemps.textContent = "Le ciel est pluvieux.";
            break;
            case 'Drizzle':
                iconMeteo.innerHTML = '<img src="./assets/img/bruine.png" alt="icon bruine">'
                paragrapheTemps.textContent = "Le ciel est bruineux (pluie fine).";
            break;
            case 'Thunderstorm':
                iconMeteo.innerHTML = '<img src="./assets/img/tonnere.png" alt="icon orage">';
                paragrapheTemps.textContent = "Le ciel est orageux.";
            break;
            default:
                iconMeteo.innerHTML = '<img src="./assets/img/brouillard.png" alt="icon brouillard">'
                paragrapheTemps.textContent = "Le temps est couvert.";
        }
    };
};
recevoirMeteo('Cologne', '#villeUn', '#codePaysUn', '#tempUn','#descriptionUn', '#iconMeteoUn');
recevoirMeteo('Melbourne', '#villeDeux', '#codePaysDeux', '#tempDeux','#descriptionDeux', '#iconMeteoDeux');
recevoirMeteo('Tokyo', '#villeTrois', '#codePaysTrois', '#tempTrois','#descriptionTrois', '#iconMeteoTrois');


// ZONE BOUTON INPUT //

const recherche = document.querySelector('#recherche'); // input
const btnRechercher = document.querySelector('#btnRechercher'); //btn input

btnRechercher.addEventListener('click', e => { // à l'véènement du bouton "click" execute v
    e.preventDefault(); // supprime l'évènement pas défault du formulaire grâce au paramètre "e" = "event" l'evenement du click
    recevoirMeteo(recherche.value, '#ville', '#codePays', '#temperaturePrin', '#temps', '#iconMeteo'); // demande la météo en requete ajax avec le nom de la ville stocker qui est la valeur de l'input
    recherche.value = ""; // efface pour avoir un champs vide lors de prochaine saisie
});

const btnChangerVille = document.querySelector('#btnChangerVille');
const inputModal = document.querySelector('#inputModal'); // input modal
const btnValider = document.querySelector('#btnValider'); // btn modal

btnChangerVille.addEventListener('click', e => {
    e.preventDefault();
    inputModal.focus(); // met le focus dans l'input quand le modal s'ouvre
});

btnValider.addEventListener('click', e => {
    e.preventDefault();
    recevoirMeteo(inputModal.value, '#ville', '#codePays', '#temperaturePrin', '#temps', '#iconMeteo');
    inputModal.value = "";
});


// METEO PAR GEOLOCALISATION //

if ('geolocation' in navigator) { // recherche si geolocation est dans le navigator

    let options = {
        enableHighAccuracy: true // force une recherche plus précise, par defaut en false
    };

    let watch = navigator.geolocation.watchPosition((position) => { // récupère la position du navigateur en paramètre

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
                let nomVille = document.querySelector('#ville').textContent = donnee.name; // le textcontent change la valeur de base de l'id ville par la valeur donnée par l'api nommé "name", qui est le nom de la ville
                document.querySelector('#codePays').textContent = donnee.sys.country;

                recevoirMeteo(nomVille, '#ville', '#codePays', '#temperaturePrin', '#temps', '#iconMeteo');
            };
        };
        meteoGeo(); // appel de la fonction qui fait une requête ajax

        navigator.geolocation.clearWatch(watch); // efface les données de géolocalisation, après utilisation

    },error, options); // paramètre de la fonction, si il y a une erreur c'est que la géolocalisation est possible, mais que l'utilisateur à interdit l'accès à sa position

    function error() { // la fonction erreur qui indique par defaut la météo de montréal
        recevoirMeteo('Montréal', '#ville', '#codePays', '#temperaturePrin', '#temps', '#iconMeteo');
    };
}
else { // si geolocalisation pas disponible je force une ville à apparaître
    error(); // appel de la fonction erreur
};
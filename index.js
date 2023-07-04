let villeChoisie;

if ('geolocation' in navigator) {
    let watch = navigator.geolocation.watchPosition((position) => {

        async function meteoGeo() {
            const urlGeo ='https://api.openweathermap.org/data/2.5/weather?lon=' + position.coords.longitude + '&lat=' + position.coords.latitude + '&appid=f2d16c620732489a9863d5f2b2aa26a5&units=metric';

            const requete = await fetch(urlGeo, {
                method: 'GET'
            });
        
            if (!requete.ok) {
                alert('Un problème est survenu.');
            }
            else {
                let donnee = await requete.json(); //récupère les données
                document.querySelector('#temperaturePrin').textContent = donnee.main.temp; // on choisit ce qu'on veut par rapport au donnée récupéré
                document.querySelector('#ville').textContent = donnee.name;
            }
        }
        meteoGeo(position);

        navigator.geolocation.clearWatch(watch);

    },error, options = {enableHighAccuracy: true});

}
else {
    let villeChoisie = "Montreal";
    recevoirMeteo(villeChoisie);
}

function error() {
    let villeChoisie = "Montreal";
    recevoirMeteo(villeChoisie);
}

let changerDeVille = document.querySelector('#changer');
changerDeVille.addEventListener('click', () => {
    let villeChoisie = prompt('Quelle ville souhaitez voir ?');
    recevoirMeteo(villeChoisie);
})


async function recevoirMeteo(ville) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + ville + '&appid=f2d16c620732489a9863d5f2b2aa26a5&units=metric';

    const requete = await fetch(url, {
        method: 'GET'
    });

    if (!requete.ok) {
        alert('Un problème est survenu.');
    }
    else {
        let donnee = await requete.json(); //récupère les données
        document.querySelector('#temperaturePrin').textContent = donnee.main.temp; // on choisit ce qu'on veut par rapport au donnée récupéré
        document.querySelector('#ville').textContent = donnee.name;
    }
}
'use strict';
var photosData = [];

var inter = setInterval(function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (photosData.length >= 5000) {
                clearInterval(inter)
            } else {
                let response = JSON.parse(this.responseText);
                photosData = [...photosData, ...response];
                response.forEach(function (item) {
                    let option = document.createElement('option');
                    option.setAttribute("value", item.id);
                    option.innerHTML = item.title;
                    document.getElementById('title').appendChild(option);
                });
            }
        }
    };
    xhttp.open("GET", `https://jsonplaceholder.typicode.com/photos?_start=${photosData.length}&_limit=${10}`, true);
    xhttp.send();
}, 1000);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function generateRandomCanvas() {
    document.getElementById("canvasContainer").innerHTML = '';
    for (let i = 0; i < getRandomInt(2, 5); i++) {
        let canvas = document.createElement('canvas');
        canvas.setAttribute("id", i);
        document.getElementById("canvasContainer").appendChild(canvas);
    }
}

function insertToCanvas() {
    let select = document.getElementById("title");
    let option = select.options[select.selectedIndex];
    let filterPhoto = photosData.filter(photo => photo.id === Number(option.value))[0];
    console.log(filterPhoto.thumbnailUrl);
}
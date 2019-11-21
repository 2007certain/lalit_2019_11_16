'use strict';
var photosData = [];
var canvases = [];
var isTouched = false;

window.addEventListener("touchstart", function () {
    isTouched = true;
});

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
    document.getElementById("show-warning").innerHTML = '';
    document.getElementsByTagName("canvasContainer").innerHTML = '';
    for (let i = 0; i < getRandomInt(2, 5); i++) {
        let canvas = document.createElement('canvas');
        canvas.setAttribute("id", i);
        new fabric.Canvas(canvas.getAttribute(i));
        document.getElementById("canvasContainer").appendChild(canvas);
    }
    let cans = document.getElementsByTagName('canvas');
    for (let i = 0; i < cans.length; i++) {
        if (cans[i].getAttribute("id")) {
            canvases.push(new fabric.Canvas(cans[i].getAttribute("id")));
        }
    }
    addEventsOnCanvasAndWindow();
}

function addEventsOnCanvasAndWindow() {
    var object, canvasFrom;
    canvases.forEach(canvas => {
        canvas.on('mouse:down', function () {
            if (this.getActiveObject()) {
                this.getActiveObject().clone(function (cloned) {
                    object = cloned;
                });
                canvasFrom = this.lowerCanvasEl.id;
            }
        })
    })

    document.addEventListener('mouseup', function (evt) {
        if (evt.target.localName === 'canvas' && canvasFrom) {
            let canvasId = $(evt.target).siblings().attr('id');
            if (canvasId !== canvasFrom) {
                let canvas = canvases[canvasId];
                object.clone(function (clonedObj) {
                    canvas.discardActiveObject();
                    clonedObj.set({
                        left: clonedObj.left + 10,
                        top: clonedObj.top + 10,
                        evented: true,
                    });
                    if (clonedObj.type === 'activeSelection') {
                        clonedObj.canvas = canvas;
                        clonedObj.forEachObject(function (obj) {
                            canvas.add(obj);
                        });
                        clonedObj.setCoords();
                    } else {
                        canvas.add(clonedObj);
                    }
                    object.top += 10;
                    object.left += 10;
                    canvas.setActiveObject(clonedObj);
                    canvas.requestRenderAll();
                });
            }
        }
        canvasFrom = '';
        object = {};
    });
}

function insertToCanvas() {
    if (canvases.length > 0) {
        let select = document.getElementById("title");
        let option = select.options[select.selectedIndex];
        let filterPhoto = photosData.filter(photo => photo.id === Number(option.value))[0];
        fabric.Image.fromURL(filterPhoto.thumbnailUrl, (img) => {
            canvases[0].add(img);
        });
    } else {
        document.getElementById("show-warning").innerHTML = 'Draw canvas to insert picture';
    }

}

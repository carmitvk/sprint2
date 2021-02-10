
'use strict'
var gElCanvas;
var gCtx;


function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallery();
}

function onNavClicked(el, clsName) {
    var elements = document.querySelectorAll('.sub-nav-press.sub-nav');
    elements.forEach(element => {
        element.classList.toggle('sub-nav-press');
    }); 
    el.classList.toggle('sub-nav-press');

    elements = document.querySelectorAll('section');
    elements.forEach(element => {
        element.classList.add('hide');
    })
    var element = document.querySelector('.'+clsName);
    element.classList.remove('hide');
}


function drawText(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = gColor
    gCtx.font = '40px Arial'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function renderGallery(){
    var imgs = getImgs();
    var strHtml = imgs.map(img => {
                                    return `<img class='one-img' src="./img/${img.id}.jpg" onclick='onPickImg(${img.id})' alt="">`
                                  });

    var elGallery = document.querySelector('.gallery-container');
    elGallery.innerHTML = strHtml.join('');
}

function onPickImg(id){
    //put into canvas
    document.querySelector('canvas').innerHTML = ''
    // var reader = new FileReader();

    // reader.onload = function (event) {
        var img = new Image()
        img.src = `img/${id}.jpg`; //event.target.result
    //     img.onload = onImageReady.bind(null, img)
    //     // gImg = img
    // }
    // console.log(ev.target.files[0]);
    // reader.readAsDataURL(ev.target.files[0])

    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);






    //hide gallery
    var element = document.querySelector('.gallery-container');
    element.classList.add('hide');

    //display the Editor
    var element = document.querySelector('.editor-container');
    element.classList.remove('hide');

    //Save to current Meme

}


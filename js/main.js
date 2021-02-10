
'use strict'
var gElCanvas;
var gCtx;


function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallery();
    //hide gallery
    var element = document.querySelector('.gallery-container');
    element.style.display= 'none';
    
    //display the Editor
    element = document.querySelector('.editor-container');
    element.style.display= 'flex';
}

function onNavClicked(el, clsName) {
    var elements = document.querySelectorAll('.sub-nav-press.sub-nav');
    elements.forEach(element => {
        element.classList.toggle('sub-nav-press');
    });
    el.classList.toggle('sub-nav-press');

    elements = document.querySelectorAll('section');
    elements.forEach(element => {
        // element.classList.add('hide');
        element.style.display= 'none';
    })
    var element = document.querySelector('.' + clsName);
    element.style.display= 'flex';
    // element.classList.remove('hide');
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

function renderGallery() {
    var imgs = getImgs();
    var strHtml = imgs.map(img => {
        return `<img class='one-img' src="img/${img.id}.jpg" onclick='onPickImg(${img.id})' alt="">`
    });

    var elGallery = document.querySelector('.gallery-container');
    elGallery.innerHTML = strHtml.join('');
}



function onPickImg(id) {
    //hide gallery
    var element = document.querySelector('.gallery-container');
    element.style.display= 'none';

    //display the Editor
    element = document.querySelector('.editor-container');
    element.style.display= 'flex';

    //Save to current Meme
    gCurrMeme.selectedImgId = id;

    //Editor pressed, Gallery not //TODO

    //print data on canvas
    renderCanVas();
}

function renderCanVas(){


    //put into canvas
    document.querySelector('canvas').innerHTML = ''
    var img = new Image()
    img.src = gImgs[gCurrMeme.selectedImgId-1].url;
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}
// function onCleanCanvas(){

// }

function onAddLine(){

}
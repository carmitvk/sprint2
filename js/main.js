
'use strict'
var gElCanvas;
var gCtx;


function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderCanVas();
    renderGallery();
    renderMems();
    var element = document.getElementById('editor-tab');
    let event = new Event("click");
    element.dispatchEvent(event);
}

function onNavClicked(el, clsName) {
    var elements = document.querySelectorAll('.sub-nav-press.sub-nav');
    elements.forEach(element => {
        element.classList.toggle('sub-nav-press');
    });
    el.classList.toggle('sub-nav-press');

    elements = document.querySelectorAll('section');
    elements.forEach(element => {
        element.style.display = 'none';
    })
    var element = document.querySelector('.' + clsName);
    element.style.display = 'flex';
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
        return `<img class='one-img' src='${img.url}' onclick="onPickImg(${img.id},'${img.url}')" alt="">`
    });
    var elGallery = document.querySelector('.gallery-container');
    elGallery.innerHTML = strHtml.join('');
}

function renderMems() {
    var memes = getMemes();
    // var htmlStartContainer = `<div class="memes-canvas-container flex">`
    var strHtmls = memes.map(meme => {
        return `<canvas id="meme-canvas${meme.id}" class="flex" onclick="onPickMeme(${meme.id})" height="250" width="250">    
                </canvas>`
    });
    // var htmlEndContainer = `</div>`;
    var elMemes = document.querySelector('.memes-container');
    // elMemes.innerHTML = htmlStartContainer + strHtmls.join('') + htmlEndContainer;
    elMemes.innerHTML = strHtmls.join('');
    renderMemCanvases();
}

function renderMemCanvases() {
    var memes = getMemes();

    memes.forEach((meme) => {
        var canvasId = `meme-canvas${meme.id}`;
        var elMemeCanvs = document.getElementById(canvasId);
        var ctx = elMemeCanvs.getContext('2d');
        
        elMemeCanvs.innerHTML = ''
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, elMemeCanvs.width, elMemeCanvs.height);

            meme.lines.forEach((line) => {
                ctx.lineWidth = 2
                ctx.strokeStyle = line.stroke;
                ctx.fillStyle = line.color;
                ctx.font = '' + line.fontSize + 'px ' + line.fontFamily;
                ctx.textAlign = line.align;
                var text = line.txt;

                var x = line.x
                var y = line.y

                ctx.fillText(text, x, y)
                ctx.strokeText(text, x, y)
            });
        }
        img.src = meme.selectedImgUrl;
    });
}

function onPickImg(id, url) {
    //hide gallery
    var element = document.querySelector('.gallery-container');
    element.style.display = 'none';

    //display the Editor
    element = document.querySelector('.editor-container');
    element.style.display = 'flex';

    //Save to current Meme
    setCurrImg(id, url);

    //Editor pressed, Gallery not //TODO

    //print data on canvas
    renderCanVas();
}

function onPickMeme(memeId) {
    //hide gallery
    var element = document.querySelector('.memes-container');
    element.style.display = 'none';

    //display the Editor
    element = document.querySelector('.editor-container');
    element.style.display = 'flex';

    var pickedMeme = getMemById(memeId);

    if (pickedMeme === -1) return;

    //Set it as a new current Meme
    setCurrMemeToNew(pickedMeme);

    //Editor pressed, Gallery not //TODO

    //print data on canvas
    renderCanVas();
}

function renderCanVas() {
    var currMeme = getCurrMeme();

    //put into canvas
    document.querySelector('canvas').innerHTML = ''
    var img = new Image();
    img.onload = function () {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);

        currMeme.lines.forEach((line) => {
            gCtx.lineWidth = 2
            gCtx.strokeStyle = line.stroke;
            gCtx.fillStyle = line.color;
            gCtx.font = '' + line.fontSize + 'px ' + line.fontFamily;
            gCtx.textAlign = line.align;
            var text = line.txt;
            var x = line.x
            var y = line.y

            gCtx.fillText(text, x, y)
            gCtx.strokeText(text, x, y)
        });
    }
    img.src = currMeme.selectedImgUrl;
}

function onSwitchFocus() {
    var currMeme = getCurrMeme();
    currMeme.selectedLineIdx++;
    if (currMeme.selectedLineIdx > currMeme.lines.length - 1) {
        currMeme.selectedLineIdx = 0;
    }
}

function onAddLine() {
    var currMeme = getCurrMeme();
    var txt = document.querySelector('input[name=textLine]').value;

    var x = gElCanvas.width / 2;
    var y;
    if (currMeme.lines.length === 0) {
        y = 50;
    } else if (currMeme.lines.length === 1) {
        y = gElCanvas.height-20;
    } else if (currMeme.lines.length === 2) {
        y = gElCanvas.height / 2;
    } else {
        y = currMeme.lines[currMeme.selectedLineIdx].y + 50;
        if (y > gElCanvas.height) {
            y = 20;
        }
    }

    var newLine = createLine(txt, x, y);
    addLine(newLine);
    currMeme.selectedLineIdx = currMeme.lines.length - 1;
    renderCanVas();
}

function onMoveRight() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].x = currMeme.lines[currMeme.selectedLineIdx].x + 5;
    renderCanVas();
}

function onMoveLeft() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].x = currMeme.lines[currMeme.selectedLineIdx].x - 5;
    renderCanVas();
}

function onMoveUp() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].y = currMeme.lines[currMeme.selectedLineIdx].y - 5;
    renderCanVas();
}

function onMoveDown() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].y = currMeme.lines[currMeme.selectedLineIdx].y + 5;
    renderCanVas();
}

function onRemoveLine() {
    var currMeme = getCurrMeme();
    currMeme.lines.splice(currMeme.selectedLineIdx, 1);
    currMeme.selectedLineIdx = currMeme.lines.length - 1;

    renderCanVas();
}

function onSetFontFamily(fontFamily) {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].fontFamily = fontFamily;
    renderCanVas();
}

function onIncreaseFont() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].fontSize++;
    renderCanVas();
}

function onDecreaseFont() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].fontSize--;
    renderCanVas();
}

function onAlignLeft() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].x = 10;
    currMeme.lines[currMeme.selectedLineIdx].align = 'left';
    renderCanVas();
}

function onAlignCenter() {
    var currMeme = getCurrMeme();
    var elementCenter = document.querySelector('.canvas-container').offsetWidth / 2;
    currMeme.lines[currMeme.selectedLineIdx].x = elementCenter;
    currMeme.lines[currMeme.selectedLineIdx].align = 'center';
    renderCanVas();
}

function onAlignRight() {
    var currMeme = getCurrMeme();
    var elementEnd = document.querySelector('.canvas-container').offsetWidth + 40;
    console.log('elementEnd===', elementEnd);
    currMeme.lines[currMeme.selectedLineIdx].x = elementEnd;
    currMeme.lines[currMeme.selectedLineIdx].align = 'right';
    renderCanVas();
}

function onTextStroke() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].stroke = document.querySelector('input[name=switchStroke]').value;
    renderCanVas();
}

function onSetColor() {
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].color = document.querySelector('input[name=setColor]').value;
    renderCanVas();
}

function onSaveLocally() {
    saveLocallyCurrMeme();
    renderMems();
}

function onFacebookPublish() {

}



function onDownload() {

}
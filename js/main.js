
'use strict'
var gElCanvas;
var gCtx;
var gCurrSticker;
var gStartPos;
const gTouchEvs = ['ontouchmove', 'ontouchstart', 'ontouchend']


function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderCanVas();
    renderMems();
    renderStickers();
    addListeners();
    // renderAutoComplete();
    // renderClickWords();
    moveToTab('gallery-tab');
    renderGallery();
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        // resizeCanvas();
        renderCanVas();
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container');
//     gElCanvas.width = elContainer.offsetWidth;
//     gElCanvas.height = elContainer.offsetHeight;
// }

function moveToTab(tabName) {
    var element = document.getElementById(tabName);
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

function onMenuClicked() {
    var element = document.querySelector('.main-nav');
    element.classList.toggle('menu-open');

    element = document.querySelector('main');
    element.classList.toggle('menu-open');

    var elMainNav = document.querySelector('.main-nav');

    element = document.querySelector('.menu-btn');
    element.classList.toggle('menu-open')
    if (element.innerHTML === 'X') {
        elMainNav.style.display = 'none';
        element.innerHTML = '☰';

    } else {
        element.innerHTML = 'X';
        elMainNav.style.display = 'flex';
    }
}


function renderGallery() {
    var imgs = getImgs();
    var strHtml = imgs.map(img => {
        return `<img class='one-img' src='${img.url}' onclick="onPickImg(${img.id},'${img.url}')" alt="">`
    });
    var elGallery = document.querySelector('.img-container');
    elGallery.innerHTML = strHtml.join('');

}

function renderMems() {
    var memes = getMemes();
    var strHtmls = memes.map(meme => {
        return `<canvas id="meme-canvas${meme.id}" class="flex" onclick="onPickMeme(${meme.id})" height="200" width="200">    
                </canvas>`
    });
    var elMemes = document.querySelector('.memes-container');
    elMemes.innerHTML = strHtmls.join('');
    renderMemCanvases();
}


function renderStickers() {
    var allStickers = getStickers();
    var newStickers = [];
    for (var i = 0; i < NUM_STICKERS_IN_PAGE; i++) {
        // if (i + gNumIncremets === allStickers.length) {
        //     gNumIncremets = 0;
        // }
        newStickers.push(allStickers[i + gNumIncremets]);
    }


    var strHtmls = newStickers.map(sticker => {
        return `<img src="${sticker.url}" id="sticker${sticker.id}" class="flex" onclick="onPickSticker(${sticker.id})"> `
    });
    var elStickers = document.querySelector('.stickers-container');
    elStickers.innerHTML = strHtmls.join('');
}

function onRightStickerPage(){
    rightStickerPage();
    renderStickers();
}

function onLeftStickerPage(){
    leftStickerPage();
    renderStickers();
}

// function renderStickers() {

// var stickers = getStickers();
// var strHtmls = stickers.map(sticker => {
//     return `<img src="${sticker.url}" id="sticker${sticker.id}" class="flex" onclick="onPickSticker(${sticker.id})"> `


// });
// var elStickers = document.querySelector('.stickers-container');
// elStickers.innerHTML = strHtmls.join('');
// }

function onClear() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height); //here
    var meme = getCurrMeme();
    meme.lines = null;
    meme.stickers = null;
    meme.lines = [];
    meme.stickers = [];


    moveToTab('gallery-tab');
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
                var fontSz = (line.x / gElCanvas.width) * line.fontSize;
                ctx.font = '' + fontSz + 'px ' + line.fontFamily;
                ctx.textAlign = line.align;
                var text = line.txt;

                //correct ratio in % because the meme-canvas is not same size as editor-canvas. 
                var x = (line.x / gElCanvas.width) * elMemeCanvs.width;
                var y = (line.y / gElCanvas.height) * elMemeCanvs.height;

                ctx.fillText(text, x, y)
                ctx.strokeText(text, x, y)
            });

            meme.stickers.forEach((sticker) => {
                var canvasId = `sticker${sticker.id}`;
                var elSticker = document.getElementById(canvasId);

                var imgSticker = new Image();
                imgSticker.onload = function () {
                    var x = (sticker.x / gElCanvas.width) * elMemeCanvs.width;
                    var y = (sticker.y / gElCanvas.height) * elMemeCanvs.height;

                    ctx.drawImage(imgSticker, x, y, elMemeCanvs.width / gElCanvas.width * 30, elMemeCanvs.height / gElCanvas.height * 30); //30=img sz

                }
                var allStickers = getStickers();
                imgSticker.src = allStickers[sticker.id - 1].url;
            });
        }
        img.src = meme.selectedImgUrl;
    });
}


function onInsertText(el) {
    console.log('onInsertText');
    var currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].txt = el.value;
    renderCanVas();
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

    //Editor pressed, Gallery not 
    moveToTab('editor-tab');

    //print data on canvas
    renderCanVas();
}

function onPickSticker(id) {

    //Save to current Meme
    setCurrSticker(id);

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

    setDataControls(pickedMeme);

    //Editor pressed, Gallery not 
    moveToTab('editor-tab');

    //print data on canvas
    renderCanVas();
}

function setDataControls(pickedMeme) {
    if (!pickedMeme.lines || pickedMeme.lines.length === 0) return;
    document.querySelector('.set-color').value = pickedMeme.lines[pickedMeme.selectedLineIdx].color;
    document.querySelector('.switch-stroke').value = pickedMeme.lines[pickedMeme.selectedLineIdx].stroke;
    document.querySelector('.font-family').value = pickedMeme.lines[pickedMeme.selectedLineIdx].fontFamily;
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

        if (currMeme.lines && currMeme.lines.length > 0) {
            //draw rect for selected row: 
            var startY = currMeme.lines[currMeme.selectedLineIdx].y - currMeme.lines[currMeme.selectedLineIdx].fontSize + 5;

            drawRect(0, startY, gElCanvas.width, currMeme.lines[currMeme.selectedLineIdx].fontSize);
        }

        currMeme.stickers.forEach((sticker) => {
            var canvasId = `sticker${sticker.id}`;
            var elSticker = document.getElementById(canvasId);

            var imgSticker = new Image();
            imgSticker.onload = function () {
                gCtx.drawImage(imgSticker, sticker.x, sticker.y, elSticker.width, elSticker.height);
            }
            var allStickers = getStickers();
            imgSticker.src = allStickers[sticker.id - 1].url;
        });
    }

    img.src = currMeme.selectedImgUrl;
}

function drawRect(x, y, width, heigh) {
    console.log('on drawRect');
    gCtx.beginPath()
    gCtx.rect(x, y, width, heigh)
    gCtx.fillStyle = 'rgba(0,0,0,.2)';
    gCtx.fillRect(x, y, width, heigh)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
}


function onSwitchFocus() {
    var currMeme = getCurrMeme();
    currMeme.selectedLineIdx++;
    if (currMeme.selectedLineIdx > currMeme.lines.length - 1) {
        currMeme.selectedLineIdx = 0;
    }
    renderCanVas();
}

function createNewLine() {
    console.log('createNewLine');
    //set x y
    var currMeme = getCurrMeme();
    var x = gElCanvas.width / 2;
    var y;
    if (currMeme.lines.length === 0) {
        y = 50;
    } else if (currMeme.lines.length === 1) {
        y = gElCanvas.height - 20;
    } else if (currMeme.lines.length === 2) {
        y = gElCanvas.height / 2;
    } else {
        y = currMeme.lines[currMeme.selectedLineIdx].y + 50;
        if (y > gElCanvas.height) {
            y = 20;
        }
    }
    var newLine = createLine('', x, y);
    addLine(newLine);
    currMeme.selectedLineIdx = currMeme.lines.length - 1;
    renderCanVas();
}

function onMoveRight() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].x = currMeme.lines[currMeme.selectedLineIdx].x + 5;
        renderCanVas();
    }
}

function onMoveLeft() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].x = currMeme.lines[currMeme.selectedLineIdx].x - 5;
        renderCanVas();
    }
}

function onMoveUp() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].y = currMeme.lines[currMeme.selectedLineIdx].y - 5;
        renderCanVas();
    }
}

function onMoveDown() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].y = currMeme.lines[currMeme.selectedLineIdx].y + 5;
        renderCanVas();
    }
}

function onRemoveLine() {
    var currMeme = getCurrMeme();
    currMeme.lines.splice(currMeme.selectedLineIdx, 1);
    currMeme.selectedLineIdx = currMeme.lines.length - 1;

    renderCanVas();
}

function onSetFontFamily(fontFamily) {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].fontFamily = fontFamily;
        renderCanVas();
    }
}

function onIncreaseFont() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].fontSize++;
        renderCanVas();
    }
}

function onDecreaseFont() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].fontSize--;
        renderCanVas();
    }
}

function onAlignLeft() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].x = 10;
        currMeme.lines[currMeme.selectedLineIdx].align = 'left';
        renderCanVas();
    }
}

function onAlignCenter() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        var elementCenter = document.querySelector('.canvas-container').offsetWidth / 2;
        currMeme.lines[currMeme.selectedLineIdx].x = elementCenter;
        currMeme.lines[currMeme.selectedLineIdx].align = 'center';
        renderCanVas();
    }
}

function onAlignRight() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        var elementEnd = document.querySelector('.canvas-container').offsetWidth + 40;
        currMeme.lines[currMeme.selectedLineIdx].x = elementEnd;
        currMeme.lines[currMeme.selectedLineIdx].align = 'right';
        renderCanVas();
    }
}

function onTextStroke() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].stroke = document.querySelector('input[name=switchStroke]').value;
        renderCanVas();
    }
}

function onSetColor() {
    var currMeme = getCurrMeme();
    if (currMeme.lines[currMeme.selectedLineIdx]) {
        currMeme.lines[currMeme.selectedLineIdx].color = document.querySelector('input[name=setColor]').value;
        renderCanVas();
    }
}

function onSaveLocally() {
    saveLocallyCurrMeme();
    renderMems();
}

function onDownload(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}

function onSetGalleryFilter(ev) {
    ev.preventDefault();
    console.log('onSetGalleryFilter');

    var filter = document.querySelector('#search-drop-list').value;
    setGalleryFilter(filter);
    renderGallery();

}

function renderImg() {
    setCurrImg(Date.now(), getLoadImgUrl()); //timestamp as id
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}


function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isStickerClicked(pos)) return
    gCurrSticker.isDragging = true;
    gStartPos = pos;
    document.body.style.cursor = 'grabbing'
}

function isStickerClicked(pos) {
    var meme = getCurrMeme();
    if (!meme || !meme.stickers || meme.stickers.length === 0) return false;
    var pickedSticker = meme.stickers.find(sticker =>
        (pos.x >= sticker.x && pos.x < sticker.x + 30)
        &&
        (pos.y >= sticker.y && pos.y < sticker.y + 30)
    );

    if (pickedSticker) {
        gCurrSticker = pickedSticker;
        return true;
    }
    return false;
}

function onMove(ev) {
    if (gCurrSticker && gCurrSticker.isDragging) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y

        gCurrSticker.x += dx
        gCurrSticker.y += dy

        gStartPos = pos
        renderCanVas()
        // renderCircle()
    }
}

function onUp() {
    if (!gCurrSticker) return;
    gCurrSticker.isDragging = false
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
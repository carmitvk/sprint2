'use strict'
const KEY_MEMES = 'gMemes';
var gNextId = 1;
var gMemes;
var gCurrMeme;
var gGalleryFilter;
var gNumIncremets = 0;

var gKeywords = { 'Politic': 2, 'Peoples': 4, 'Animales': 6, 'Cute': 2, 'Happy': 6, 'Robots': 4 };

const NUM_STICKERS_IN_PAGE = 5;

var gStickers = [{ id: 1, url: 'stickers/cat.png' },
{ id: 2, url: 'stickers/fire.jpg' },
{ id: 3, url: 'stickers/keren.jpg' },
{ id: 4, url: 'stickers/mask.jpg' },
{ id: 5, url: 'stickers/red.jpg' },
{ id: 6, url: 'stickers/star.jpg' },
{ id: 7, url: 'stickers/wow.jpg' }];

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['Politic', 'Peoples'] },
{ id: 2, url: 'img/2.jpg', keywords: ['Animales'] },
{ id: 3, url: 'img/3.jpg', keywords: ['Animales', 'Cute', 'Peoples'] },
{ id: 4, url: 'img/4.jpg', keywords: ['Animales'] },
{ id: 5, url: 'img/5.jpg', keywords: ['Cute', 'Peoples'] },
{ id: 6, url: 'img/6.jpg', keywords: ['Peoples'] },
{ id: 7, url: 'img/7.jpg', keywords: ['Cute', 'Peoples'] },
{ id: 8, url: 'img/8.jpg', keywords: ['Peoples'] },
{ id: 9, url: 'img/9.jpg', keywords: ['Cute', 'Happy', 'Peoples'] },
{ id: 10, url: 'img/10.jpg', keywords: ['Politic', 'Happy', 'Peoples'] },
{ id: 11, url: 'img/11.jpg', keywords: ['Peoples'] },
{ id: 12, url: 'img/12.jpg', keywords: ['Peoples'] },
{ id: 13, url: 'img/13.jpg', keywords: ['Peoples'] },
{ id: 14, url: 'img/14.jpg', keywords: ['Peoples'] },
{ id: 15, url: 'img/15.jpg', keywords: ['Peoples'] },
{ id: 16, url: 'img/16.jpg', keywords: ['Peoples', 'Happy'] },
{ id: 17, url: 'img/17.jpg', keywords: ['Politic', 'Peoples'] },
{ id: 18, url: 'img/18.jpg', keywords: ['Robots'] }
];

_createMemes();
gCurrMeme = _createCurrMeme();

function _createMemes() {
    var memes = loadFromStorage(KEY_MEMES)
    if (memes && memes.length) {
        //update next created index to start from last existing index in storage +1. 
        var maxIdx = 0;
        memes.forEach(meme => {
            if (meme.id > maxIdx) {
                maxIdx = meme.id;
            }
            gNextId = maxIdx + 1;
        });
    } else {
        memes = [];
    }
    gMemes = memes;
}

function _createCurrMeme() {
    return {
        id: gNextId++, selectedImgId: 2, selectedImgUrl: 'img/2.jpg', selectedLineIdx: 0, lines: [
            // {
            //     txt: 'I never eat Falafel',
            //     size: 20,
            //     align: 'left',
            //     color: 'red',
            //     stroke: 'black',
            //     fontSize: 40,
            //     fontFamily: 'Arial',
            //     x: 100,
            //     y: 100
            // },
            // {
            //     txt: 'I am second line',
            //     size: 20,
            //     align: 'left',
            //     color: 'red',
            //     stroke: 'black',
            //     fontSize: 40,
            //     fontFamily: 'Arial',
            //     x: 100,
            //     y: 400
            // }
        ],
        stickers: []
    }
}

function addLine(line) {
    gCurrMeme.lines.push(line);
}

function createLine(txt, x, y, size = 20, align = 'center', color = 'blue', stroke = 'black', fontSize = 30, fontFamily = 'Arial') {
    return {
        txt: txt,
        size: size,
        align: align,
        color: color,
        stroke: stroke,
        fontSize: fontSize,
        fontFamily: fontFamily,
        x: x,
        y: y
    }
}


function getMemes() {
    return gMemes;
}

function getCurrMeme() {
    return gCurrMeme;
}

function getStickers() {
    return gStickers
}

function rightStickerPage() {
    gNumIncremets++;
    var maxIdx = gStickers.length-NUM_STICKERS_IN_PAGE;

    if (gNumIncremets > maxIdx) {
        gNumIncremets --;
    }
}

function leftStickerPage() {
    gNumIncremets--;
    if (gNumIncremets <0) {
        gNumIncremets = 0;
    }
}

function setCurrImg(id, url) {
    gCurrMeme.selectedImgId = id;
    gCurrMeme.selectedImgUrl = url;
}

function setCurrSticker(id) {
    gCurrMeme.stickers.push({ id: id, x: 0, y: 0, isDragging: false });
}


function saveLocallyCurrMeme() {
    addMemeToMems();
    saveMemesToStorage();
}

function getMemById(memeId) {
    const pickedMeme = gMemes.find(meme => meme.id === memeId);
    if (!pickedMeme) return -1;
    return pickedMeme;
}


function getIdxMemById(id) {
    gMemes.findIndex(meme => meme.id === id);
}

function setCurrMemeToNew(pickedMeme) {
    gCurrMeme = pickedMeme; //all data are same
}

function addMemeToMems() {
    gCurrMeme.id = gNextId++;
    var newMeme;
    newMeme = JSON.parse(JSON.stringify(gCurrMeme))
    gMemes.push(newMeme);
}

function saveMemesToStorage() {
    saveToStorage(KEY_MEMES, gMemes)
}


function setGalleryFilter(filter) {
    gGalleryFilter = filter;
}

function getImgs() {
    if (!gGalleryFilter) return gImgs;
    var sortedImgs = gImgs.filter((img) => {
        return img.keywords.some((key) => {
            return key.toLowerCase().includes(gGalleryFilter.toLowerCase());
        });
    });

    if (!gImgs || !gImgs.length) {
        gImgs = [];
    }

    gKeywords[gGalleryFilter]++;

    return sortedImgs;
}


'use strict'
const KEY_MEMES = 'gMemes';
var gNextId = 1;
var gMemes;
var gCurrMeme;

var gKeywords = { 'politic': 12, 'animals': 1 };//TODO: fill data

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['politic'] },
{ id: 2, url: 'img/2.jpg', keywords: ['animals'] },
{ id: 3, url: 'img/3.jpg', keywords: ['animals'] },
{ id: 4, url: 'img/4.jpg', keywords: ['animals'] },
{ id: 5, url: 'img/5.jpg', keywords: ['animals'] },
{ id: 6, url: 'img/6.jpg', keywords: ['animals'] },
{ id: 7, url: 'img/7.jpg', keywords: ['animals'] },
{ id: 8, url: 'img/8.jpg', keywords: ['animals'] },
{ id: 9, url: 'img/9.jpg', keywords: ['animals'] },
{ id: 10, url: 'img/10.jpg', keywords: ['animals'] },
{ id: 11, url: 'img/11.jpg', keywords: ['animals'] },
{ id: 12, url: 'img/12.jpg', keywords: ['animals'] },
{ id: 13, url: 'img/13.jpg', keywords: ['animals'] },
{ id: 14, url: 'img/14.jpg', keywords: ['animals'] },
{ id: 15, url: 'img/15.jpg', keywords: ['animals'] },
{ id: 16, url: 'img/16.jpg', keywords: ['animals'] },
{ id: 17, url: 'img/17.jpg', keywords: ['animals'] },
{ id: 18, url: 'img/18.jpg', keywords: ['animals'] },
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
    }else{
        memes=[];
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
        ]
    }
}

function addLine(line){
    gCurrMeme.lines.push(line);
}

function createLine(txt,x,y,size=20,align='center',color='blue',stroke='black',fontSize=30,fontFamily='Arial'){
    return {
        txt: txt,
        size: size,
        align: align,
        color: color,
        stroke:stroke,
        fontSize:fontSize,
        fontFamily:fontFamily,
        x:x,
        y:y
    }
}


function getMemes() {
    return gMemes;
}

function getCurrMeme() {
    return gCurrMeme;
}

function setCurrImg(id, url) {
    gCurrMeme.selectedImgId = id;
    gCurrMeme.selectedImgUrl = url;
}

function saveLocallyCurrMeme() {
    addMemeToMems();
    saveMemesToStorage();
}

function getMemById(memeId){
    const pickedMeme = gMemes.find(meme => meme.id === memeId);
    if (!pickedMeme) return -1;
    return pickedMeme;
}

function getIdxMemById(id){
    gMemes.findIndex(meme => meme.id === id);
}

function setCurrMemeToNew(pickedMeme){
    gCurrMeme = pickedMeme; //all data are same
    // gCurrMeme.id=gNextId++; //except for id. its a new editble meme
}


function addMemeToMems(){
    gCurrMeme.id=gNextId++;
    var newMeme;
    newMeme =JSON.parse(JSON.stringify(gCurrMeme))
    gMemes.push(newMeme);
}

function saveMemesToStorage() {
    saveToStorage(KEY_MEMES, gMemes)
}

function getImgs() {
    return gImgs;
}
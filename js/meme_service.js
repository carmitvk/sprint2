
'use strict'
const KEY_MEME='gMeme';
var gNextId=1;
var gMemes

var gKeywords = { 'politic': 12, 'animals': 1 }
var gImgs = [   { id: 1, url: 'img/1.jpg', keywords: ['politic'] },
                { id: 2, url: 'img/2.jpg', keywords: ['animals'] },
                { id: 3, url: 'img/3.jpg', keywords: ['animals'] },
                { id: 4, url: 'img/4.jpg', keywords: ['animals'] },
                { id: 5, url: 'img/5.jpg', keywords: ['animals'] },
                { id: 6, url: 'img/6.jpg', keywords: ['animals'] },
                { id: 7, url: 'img/7.jpg', keywords: ['animals'] },
                { id: 8, url: 'img/8.jpg', keywords: ['animals'] },
                { id: 9, url: 'img/9.jpg', keywords: ['animals'] },
                { id: 9, url: 'img/10.jpg', keywords: ['animals'] },
                { id: 10, url: 'img/11.jpg', keywords: ['animals'] },
                { id: 11, url: 'img/12.jpg', keywords: ['animals'] },
                { id: 12, url: 'img/13.jpg', keywords: ['animals'] },
                { id: 13, url: 'img/14.jpg', keywords: ['animals'] },
                { id: 14, url: 'img/15.jpg', keywords: ['animals'] },
                { id: 15, url: 'img/16.jpg', keywords: ['animals'] },
                { id: 16, url: 'img/17.jpg', keywords: ['animals'] },
                { id: 17, url: 'img/18.jpg', keywords: ['animals'] },            
            ];

var defMemes =  [{selectedImgId: 1,  selectedLineIdx: 0, lines: [  {
                                                                    // startX:
                                                                    // startY:
                                                                    // endX:
                                                                    // endY:
                                                                    txt: 'I never eat Falafel',
                                                                    size: 20,
                                                                    align: 'left',
                                                                    color: 'red'
                                                                    }
                                                                ]}
                                                                    
                ]

_createMemes();

function _createMemes() {
    var memes = loadFromStorage(KEY_MEME)
    if (!memes || !memes.length) {
        memes = [];

        for (var i = 0; i < defMemes.length; i++) {
            var defMeme = defMemes[i]
            memes.push(_createMeme(defMeme));
        }
    } else {//update next created index to start from last existing index in storage +1. 
        var maxIdx=0;
        memes.forEach(meme => {
            if (meme.id > maxIdx) {
                maxIdx = meme.id;
            }
            gNextId = maxIdx+1;
        });
    }
    gMemes = memes;
    saveMemeToStorage();
    console.log('gMemes====',gMemes)
}


function _createMeme(meme){
    return {
            selectedImgId: 5,
            selectedLineIdx: 0,
            lines: [
                {
                txt: 'I never eat Falafel',
                size: 20,
                align: 'left',
                color: 'red'
                }
            ]




        // id:gNextId++,
        // selectedImgId: meme.selectedImgId,
        // selectedLineIdx: meme.selectedLineIdx,
        // lines: [
            // {
            //     // startX:
            //     // startY:
            //     // endX:
            //     // endY:
            //     txt: meme.lines['txt'],
            //     size: meme.lines['size'],
            //     align: meme.lines['align'],
            //     color: meme.lines['color']
            // }
        // ]
    }
}

function getMeme(){
    return gMemes;

}

function saveMemeToStorage(){
    saveToStorage(KEY_MEME, gMemes)
}


function getImgs(){
    return gImgs;
}
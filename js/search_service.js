'use strict'

var gSearchKeys = ['Politic', 'Peoples','Animales','Cute','Happy' ,'Robots'];

function getKeywords(){
    return gSearchKeys
}


function onSearchImg(ev) {
    ev.preventDefault();
    var filter = document.querySelector('#my-search').value;
    document.querySelector('#my-search').value = '';
    onSetGalleryFilter(filter);
}












//for search with size
// function renderAutoKeywords() {
//     const words = getKeywords();
//     var strHtml = words.map((word) => `<option value="${word}"></option>`);
//     document.querySelector('#search-drop-list').innerHTML = strHtml.join('');
// }
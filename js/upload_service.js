'use strict'

var gLoadImgUrl;

// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gElCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a id="share-facebook"  href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="openShare('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
         </a>`
        moveToTab('share-facebook')
    }
    doUploadImg(elForm, onSuccess);
}

function openShare(url){
    window.open(url);
}



function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}


function loadImageFromInput(ev, onImageReady) {
    document.querySelector('canvas').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image()
        img.src = 'img/2.jpg';//event.target.result; 
        img.onload = onImageReady.bind(null, img)
        gLoadImgUrl = img.src
    }
    reader.readAsDataURL(ev.target.files[0]);
}


function downloadImg(elLink) {
    var imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function getLoadImgUrl(){
    return gLoadImgUrl
}
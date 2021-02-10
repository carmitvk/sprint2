'use strict'

// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gElCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
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

// function loadImageFromInput(ev, onImageReady) {
//     document.querySelector('canvas').innerHTML = ''
//     var reader = new FileReader()

//     reader.onload = function (event) {
//         var img = new Image()
//         img.onload = onImageReady.bind(null, img)
//         img.src = event.target.result
//         // gImg = img
//     }
//     reader.readAsDataURL(ev.target.files[0])
// }

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('canvas').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image()
        img.src = 'img/2.jpg'; //event.target.result
        img.onload = onImageReady.bind(null, img)
        // gImg = img
    }
    console.log(ev.target.files[0]);
    reader.readAsDataURL(ev.target.files[0])
}




// function renderImg(img) {
//     gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
// }
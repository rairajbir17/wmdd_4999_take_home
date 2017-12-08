'use strict';

const URL_API = "https://2ctqiiywzl.execute-api.us-east-1.amazonaws.com/dev/image";

(() => {
    const listofImages = document.getElementById('listofImages');
  const imagestable = document.getElementById('imagestable');
  const uploadImage = document.getElementById('uploadImage');
  const updateimages = document.getElementById('updateimages');
  listofImages.style.display = 'none';
updateimages.addEventListener('click', () => {
    listofImages.style.display = 'none';
    getImages();
  });
  uploadImage.addEventListener('click', () => {
    saveImage();
  });

})();

function getImages() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.status === 200) {
            filltable(this.response);
        }
    };
    xhttp.open('GET', URL_API, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function saveImage() {

    let url = document.getElementById('imageUrl');
    var array = url.value.split('/');
    var filename = array[array.length-1];
    let description = document.getElementById('description');

    let body = {};
    body.imageurl = url.value;
    body.key = filename;
    body.description = description.value;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        listofImages.style.display = 'block';
        listofImages.innerHTML = "To Refresh the list, click on update";
    };

    xhttp.open('POST', URL_API);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(body));
}

function clearTable() {
    var rowCount = imagestable.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        imagestable.deleteRow(i);
    }
}

function filltable(response) {
    let jsonResponse = JSON.parse(response);
    var rows = [];
    clearTable();
    jsonResponse.Items.forEach(item => {
        rows.push(`<tr> \
            <td>${item.filename}</td> \
            <td>$${item.imageURL}</td> \
            <td>$${item.description}</td> \
        </tr>`);
    });
    $('imagestable.imagestable').append(rows.join());
}
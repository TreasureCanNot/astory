document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML('afterbegin', '<p>Hate the world</p>');
});

function changeBackground(color) {
    document.querySelector('.box').style.backgroundColor = color;
}




function appearItAll(){
    document.getElementById('showhide').style.display = 'block';
    document.getElementById('changethething').innerHTML="Hide";
    var element = document.getElementById('showhide');
    element.id = "hideshow";
    document.getElementById('changethething').onclick = disappearItAll;
}

function disappearItAll(){
    document.getElementById('hideshow').style.display = 'none';
    document.getElementById('changethething').innerHTML = "Show";
    var element = document.getElementById('hideshow');
    element.id = "showhide";
    document.getElementById('changethething').onclick = appearItAll;
}

function toggleText() {
    let textElement = document.getElementById('sh');
    let button = document.getElementById('change');

    if (textElement.style.display === "none") {
        textElement.style.display = "block";
        button.innerHTML = "Hide";
    } 
    else {
        textElement.style.display = "none";
        button.innerHTML = "Show";
    }
}




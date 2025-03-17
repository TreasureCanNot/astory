//document.addEventListener("DOMContentLoaded", function () {
//    document.body.insertAdjacentHTML('afterbegin', '<p style="color:yellow;//">Hate the world</p>');
//});



function changeBackground(color) {
    document.querySelector('.box').style.backgroundColor = color;
}


function controlPad(){
    let navContainer = document.getElementById('navContainer');
    let toggleButton = document.getElementById('toggleButton');

    if (navContainer.classList.contains('moved-navcontainer')){
        navContainer.classList.remove('moved-navcontainer');
        navContainer.classList.add('navcontainer');
        toggleButton.innerHTML = "Show";
    } else {
        navContainer.classList.add('moved-navcontainer');
        navContainer.classList.remove('navcontainer');
        toggleButton.innerHTML = "Hide";
    }
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




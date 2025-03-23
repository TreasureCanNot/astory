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






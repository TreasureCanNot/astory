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

let chapterSelectOngoing = false;

function chapterSelect() {
    if (chapterSelectOngoing) {
        return;
    }
    chapterSelectOngoing = true;

    let pad = document.getElementById('controlP')
    const links = document.querySelectorAll('.ni')
    const Hlinks = document.querySelectorAll('.NOni')
    let selector = document.getElementById('selector')
    let selectorPhone = document.getElementById('selector-phone')

    if (pad.classList.contains('controlP')) {
        pad.classList.remove('controlP')
        pad.classList.add('controlP-chapterMode')
    } else {
        pad.classList.remove('controlP-chapterMode')
        pad.classList.add('controlP')
    }

    if (selector.classList.contains('chapter-select')) {
        selector.classList.remove('chapter-select')
        selector.classList.add('chapter-selecting')
    } else {
        selector.classList.remove('chapter-selecting')
        selector.classList.add('chapter-select')
    }

    if (selectorPhone.classList.contains('chapter-select')) {
        selectorPhone.classList.remove('chapter-select')
        selectorPhone.classList.add('chapter-selecting')
    } else {
        selectorPhone.classList.remove('chapter-selecting')
        selectorPhone.classList.add('chapter-select')
    }

    let animationPromises = [];

    // Handle links
    links.forEach(function(element) {
        animationPromises.push(new Promise(resolve => {
            if (element.classList.contains('ni')) {
                element.classList.remove('ni');
                element.classList.add('NOni');
            }
            setTimeout(() => {
                element.classList.add('vanished');
                resolve();
            }, 1000);
        }));
    });

    // Handle Hlinks
    Hlinks.forEach(function(element) {
        animationPromises.push(new Promise(resolve => {
            if (element.classList.contains('vanished')) {
                element.classList.remove('vanished');
            }
            setTimeout(() => {
                if (element.classList.contains('NOni')) {
                    element.classList.remove('NOni');
                    element.classList.add('ni');
                }
                resolve();
            }, 1000);
        }));
    });

    // When all animations are done
    Promise.all(animationPromises).then(function() {
        chapterSelectOngoing = false;
    });
}
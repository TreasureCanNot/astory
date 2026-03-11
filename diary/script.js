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
    if (chapterSelectOngoing==true) {
        return;
    }
    chapterSelectOngoing = true;

    let pad = document.getElementById('controlP')
    const links = document.querySelectorAll('.ni')
    const Hlinks = document.querySelectorAll('.NOni')
    let selector = document.getElementById('selector')
    let selectorPhone = document.getElementById('selector-phone')
    let selectionTable = document.getElementById('selection-table')

    if (selectionTable.classList.contains('vanished')) {
        setTimeout(function () {
            selectionTable.classList.remove('vanished');
        }, 100)
        setTimeout(function () {
            selectionTable.classList.remove('invisible');
        }, 130)
    } else {
        selectionTable.classList.add('vanished')
        selectionTable.classList.add('invisible')
    }

    /*
    if (selectionTable.classList.contains('vanished')) {
        setTimeout(function () {
            selectionTable.classList.remove('invisible');
        }, 1000)
    } else {
        selectionTable.classList.add('invisible')
    }*/

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



    let animationTracker = [];

    // Handle links
    links.forEach(function(element) {
        animationTracker.push(new Promise(resolve => {
            if (element.classList.contains('ni')) {
                element.classList.remove('ni');
                element.offsetHeight; // FORCE reflow (this is the key)
                element.classList.add('NOni');
            }
            setTimeout(() => {
                element.classList.add('vanished');
                resolve();
            }, 100);
        }));
    });

    // Handle Hlinks
    Hlinks.forEach(function(element) {
        animationTracker.push(new Promise(resolve => {
            if (element.classList.contains('vanished')) {
                element.classList.remove('vanished');
            }
            setTimeout(() => {
                if (element.classList.contains('NOni')) {
                    element.classList.remove('NOni');
                    element.offsetHeight; // same reason
                    element.classList.add('ni');
                }
                resolve();
            }, 100);
        }));
    });

    // When all animations are done
    Promise.allSettled(animationTracker).then(function() {
        chapterSelectOngoing = false;
    }).catch(function (error) {
        // If any animation fails:
        console.error("Animation error occurred:", error);
        chapterSelectOngoing = false;  // Still make sure to unlock
        throw error;                   // Re-throw to maintain error propagation
    });
}


let buttons = document.getElementsByClassName('wordtog');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {

    var box = this.parentElement;
    var definitions = box.getElementsByClassName('definition');

    if (definitions.length === 0) return;

    var isHidden = definitions[0].classList.contains('hidden');

    for (var j = 0; j < definitions.length; j++) {
      if (isHidden) {
        definitions[j].classList.remove('hidden');
      } else {
        definitions[j].classList.add('hidden');
      }
    }

    this.textContent = isHidden ? 'Hide definition' : 'Enlighten';
  };
}


//The whole fucking words issue
document.addEventListener('DOMContentLoaded', function() {
    loadGlossary();
  });
  
  function loadGlossary() {
    fetch('words.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var container = document.getElementById('glossary-container');
        container.innerHTML = '';
        
        data.forEach(function(item) {
          if (!item.definitions) { console.log('BROKEN ENTRY:', item); return; }
  
          var wordBox = document.createElement('div');
          wordBox.classList.add('wordbox');
          if (item.category) {
          wordBox.classList.add(item.category);
  }
          wordBox.id = item.word;
          
          var title = document.createElement('p');
          var bold = document.createElement('b');
          bold.textContent = item.word;
          title.appendChild(bold);
          wordBox.appendChild(title);
          
          item.definitions.forEach(function(def) {
              var defPara = document.createElement('p');
              defPara.classList.add('hidden', 'definition');
              if (def.type === 'example') {
                defPara.innerHTML = '<i>' + def.text + '</i>';
              } else {
                defPara.innerHTML = def.text;
              }
              wordBox.appendChild(defPara);
            });
          
          var button = document.createElement('button');
          button.classList.add('wordtog');
          button.textContent = 'Reveal';
          wordBox.appendChild(button);
          
          container.appendChild(wordBox);
        });
        
        initializeRevealButtons();
        initializeSearch();
        handleUrlHash();
      })
      .catch(function(error) {
        console.error('Error loading glossary:', error);
      });
  }
  
  function initializeRevealButtons() {
    var container = document.getElementById('glossary-container');
    container.addEventListener('click', function(event) {
      if (event.target.classList.contains('wordtog')) {
        var box = event.target.closest('.wordbox');
        var definitions = box.querySelectorAll('.definition');
        var isHidden = definitions[0] && definitions[0].classList.contains('hidden');
        
        definitions.forEach(function(def) {
          def.classList.toggle('hidden');
        });
        event.target.textContent = isHidden ? 'Hide' : 'Reveal';
      }
    });
  }
  
  function initializeSearch() {
    var searchInput = document.getElementById('searchbar');
    var wordBoxes = document.querySelectorAll('.wordbox');
  
    searchInput.addEventListener('input', function() {
      var query = searchInput.value.trim().toLowerCase();
  
      wordBoxes.forEach(function(box) {
        var bold = box.querySelector('b');
        var word = bold ? bold.textContent.trim().toLowerCase() : '';
  
        if (query === '' || word.includes(query)) {
          box.style.display = '';
        } else {
          box.style.display = 'none';
        }
      });
    });
  }
  
  function handleUrlHash() {
    if (location.hash) {
      var targetId = location.hash.substring(1);
      var box = document.getElementById(targetId);
  
      if (!box) return;
  
      box.classList.add('redbord');
  
      var definitions = box.getElementsByClassName('definition');
      var button = box.getElementsByClassName('wordtog')[0];
  
      for (var i = 0; i < definitions.length; i++) {
        definitions[i].classList.remove('hidden');
      }
  
      if (button) {
        button.textContent = 'Hide';
      }
    }
  }
  


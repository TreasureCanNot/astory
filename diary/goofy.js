// The text that will be "typed" out, letter by letter
const text = "I've got so much math to do";

// This variable will keep track of which character is currently being added
let index = 0;

// Select the <p> element where the text will appear
const textElement = document.getElementById("text");

// Select the button element that will trigger the typing effect
const button = document.getElementById("startButton");

// Function to type out the text, letter by letter
function typeText() {
    // If we haven't finished typing all the characters...
    if (index < text.length) {
        // Append the next character to the <p> element's text content
        textElement.textContent += text[index];
        //same as saying textElement.textContent = textElement.textContent + text[index]
        // Move to the next character
        index++;

        // Call this function again after a short delay (100ms)
        setTimeout(typeText, 350);
    }
}

// Adding an event listener to the button
button.addEventListener("click", () => {
    // Clear any existing text from the <p> element before starting the typing effect
    textElement.textContent = '';

    // Reset the index to 0 (start typing from the beginning)
    index = 0;

    // Start the typewriter effect
    typeText();
});



function changethatShit(){
    var test = document.getElementById('texst');

    test.textContent = "logging expert";

    console.log(test);
    
    test.textContent = "good boy";

    console.log(test);
}


let chapterSelectOngoing = false;
function chapterSelect() {
    if (chapterSelectOngoing == true) { return; }
    //stop it you bitch
    chapterSelectOngoing = true; //it's true, so nothing can run until it ain't true

    let pad = document.getElementById('controlP')
    const links = document.querySelectorAll('.ni')
    const Hlinks = document.querySelectorAll('.NOni')
    let selector = document.getElementById('selector')

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

    let tracker = [];

    links.forEach(element => {
        let condition = new Promise(function (done) {
            if (element.classList.contains('ni')) {
                element.classList.remove('ni');
                element.classList.add('NOni'); // This happens immediately
            }
            setTimeout(function () { done(); }, 1000);
        }).then(function () {
            element.classList.add('vanished');
        });
        tracker.push(condition)
    });

    Hlinks.forEach(function (element) {
        let condition = new Promise(function (done) {
            new Promise(function (vanishFirst) {
                if (element.classList.contains('vanished')) {
                    element.classList.remove('vanished');
                }
                vanishFirst()
            }).then(function () {
                setTimeout(function () {
                    if (element.classList.contains('NOni')) {
                        element.classList.remove('NOni');
                        element.classList.add('ni');
                    }
                    // Now i'm sure that the elements will vanish before their class is ni
                }, 1000);
            })
            done();
        });
        tracker.push(condition)
    });

    Promise.all(tracker).then(function () {
        chapterSelectOngoing = false;
    });
}



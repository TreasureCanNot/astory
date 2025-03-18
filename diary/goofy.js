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

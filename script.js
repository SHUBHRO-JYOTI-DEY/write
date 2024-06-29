var timeLimit = 18; // Set your time limit (in minutes)
var timeElapsed = 0;
var timer;
var isPaused = true;

function startTimer() {
    if (isPaused) {
        isPaused = false;
        timer = setInterval(function() {
            if (!isPaused) {
                timeElapsed++;
                if (timeElapsed >= timeLimit * 60) {
                    alert('Time is up!');
                    document.getElementById('textArea').disabled = true;
                    clearInterval(timer);
                }
                
                var minutes = Math.floor((timeLimit * 60 - timeElapsed) / 60);
                var seconds = (timeLimit * 60 - timeElapsed) % 60;
                
                document.getElementById('time').innerText = pad(minutes) + ':' + pad(seconds);
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timer);
}

function pad(val) {
    var valString = val + "";
    return valString.length < 2 ? "0" + valString : valString;
}

function updateWordCount() {
    var text = document.getElementById('textArea').value;
    var words = text.trim().split(/\s+/).filter(function(word) {
        // count only if the word is alphanumeric
        return /^[a-z0-9]+$/i.test(word);
    }).length;
    document.getElementById('words').innerText = words;
}

var lastCharTime;

// Handle keydown events for the textarea
document.getElementById('textArea').addEventListener('keydown', function(e) {
    // Get the current caret position
    var caretPos = e.target.selectionStart;

    // If the key pressed was space or enter
    if (e.key === ' ' || e.key === 'Enter') {
        // Check if the previous character was also space or enter
        if (caretPos > 0 && (e.target.value[caretPos - 1] === ' ' || e.target.value[caretPos - 1] === '\n')) {
            // If it's been less than 0.5 seconds, move the cursor to the end
            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
            // Cancel the keypress
            e.preventDefault();
        }
    }

    // If Enter is pressed, check the time since the last non-space character
    if (e.key === 'Enter') {
        var currentTime = new Date();
        if (!lastCharTime || currentTime - lastCharTime > 2000) {  // 2000 milliseconds = 2 seconds
            // If it's been more than 2 seconds, cancel the keypress
            e.preventDefault();
        }
    }
    // For any non-space, non-newline character, update the last character time
    else if (e.key !== ' ' && e.key !== 'Enter') {
        lastCharTime = new Date();
    }
});

// Call the function when the textarea's value changes
document.getElementById('textArea').oninput = updateWordCount;

document.getElementById('startButton').addEventListener('click', startTimer);
document.getElementById('pauseButton').addEventListener('click', pauseTimer);

document.getElementById('saveButton').addEventListener('click', async function() {
    var textToSave = document.getElementById('textArea').value;

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'myFile.txt',
            types: [{
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                },
            }],
        });

        const writableStream = await handle.createWritable();
        await writableStream.write(textToSave);
        await writableStream.close();
        alert('File saved successfully.');
    } catch (error) {
        console.error('Save file error:', error);
    }
});
// This script handles user interaction in the popup window of the Chrome extension.

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const askButton = document.getElementById('submit');
    const questionInput = document.getElementById('question');
    const answerDiv = document.getElementById('result');

    // Attach a click event listener to the "Ask" button
    askButton.addEventListener('click', async function () {
        // Get the user's question from the input field
        console.log("click")
        const userQuestion = questionInput.value;

        if (userQuestion) {
            try {
                const queryOptions = { active: true, currentWindow: true };
                const [tab] = await chrome.tabs.query(queryOptions);
                console.log(tab)
                // const tab = await getCurrentTab();
                const url = tab.url;
                // Send a message to the background script to perform question-answering
                console.log("idhr")
                const response = await chrome.runtime.sendMessage({ action: 'performQuestionAnswering', question: userQuestion, URL:url });
                console.log("response")
                console.log(response.answer)
                // Display the answer and confidence score in the answerDiv
                answerDiv.innerHTML = `Answer: ${response.answer}<br>Confidence: ${(response.score * 100).toFixed(2)} %`;
            } catch (error) {
                console.error('Error:', error);
                answerDiv.textContent = 'An error occurred. Please try again.';
            }
        } else {
            answerDiv.textContent = 'Please enter a question.';
        }
    });
});

//What is capital of France?
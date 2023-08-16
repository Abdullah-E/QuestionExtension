// This script handles user interaction in the popup window of the Chrome extension.

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const askButton = document.getElementById('askButton');
    const questionInput = document.getElementById('questionInput');
    const answerDiv = document.getElementById('answer');

    // Attach a click event listener to the "Ask" button
    askButton.addEventListener('click', async function () {
        // Get the user's question from the input field
        const userQuestion = questionInput.value;

        if (userQuestion) {
            try {
                const tab = await getCurrentTab();
                const url = tab.url;
                // Send a message to the background script to perform question-answering
                const response = await chrome.runtime.sendMessage({ action: 'performQuestionAnswering', question: userQuestion, URL:url });

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

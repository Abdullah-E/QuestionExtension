// This script handles user interaction in the popup window of the Chrome extension.
// import { HfInference } from '@huggingface/inference';
// Wait for the DOM to be fully loaded

import fetch from 'node-fetch';
import {load} from 'cheerio';
import { HfInference } from '@huggingface/inference';
document.addEventListener("DOMContentLoaded", function () {
  // Get references to DOM elements
  const askButton = document.getElementById("submit");
  const questionInput = document.getElementById("question");
  const answerDiv = document.getElementById("result");
  const TIMEOUT_DELAY = 10000;
  
  // Attach a click event listener to the "Ask" button
  
  askButton.addEventListener("click", async function () {
    // Get the user's question from the input field
    console.log("click");
    const userQuestion = questionInput.value;
    answerDiv.innerHTML = `Please wait while answer is loading...`;
    if (userQuestion) {
      try {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        console.log(tab);
        // const tab = await getCurrentTab();
        const url = tab.url;
        // Send a message to the background script to perform question-answering
        console.log("idhr");

        const res = await getAnswer(url, userQuestion)
        
        console.log("after await", res);

        // console.log("escaped:", res)
        // Display the answer and confidence score in the answerDiv
        answerDiv.innerHTML = `Answer: ${res.answer}<br>Confidence: ${(
          res.score * 100
        ).toFixed(2)} %`;
      } catch (error) {
        console.error("Error:", error);
        answerDiv.textContent = "An error occurred. Please try again.";
      }
    } else {
      answerDiv.textContent = "Please enter a question.";
    }
  });

});




async function fetchAndConcatenateText(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      const htmlContent = await response.text();
  
      // Load the HTML content using cheerio
      const $ = load(htmlContent);
  
      // Extract text from <p> and <h> tags
      const paragraphs = $('p, h1, h2, h3, h4, h5, h6');
      let concatenatedText = '';
  
      paragraphs.each((index, paragraph) => {
        concatenatedText += $(paragraph).text() + ' ';
      });
  
      return concatenatedText.trim();
    } catch (error) {
      console.error('Error fetching and concatenating webpage text:', error);
      return null;
    }
}

async function getAnswer(url, question){
  const api_key = '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';
  const ai_model = 'deepset/tinyroberta-squad2';
    try {
        // Fetch and concatenate text from the current tab's webpage (Implement fetchAndConcatenateText function)
        const tab_context = await fetchAndConcatenateText(url);
  
        // Initialize the Hugging Face Inference client
        const inference = new HfInference(api_key);
  
        // Perform question-answering using the specified model and context
        const response = await inference.questionAnswering({
          model: ai_model,
          inputs: {
            question: question,
            context: tab_context,
          },
        });
  
        // Send the answer and confidence score back to the popup script
        return({
          answer: response.answer,
          score: response.score,
        });
      } catch (error) {
        console.error('Error performing question-answering:', error);
        
      }
    }


//What is capital of France?

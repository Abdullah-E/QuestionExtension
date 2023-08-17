// This script runs in the background of the Chrome extension and handles question-answering.

import fetch from 'node-fetch';
import {load} from 'cheerio';
import { HfInference } from '@huggingface/inference';

// Define your Hugging Face API key and model name
const api_key = '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';
const ai_model = 'deepset/tinyroberta-squad2';

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
// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  
  if (request.action === 'performQuestionAnswering') {
    try {
      // Fetch and concatenate text from the current tab's webpage (Implement fetchAndConcatenateText function)
      const tab_context = await fetchAndConcatenateText(request.URL);

      // Get the user's question from the request
      const question = request.question;
      console.log("got the question: ", question)
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
      console.log(response.answer)
      // Send the answer and confidence score back to the popup script
      // return ({
      //   answer: response.answer,
      //   score: response.score,
      // })
      sendResponse({
        answer: response.answer,
        score: response.score,
      });
      
    } catch (error) {
      console.error('Error performing question-answering:', error);
      sendResponse({ error: 'An error occurred while performing question-answering' });
    }
  }
});

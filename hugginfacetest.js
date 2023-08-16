import fetch from 'node-fetch';
import {load} from 'cheerio';
import { HfInference } from '@huggingface/inference';

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

const api_key = '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'
const inference = new HfInference(api_key)

const ai_model = 'deepset/tinyroberta-squad2'

const tab_url = 'https://en.wikipedia.org/wiki/France'
const tab_context = await fetchAndConcatenateText(tab_url)
const question = 'What is the capital of france?'


const response = await inference.questionAnswering({
  model: ai_model,
  inputs: {
    question: question,
    context: tab_context
  }
})

console.log("Question: ", question)
console.log("Answer: ", response.answer)
console.log("Confidence: ", (response.score*100).toFixed(2), '%')
import axios from 'axios'
import {HfInference} from '@huggingface/inference'

const api_key = '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'

const API_URL = 'https://api-inference.huggingface.co/models/gpt2';

const inference = new HfInference(api_key)

await hf.documentQuestionAnswering({
  model: 'impira/layoutlm-document-qa',
  inputs: {
    question: 'Invoice number?',
    image: await (await fetch('https://huggingface.co/spaces/impira/docquery/resolve/2359223c1837a7587402bda0f2643382a6eefeab/invoice.png')).blob(),
  }
})

async function askQuestion(question) {
  const response = await axios.post(API_URL, {
    inputs: question,
    parameters: {
      max_new_tokens: 100,
      temperature: 0.7,
      num_return_sequences: 1,
    },
  }, {
    headers: {
      'Authorization': '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',
      'Content-Type': 'application/json',
    },
  });

  return response.data[0].generated_text;
}

const question = "What is the capital of France?";
askQuestion(question).then((answer) => {
  console.log(answer);
});

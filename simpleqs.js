import {HfInference} from '@huggingface/inference'
const api_key = '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'


const inference = new HfInference(api_key)

const response = await inference.questionAnswering({
    model: 'deepset/tinyroberta-squad2',
    inputs: {
        question: 'What is my occupation?',
        context: 'hello my name is abdullah. i am 21 years old. i live in pakistan. i am a software developer'
    }
})

console.log(response)
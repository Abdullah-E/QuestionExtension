import { Tokenizer } from '@huggingface/tokenizers'
import { QuestionAnsweringPipeline } from '@huggingface/models'

async function main() {
  // Load the tokenizer and question answering pipeline
  const tokenizer = await Tokenizer.fromPretrained('bert-large-uncased-whole-word-masking-finetuned-squad');
  const pipeline = new QuestionAnsweringPipeline({ model: 'bert-large-uncased-whole-word-masking-finetuned-squad', tokenizer });

  // Set your input data
  const question = 'What is the capital of France?';
  const url = 'https://en.wikipedia.org/wiki/France'; // URL of the Wikipedia page for France

  // Fetch and preprocess the content from the URL (you'll need to use a suitable library)
  const pageContent = await fetchAndPreprocessContent(url);

  // Combine the question and content
  const context = `${question} ${pageContent}`;

  // Perform question answering
  const answer = await pipeline(context, question);

  console.log('Answer:', answer);
}

async function fetchAndPreprocessContent(url) {
  try {
    // Fetch the HTML content from the URL
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Use Cheerio to parse the HTML content
    const $ = cheerio.load(htmlContent);

    // Extract and preprocess the text from all <p> tags
    const paragraphs = $('p').map((_, element) => $(element).text()).get();

    // Join the paragraphs and return as a single string
    const preprocessedContent = paragraphs.join(' ');

    return preprocessedContent;
  } catch (error) {
    console.error('Error fetching or processing content:', error);
    throw error;
  }
}

main().catch(error => console.error(error));

const apiKey = '2ef7de111f168feadcfb3ff2ae06445abf6a075a29df7d3c799c0300';
const urlToAnalyze = 'https://en.wikipedia.org/wiki/France';
const textToAanlyze = 'What is the capital of france?'
const apiUrl = 'http://api.textrazor.com/';

// Fetch the content from the URL
fetch(urlToAnalyze)
  .then(response => response.text())
  .then(content => {
    const truncatedContent = content.slice(0, 2000);
    // Prepare the API request data
    const requestData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `extractors=entities&text=${encodeURIComponent(textToAanlyze)}&apiKey=${apiKey}`,
    };

    // Send the content to the TextRazor API for analysis
    return fetch(apiUrl, requestData);
  })
  .then(response => response.json())
  .then(data => {
    // Process the data returned by the API
    console.log("TextRazor Response: ", data)
    if (data.response && data.response.entities) {
      const entities = data.response.entities;

      // Process and use the entities as needed
      console.log('Entities:', entities);
    } else {
      console.log('No entities found in the API response.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

async function fetchWebpageContent(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      const htmlContent = await response.text();
      return htmlContent;
    } catch (error) {
      console.error('Error fetching webpage:', error);
      return null;
    }
  }
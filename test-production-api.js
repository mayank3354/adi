const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testProductionAPI() {
  const url = 'https://adi-black.vercel.app/api/ask';
  
  try {
    console.log('Testing production API...');
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a simple bar chart showing sales data for 3 products'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.get('content-type'));

    if (response.ok) {
      // For node-fetch, we need to use response.body as a readable stream
      const text = await response.text();
      console.log('\n✅ API is working!');
      console.log('Response length:', text.length);
      console.log('First 500 characters:', text.substring(0, 500));
      
      // Parse the streaming response
      const lines = text.split('\n');
      let result = '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'text-delta' && parsed.delta) {
              result += parsed.delta;
            }
          } catch {
            result += data;
          }
        }
      }
      
      console.log('\n📊 Parsed Response:');
      console.log('Length:', result.length);
      console.log('First 300 characters:', result.substring(0, 300));
    } else {
      console.error('❌ API request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testProductionAPI();

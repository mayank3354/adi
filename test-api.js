// Simple test script to verify API endpoints
// Run with: node test-api.js

const testVisualizationAPI = async () => {
  console.log('Testing Visualization API...');
  
  const testData = {
    chartType: "lineChart",
    data: {
      title: "Test Sales Data",
      data: [
        { month: "Jan", sales: 1000 },
        { month: "Feb", sales: 1500 },
        { month: "Mar", sales: 1200 }
      ]
    },
    prompt: "Create a simple line chart for test data"
  };

  try {
    const response = await fetch('http://localhost:3000/api/visualize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      console.log('✅ Visualization API is working');
      const reader = response.body.getReader();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }
      
      console.log('Response length:', result.length);
      console.log('Response preview:', result.substring(0, 200) + '...');
    } else {
      console.log('❌ Visualization API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Visualization API error:', error.message);
  }
};

const testChatAPI = async () => {
  console.log('\nTesting Chat API...');
  
  const testData = {
    prompt: "Hello, can you create a simple bar chart?",
    previousC1Response: ""
  };

  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      console.log('✅ Chat API is working');
      const reader = response.body.getReader();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }
      
      console.log('Response length:', result.length);
      console.log('Response preview:', result.substring(0, 200) + '...');
    } else {
      console.log('❌ Chat API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Chat API error:', error.message);
  }
};

const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  await testVisualizationAPI();
  await testChatAPI();
  
  console.log('\n✨ Tests completed!');
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

// Comprehensive test script for visualization API endpoints
// Run with: node test-visualization.js

const testData = {
  // Sample CSV data from the user's example
  csvData: {
    chartType: "barChart",
    data: {
      title: "Product Performance Analysis",
      description: "Comparing sales and profit across products",
      data: [
        { Category: "Product A", Sales: 120, Profit: 30, "Customer Satisfaction": 80, "Market Share": 25 },
        { Category: "Product B", Sales: 90, Profit: 20, "Customer Satisfaction": 70, "Market Share": 20 },
        { Category: "Product C", Sales: 150, Profit: 50, "Customer Satisfaction": 90, "Market Share": 35 },
        { Category: "Product D", Sales: 60, Profit: 10, "Customer Satisfaction": 60, "Market Share": 10 },
        { Category: "Product E", Sales: 110, Profit: 25, "Customer Satisfaction": 75, "Market Share": 10 }
      ]
    },
    prompt: "Compare sales and profit across products based on this data. Create a comprehensive visualization that highlights key insights and trends."
  },
  
  // Line chart data
  lineChartData: {
    chartType: "lineChart",
    data: {
      title: "Monthly Sales Trend",
      description: "Shows trends over time with correlations and fluctuations",
      data: [
        { month: "Jan", sales: 1200, profit: 300, customers: 150 },
        { month: "Feb", sales: 1900, profit: 450, customers: 180 },
        { month: "Mar", sales: 1500, profit: 375, customers: 165 },
        { month: "Apr", sales: 2100, profit: 525, customers: 200 },
        { month: "May", sales: 1800, profit: 450, customers: 175 },
        { month: "Jun", sales: 2400, profit: 600, customers: 220 }
      ]
    },
    prompt: "Create a line chart showing monthly sales trends with interactive tooltips and analysis of key patterns."
  },
  
  // Pie chart data
  pieChartData: {
    chartType: "pieChart",
    data: {
      title: "Market Share Distribution",
      description: "Shows composition of a whole with percentage breakdown",
      data: [
        { company: "Company A", share: 35, revenue: 1200000 },
        { company: "Company B", share: 25, revenue: 850000 },
        { company: "Company C", share: 20, revenue: 680000 },
        { company: "Company D", share: 15, revenue: 510000 },
        { company: "Others", share: 5, revenue: 170000 }
      ]
    },
    prompt: "Create a pie chart showing market share distribution with percentage labels and analysis of market positioning."
  }
};

const testVisualizationAPI = async (testName, testData) => {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log('='.repeat(50));
  
  try {
    const response = await fetch('http://localhost:3000/api/visualize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      console.log('✅ API Response Status:', response.status);
      console.log('✅ Content-Type:', response.headers.get('content-type'));
      
      const reader = response.body.getReader();
      let result = '';
      let chunkCount = 0;
      
      console.log('📡 Reading streaming response...');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunkCount++;
        const chunk = new TextDecoder().decode(value);
        result += chunk;
        
        if (chunkCount % 10 === 0) {
          console.log(`📦 Received chunk ${chunkCount}, total length: ${result.length} characters`);
        }
      }
      
      console.log(`\n📊 Final Results:`);
      console.log(`- Total chunks received: ${chunkCount}`);
      console.log(`- Total response length: ${result.length} characters`);
      console.log(`- Response preview: ${result.substring(0, 200)}...`);
      
      // Check if response contains expected content
      const hasChartContent = result.includes('chart') || result.includes('Chart') || result.includes('visualization');
      const hasAnalysisContent = result.includes('analysis') || result.includes('trend') || result.includes('insight');
      
      console.log(`- Contains chart content: ${hasChartContent ? '✅' : '❌'}`);
      console.log(`- Contains analysis content: ${hasAnalysisContent ? '✅' : '❌'}`);
      
      return { success: true, length: result.length, chunks: chunkCount };
    } else {
      console.log('❌ API failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('❌ Error details:', errorText);
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log('❌ API error:', error.message);
    return { success: false, error: error.message };
  }
};

const testChatAPI = async () => {
  console.log('\n🧪 Testing: Chat API');
  console.log('='.repeat(50));
  
  const testData = {
    prompt: "Create a bar chart comparing sales performance across different products",
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
      console.log('✅ Chat API Response Status:', response.status);
      
      const reader = response.body.getReader();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }
      
      console.log(`- Response length: ${result.length} characters`);
      console.log(`- Response preview: ${result.substring(0, 200)}...`);
      
      return { success: true, length: result.length };
    } else {
      console.log('❌ Chat API failed:', response.status, response.statusText);
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log('❌ Chat API error:', error.message);
    return { success: false, error: error.message };
  }
};

const runComprehensiveTests = async () => {
  console.log('🚀 Starting Comprehensive API Tests...\n');
  
  const results = {
    visualization: {},
    chat: null
  };
  
  // Test different visualization scenarios
  for (const [testName, testDataItem] of Object.entries(testData)) {
    results.visualization[testName] = await testVisualizationAPI(testName, testDataItem);
  }
  
  // Test chat API
  results.chat = await testChatAPI();
  
  // Summary
  console.log('\n📋 Test Summary');
  console.log('='.repeat(50));
  
  let visualizationSuccess = 0;
  let visualizationTotal = 0;
  
  for (const [testName, result] of Object.entries(results.visualization)) {
    visualizationTotal++;
    if (result.success) {
      visualizationSuccess++;
      console.log(`✅ ${testName}: PASSED (${result.length} chars, ${result.chunks} chunks)`);
    } else {
      console.log(`❌ ${testName}: FAILED - ${result.error}`);
    }
  }
  
  console.log(`\n📊 Visualization API: ${visualizationSuccess}/${visualizationTotal} tests passed`);
  
  if (results.chat.success) {
    console.log(`✅ Chat API: PASSED (${results.chat.length} chars)`);
  } else {
    console.log(`❌ Chat API: FAILED - ${results.chat.error}`);
  }
  
  const overallSuccess = visualizationSuccess === visualizationTotal && results.chat.success;
  console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return overallSuccess;
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runComprehensiveTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

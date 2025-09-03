const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVisualizationPage() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing Visualization Page Access...\n');

  // Test 1: Check if visualization page is accessible
  console.log('1️⃣ Testing basic visualization page access...');
  try {
    const response = await fetch(`${baseUrl}/visualization`);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Visualization page is accessible');
      const text = await response.text();
      console.log('Page content length:', text.length);
      console.log('Page contains "Data Visualization":', text.includes('Data Visualization'));
    } else {
      console.log('❌ Visualization page returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Error accessing visualization page:', error.message);
  }

  // Test 2: Test with a simple data parameter
  console.log('\n2️⃣ Testing visualization page with simple data...');
  try {
    const simpleData = encodeURIComponent('{"test": "data"}');
    const testUrl = `${baseUrl}/visualization?data=${simpleData}`;
    console.log('Testing URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Visualization page with data parameter is accessible');
      const text = await response.text();
      console.log('Page content length:', text.length);
      console.log('Page contains "Data Visualization":', text.includes('Data Visualization'));
    } else {
      console.log('❌ Visualization page with data parameter returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Error accessing visualization page with data:', error.message);
  }

  // Test 3: Test the actual API response URL
  console.log('\n3️⃣ Testing actual API response URL...');
  try {
    const apiResponse = await fetch(`${baseUrl}/api/adi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a simple bar chart showing sales: Q1 45K, Q2 52K'
      })
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log('✅ API response received');
      console.log('Visualization URL:', data.visualization_url);
      
      // Test the actual URL from API
      const vizResponse = await fetch(data.visualization_url);
      console.log('Visualization page status:', vizResponse.status);
      console.log('Visualization page status text:', vizResponse.statusText);
      
      if (vizResponse.ok) {
        console.log('✅ Visualization page from API URL is accessible');
        const text = await vizResponse.text();
        console.log('Page content length:', text.length);
        console.log('Page contains "Data Visualization":', text.includes('Data Visualization'));
      } else {
        console.log('❌ Visualization page from API URL returned error:', vizResponse.status);
      }
    } else {
      console.log('❌ API request failed:', apiResponse.status);
    }
  } catch (error) {
    console.log('❌ Error testing API response URL:', error.message);
  }

  console.log('\n🎉 Visualization Page Test Complete!');
}

testVisualizationPage();

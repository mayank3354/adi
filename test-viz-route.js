const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVizRoute() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing New /viz Route...\n');

  // Test 1: Check if viz page is accessible
  console.log('1️⃣ Testing basic viz page access...');
  try {
    const response = await fetch(`${baseUrl}/viz`);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Viz page is accessible');
      const text = await response.text();
      console.log('Page content length:', text.length);
      console.log('Page contains "Data Visualization":', text.includes('Data Visualization'));
      console.log('Page contains "Loading visualization":', text.includes('Loading visualization'));
    } else {
      console.log('❌ Viz page returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Error accessing viz page:', error.message);
  }

  // Test 2: Test with data parameter
  console.log('\n2️⃣ Testing viz page with data parameter...');
  try {
    const simpleData = encodeURIComponent('{"test": "data"}');
    const testUrl = `${baseUrl}/viz?data=${simpleData}`;
    console.log('Testing URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Viz page with data parameter is accessible');
      const text = await response.text();
      console.log('Page content length:', text.length);
      console.log('Page contains "Data Visualization":', text.includes('Data Visualization'));
    } else {
      console.log('❌ Viz page with data parameter returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Error accessing viz page with data:', error.message);
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
      console.log('Viz page status:', vizResponse.status);
      console.log('Viz page status text:', vizResponse.statusText);
      
      if (vizResponse.ok) {
        console.log('✅ Viz page from API URL is accessible');
        const text = await vizResponse.text();
        console.log('Page content length:', text.length);
        console.log('Page contains "Data Visualization":', text.includes('Data Visualization'));
      } else {
        console.log('❌ Viz page from API URL returned error:', vizResponse.status);
      }
    } else {
      console.log('❌ API request failed:', apiResponse.status);
    }
  } catch (error) {
    console.log('❌ Error testing API response URL:', error.message);
  }

  console.log('\n🎉 Viz Route Test Complete!');
}

testVizRoute();

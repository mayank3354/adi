const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testADIIntegration() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing ADI Integration API...\n');

  // Test 1: Create a visualization
  console.log('1️⃣ Creating visualization...');
  try {
    const response = await fetch(`${baseUrl}/api/adi-visualize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a bar chart showing quarterly sales data: Q1 $45K, Q2 $52K, Q3 $48K, Q4 $61K'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Visualization created successfully!');
      console.log('Response keys:', Object.keys(data));
      console.log('Success:', data.success);
      console.log('Visualization ID:', data.visualization_id);
      console.log('Visualization URL:', data.visualization_url);
      console.log('Message:', data.message);

      // Test 2: Open the visualization URL
      console.log('\n2️⃣ Opening visualization URL...');
      console.log('🌐 Open this URL in your browser:');
      console.log(data.visualization_url);
      console.log('\n📋 For ADI integration, use this URL to display the visualization');

      return data.visualization_url;
    } else {
      console.log('❌ Failed to create visualization:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error creating visualization:', error.message);
  }

  console.log('\n🎉 ADI Integration Test Complete!');
  console.log('\n📋 Summary:');
  console.log('- Single API call creates visualization');
  console.log('- Returns direct URL to view visualization');
  console.log('- Perfect for ADI voice assistant integration');
  console.log('\n🔗 API Endpoint:');
  console.log('- POST https://adi-black.vercel.app/api/adi-visualize');
}

testADIIntegration();

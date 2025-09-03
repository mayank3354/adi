const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testADISimple() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing Simplified ADI API...\n');

  // Test the new simplified ADI API
  console.log('1️⃣ Creating visualization with simplified ADI API...');
  try {
    const response = await fetch(`${baseUrl}/api/adi`, {
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
      console.log('Visualization URL:', data.visualization_url);
      console.log('Message:', data.message);
      console.log('Timestamp:', data.timestamp);

      // Test 2: Verify the visualization URL
      console.log('\n2️⃣ Verification:');
      console.log('🌐 Visualization URL to open in ADI UI tool:');
      console.log(data.visualization_url);
      
      if (data.visualization_url && data.visualization_url.includes('visualization?data=')) {
        console.log('✅ URL format is correct for ADI UI tool');
        console.log('📋 ADI can now open this URL to display the visualization');
      } else {
        console.log('❌ URL format is incorrect');
      }

      return data.visualization_url;
    } else {
      console.log('❌ Failed to create visualization:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('Error details:', errorData);
    }
  } catch (error) {
    console.log('❌ Error creating visualization:', error.message);
  }

  console.log('\n🎉 ADI Simple API Test Complete!');
  console.log('\n📋 Summary:');
  console.log('- Single API call creates visualization');
  console.log('- Returns visualization_url for ADI UI tool');
  console.log('- Perfect for voice assistant integration');
  console.log('\n🔗 New API Endpoint:');
  console.log('- POST https://adi-black.vercel.app/api/adi');
}

testADISimple();

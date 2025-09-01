const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNewAPIs() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing New ADI Integration APIs...\n');

  // Test 1: Direct Visualization API
  console.log('1️⃣ Testing Direct Visualization API (/api/visualize)');
  try {
    const response = await fetch(`${baseUrl}/api/visualize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a simple bar chart showing sales data: Q1 45K, Q2 52K, Q3 48K, Q4 61K'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct API working!');
      console.log('Response keys:', Object.keys(data));
      console.log('Success:', data.success);
      console.log('Has visualization data:', !!data.visualization_data);
      console.log('Data length:', data.visualization_data?.length || 0);
    } else {
      console.log('❌ Direct API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Direct API error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Session-based API
  console.log('2️⃣ Testing Session-based API (/api/session)');
  try {
    const response = await fetch(`${baseUrl}/api/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a line chart showing monthly trends: Jan 100, Feb 120, Mar 110, Apr 130'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Session API working!');
      console.log('Response keys:', Object.keys(data));
      console.log('Success:', data.success);
      console.log('Session ID:', data.sessionId);
      console.log('Has visualization data:', !!data.visualization_data);
      console.log('URL:', data.url);

      // Test retrieving the session
      if (data.sessionId) {
        console.log('\n🔄 Testing session retrieval...');
        const getResponse = await fetch(`${baseUrl}/api/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: data.sessionId,
            action: 'get'
          })
        });

        if (getResponse.ok) {
          const getData = await getResponse.json();
          console.log('✅ Session retrieval working!');
          console.log('Retrieved session ID:', getData.sessionId);
          console.log('Has visualization data:', !!getData.visualization_data);
        } else {
          console.log('❌ Session retrieval failed:', getResponse.status);
        }
      }
    } else {
      console.log('❌ Session API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Session API error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Original Ask API (for comparison)
  console.log('3️⃣ Testing Original Ask API (/api/ask)');
  try {
    const response = await fetch(`${baseUrl}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a pie chart showing market share: Product A 35%, Product B 25%, Product C 20%, Product D 20%'
      })
    });

    if (response.ok) {
      console.log('✅ Original Ask API working!');
      console.log('Response status:', response.status);
      console.log('Content type:', response.headers.get('content-type'));
    } else {
      console.log('❌ Original Ask API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Original Ask API error:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
  console.log('\n📋 Summary:');
  console.log('- Direct API: For immediate visualization data');
  console.log('- Session API: For persistent visualizations with session management');
  console.log('- Original API: For streaming responses (existing functionality)');
  console.log('\n🔗 Integration URLs:');
  console.log('- Direct: https://adi-black.vercel.app/api/visualize');
  console.log('- Session: https://adi-black.vercel.app/api/session');
  console.log('- Visualization Page: https://adi-black.vercel.app/visualization?session={sessionId}');
}

testNewAPIs();

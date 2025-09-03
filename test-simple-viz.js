const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSimpleViz() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing Simple Visualization Page...\n');

  try {
    const response = await fetch(`${baseUrl}/visualization`);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const text = await response.text();
      console.log('Page content length:', text.length);
      
      // Check for key content
      console.log('\n🔍 Content Analysis:');
      console.log('Contains "Data Visualization":', text.includes('Data Visualization'));
      console.log('Contains "Loading visualization":', text.includes('Loading visualization'));
      console.log('Contains "Error":', text.includes('Error'));
      console.log('Contains "React":', text.includes('React'));
      console.log('Contains "script":', text.includes('script'));
      console.log('Contains "div":', text.includes('div'));
      
      // Show first 500 characters
      console.log('\n📄 First 500 characters:');
      console.log(text.substring(0, 500));
      
      // Show last 500 characters
      console.log('\n📄 Last 500 characters:');
      console.log(text.substring(text.length - 500));
      
    } else {
      console.log('❌ Page returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testSimpleViz();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVizContent() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing Viz Page Content...\n');

  try {
    const response = await fetch(`${baseUrl}/viz`);
    const text = await response.text();
    
    console.log('Page Status:', response.status);
    console.log('Content Length:', text.length);
    
    // Check for key content
    console.log('\n🔍 Content Analysis:');
    console.log('Contains "Data Visualization":', text.includes('Data Visualization'));
    console.log('Contains "Loading visualization":', text.includes('Loading visualization'));
    console.log('Contains "Error":', text.includes('Error'));
    console.log('Contains "React":', text.includes('React'));
    console.log('Contains "script":', text.includes('script'));
    console.log('Contains "div":', text.includes('div'));
    
    // Show first 1000 characters
    console.log('\n📄 First 1000 characters:');
    console.log(text.substring(0, 1000));
    
    // Show last 1000 characters
    console.log('\n📄 Last 1000 characters:');
    console.log(text.substring(text.length - 1000));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testVizContent();

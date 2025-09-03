const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPageContent() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing Page Content...\n');

  try {
    const response = await fetch(`${baseUrl}/visualization`);
    const text = await response.text();
    
    console.log('Page Status:', response.status);
    console.log('Content Length:', text.length);
    
    // Show the actual content
    console.log('\n📄 Full Page Content:');
    console.log(text);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testPageContent();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBrowserDebug() {
  const baseUrl = 'https://adi-black.vercel.app';
  
  console.log('🧪 Testing Browser Debug...\n');

  try {
    // Test the visualization page
    const response = await fetch(`${baseUrl}/visualization`);
    const text = await response.text();
    
    console.log('Page Status:', response.status);
    console.log('Content Length:', text.length);
    
    // Check for key elements
    console.log('\n🔍 Key Elements Check:');
    console.log('Contains <html>:', text.includes('<html'));
    console.log('Contains <body>:', text.includes('<body'));
    console.log('Contains <script>:', text.includes('<script'));
    console.log('Contains "Loading visualization":', text.includes('Loading visualization'));
    console.log('Contains "Data Visualization":', text.includes('Data Visualization'));
    console.log('Contains "Error":', text.includes('Error'));
    
    // Check for React hydration
    console.log('\n🔍 React Hydration Check:');
    console.log('Contains "__next":', text.includes('__next'));
    console.log('Contains "React":', text.includes('React'));
    console.log('Contains "useEffect":', text.includes('useEffect'));
    
    // Check for Thesys components
    console.log('\n🔍 Thesys Components Check:');
    console.log('Contains "C1Component":', text.includes('C1Component'));
    console.log('Contains "ThemeProvider":', text.includes('ThemeProvider'));
    
    // Show the structure
    console.log('\n📄 Page Structure Analysis:');
    const lines = text.split('\n');
    const scriptLines = lines.filter(line => line.includes('<script'));
    console.log('Number of script tags:', scriptLines.length);
    
    // Check if it's a proper Next.js page
    if (text.includes('__next') && text.includes('Loading visualization')) {
      console.log('\n✅ This appears to be a proper Next.js page with React hydration');
      console.log('The issue might be client-side JavaScript execution');
    } else {
      console.log('\n❌ This doesn\'t appear to be a proper Next.js React page');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBrowserDebug();

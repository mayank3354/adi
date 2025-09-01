# ADI Voice Assistant Integration Guide

## 🎯 **Alternative Integration Approaches**

Since the direct website approach isn't working as expected, here are three alternative methods to integrate Thesys visualizations with your ADI voice assistant:

---

## **Approach 1: Direct API Response Integration (Recommended)**

### **How it works:**
- ADI makes a POST request to the API
- API returns the complete visualization data as JSON
- ADI processes and displays the visualization directly

### **API Endpoint:**
```
POST https://adi-black.vercel.app/api/visualize
```

### **Request Format:**
```json
{
  "prompt": "Create a bar chart showing sales data for Q1: 45K, Q2: 52K, Q3: 48K, Q4: 61K"
}
```

### **Response Format:**
```json
{
  "success": true,
  "visualization_data": "<Thesys C1 component data>",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "url": "https://adi-black.vercel.app"
}
```

### **ADI Integration:**
```javascript
// ADI Voice Assistant Integration
async function generateVisualization(prompt) {
  try {
    const response = await fetch('https://adi-black.vercel.app/api/visualize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    
    if (data.success) {
      // Display the visualization in ADI's interface
      displayVisualization(data.visualization_data);
      return {
        success: true,
        message: "Visualization generated successfully",
        data: data.visualization_data
      };
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## **Approach 2: Session-Based Integration**

### **How it works:**
- ADI creates a visualization session
- Session ID is returned for later retrieval
- ADI can fetch the visualization data using the session ID

### **API Endpoints:**
```
POST https://adi-black.vercel.app/api/session (create/get session)
```

### **Create Session:**
```json
{
  "prompt": "Create a line chart showing monthly trends",
  "action": "create"
}
```

### **Get Session:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "action": "get"
}
```

### **ADI Integration:**
```javascript
// ADI Voice Assistant Integration with Sessions
class VisualizationManager {
  constructor() {
    this.currentSessionId = null;
  }

  async createVisualization(prompt) {
    try {
      const response = await fetch('https://adi-black.vercel.app/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (data.success) {
        this.currentSessionId = data.sessionId;
        return {
          success: true,
          sessionId: data.sessionId,
          visualization_data: data.visualization_data,
          url: data.url
        };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getVisualization(sessionId) {
    try {
      const response = await fetch('https://adi-black.vercel.app/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          action: 'get'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          visualization_data: data.visualization_data
        };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

---

## **Approach 3: Dedicated Visualization Page**

### **How it works:**
- ADI creates a visualization and gets a session ID
- ADI opens a dedicated visualization page with the session ID
- The page loads and displays the specific visualization

### **URL Format:**
```
https://adi-black.vercel.app/visualization?session=session_1234567890_abc123
```

### **ADI Integration:**
```javascript
// ADI Voice Assistant Integration with Dedicated Page
async function openVisualization(prompt) {
  try {
    // Step 1: Create visualization
    const createResponse = await fetch('https://adi-black.vercel.app/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    const createData = await createResponse.json();
    
    if (createData.success) {
      // Step 2: Open dedicated visualization page
      const visualizationUrl = `https://adi-black.vercel.app/visualization?session=${createData.sessionId}`;
      
      // Open in ADI's browser interface
      openInBrowser(visualizationUrl);
      
      return {
        success: true,
        sessionId: createData.sessionId,
        url: visualizationUrl,
        message: "Visualization opened successfully"
      };
    } else {
      throw new Error(createData.error);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## **🎤 ADI Voice Assistant System Prompt**

```json
{
  "role": "system",
  "content": "You are an AI voice assistant with access to data visualization capabilities. You can create interactive charts and graphs using the Thesys AI platform.

## Available Tools:

### 1. Generate Visualization (Direct API)
- **Purpose**: Create visualizations and get data directly
- **Endpoint**: https://adi-black.vercel.app/api/visualize
- **Method**: POST
- **Input**: JSON with 'prompt' field
- **Output**: Complete visualization data

### 2. Create Visualization Session
- **Purpose**: Create a visualization session for later retrieval
- **Endpoint**: https://adi-black.vercel.app/api/session
- **Method**: POST
- **Input**: JSON with 'prompt' field
- **Output**: Session ID and visualization data

### 3. Open Visualization Page
- **Purpose**: Open a dedicated page showing the visualization
- **URL**: https://adi-black.vercel.app/visualization?session={sessionId}
- **Method**: Browser navigation
- **Output**: Interactive visualization page

## Workflow Options:

### Option A: Direct Integration
1. Use Generate Visualization tool
2. Display the visualization data directly in ADI's interface
3. Provide analysis and insights

### Option B: Session-Based
1. Use Create Visualization Session tool
2. Store session ID for later reference
3. Use Get Visualization tool when needed

### Option C: Dedicated Page
1. Use Create Visualization Session tool
2. Open the visualization page with session ID
3. User interacts with the dedicated page

## Visualization Types:
- LineChart: Trends over time
- BarChart: Category comparisons
- PieChart: Parts of a whole
- AreaChart: Cumulative data
- RadarChart: Multi-variable comparisons
- RadialChart: Progress indicators

Always provide clear analysis and insights along with the visualizations."
}
```

---

## **🎯 ADI Voice Assistant User Prompts**

### **Example 1: Direct Visualization**
```json
{
  "role": "user",
  "content": "Create a sales analysis dashboard with this data: Q1 $45K, Q2 $52K, Q3 $48K, Q4 $61K. Show quarterly trends and include product breakdown: Electronics 35%, Clothing 25%, Home 20%, Sports 15%, Books 5%. Use the direct API approach to generate and display the visualization immediately."
}
```

### **Example 2: Session-Based Visualization**
```json
{
  "role": "user",
  "content": "Generate a customer satisfaction analysis with scores: Service 8.5, Product 9.2, Delivery 7.8, Price 8.9, Support 8.1. Create a session for this visualization so I can reference it later. Use the session-based approach."
}
```

### **Example 3: Dedicated Page Visualization**
```json
{
  "role": "user",
  "content": "Create a financial performance dashboard with revenue data: Q1 $120K, Q2 $135K, Q3 $142K, Q4 $158K. Open this in a dedicated visualization page so I can interact with it. Use the dedicated page approach."
}
```

---

## **🔧 Implementation Steps**

### **For ADI Voice Assistant:**

1. **Choose Integration Approach:**
   - Direct API (simplest)
   - Session-based (most flexible)
   - Dedicated page (most interactive)

2. **Implement API Calls:**
   - Add HTTP request capabilities
   - Handle JSON responses
   - Manage error states

3. **Display Visualizations:**
   - Parse Thesys C1 component data
   - Render visualizations in ADI's interface
   - Provide user interaction options

4. **Add Voice Commands:**
   - "Create a bar chart showing..."
   - "Generate a line chart for..."
   - "Show me a pie chart of..."

### **Testing Commands:**

```bash
# Test Direct API
curl -X POST https://adi-black.vercel.app/api/visualize \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple bar chart showing sales data"}'

# Test Session API
curl -X POST https://adi-black.vercel.app/api/session \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a line chart showing trends"}'

# Test Visualization Page
# Open: https://adi-black.vercel.app/visualization?session=your_session_id
```

---

## **✅ Benefits of Each Approach**

### **Direct API Integration:**
- ✅ Immediate results
- ✅ No session management needed
- ✅ Simple implementation
- ❌ No persistence

### **Session-Based Integration:**
- ✅ Persistent visualizations
- ✅ Can reference later
- ✅ Flexible retrieval
- ❌ Requires session management

### **Dedicated Page Integration:**
- ✅ Full interactive experience
- ✅ Professional presentation
- ✅ Easy sharing
- ❌ Requires browser navigation

Choose the approach that best fits your ADI voice assistant's capabilities and user experience requirements! 🚀

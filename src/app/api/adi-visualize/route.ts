import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// In-memory storage for visualizations (in production, use Redis or database)
interface VisualizationData {
  visualization_data: string;
  timestamp: string;
  prompt: string;
}
const visualizations = new Map<string, VisualizationData>();

// Enhanced system prompt for comprehensive data visualization
const enhancedSystemPrompt = `
You are an expert data visualization specialist with deep knowledge of data analysis and chart creation. Your task is to create beautiful, interactive visualizations that help users understand their data better.

## Available Visualization Components:
- **LineChart** - Use for trends over time, correlations, and fluctuations
- **AreaChart** - Use for volume/magnitude of change and cumulative values
- **BarChart** - Use for category comparisons, ranking, and value differences
- **PieChart** - Use for composition of whole and percentage breakdowns
- **RadarChart** - Use for multi-variable comparisons and performance evaluation
- **RadialChart** - Use for progress indicators and goal tracking

## Display Components:
- **TextContent** - For formatted text with markdown support
- **Callout** - For highlighting important information
- **Table** - For structured data display
- **ListBlock** - For interactive lists
- **Accordion** - For organized content sections
- **Steps** - For sequential processes
- **CodeBlock** - For code examples

## CRITICAL: When creating data visualizations:
1. ALWAYS use the appropriate chart component (LineChart, BarChart, PieChart, etc.)
2. Provide comprehensive data analysis and insights
3. Use TextContent for explanations and analysis
4. Use Callout for highlighting key insights
5. Use Table for data summaries when appropriate

## Chart Selection Guidelines:
- **LineChart**: Trends over time, correlations, fluctuations
- **AreaChart**: Volume/magnitude of change, cumulative values
- **BarChart**: Category comparisons, ranking, value differences
- **PieChart**: Composition of whole, percentage breakdowns
- **RadarChart**: Multi-variable comparisons, performance evaluation
- **RadialChart**: Progress indicators, goal tracking

## IMPORTANT: Always create actual visualizations, not just text descriptions. Use the chart components to display data visually.
`;

export async function POST(req: Request) {
  try {
    const { prompt, action, visualizationId } = await req.json();

    // Handle GET action for retrieving existing visualizations
    if (action === 'get' && visualizationId) {
      const visualizationData = visualizations.get(visualizationId);
      if (!visualizationData) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Visualization not found"
          }),
          { status: 404 }
        );
      }
      
      return new Response(JSON.stringify({
        success: true,
        visualization_data: visualizationData.visualization_data,
        timestamp: visualizationData.timestamp,
        prompt: visualizationData.prompt
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Handle CREATE action for new visualizations
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Prompt is required"
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    const model = createOpenAI({
      apiKey: process.env.THESYS_API_KEY,
      baseURL: "https://api.thesys.dev/v1/embed",
    }).chat("c1/anthropic/claude-sonnet-4/v-20250815");

    const result = streamText({
      model,
      messages: [
        {
          role: "system",
          content: enhancedSystemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Get the complete response
    const text = await result.text;
    
    // Generate unique visualization ID
    const visualizationId = `viz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store visualization data
    visualizations.set(visualizationId, {
      visualization_data: text,
      timestamp: new Date().toISOString(),
      prompt: prompt
    });
    
    // Create direct URL to view the visualization
    const visualizationUrl = `https://adi-black.vercel.app/visualization/${visualizationId}`;
    
    return new Response(JSON.stringify({
      success: true,
      visualization_id: visualizationId,
      visualization_url: visualizationUrl,
      timestamp: new Date().toISOString(),
      message: "Visualization created successfully. Use the visualization_url to view it."
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error("Error in ADI visualize API:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to create visualization",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Export the visualizations map for use in other routes
export { visualizations };

"use client";

import { useState } from "react";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Wrapper component to suppress the disableThemeProvider warning
const ThesysWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider mode="light">
        {children}
      </ThemeProvider>
    </div>
  );
};

const Page = () => {
  const [customData, setCustomData] = useState("");
  const [showDataInput, setShowDataInput] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    let enhancedPrompt = input;
    
    // If custom data is provided, enhance the prompt
    if (customData.trim()) {
      enhancedPrompt = `
${input}

Here's the data to analyze and visualize:

${customData}

Please create a comprehensive visualization with analysis of this data.
      `;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: ""
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        
        // Parse the streaming response format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'text-delta' && parsed.delta) {
                assistantMessage.content += parsed.delta;
              }
            } catch {
              // If it's not JSON, treat as raw text
              assistantMessage.content += data;
            }
          }
        }
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: assistantMessage.content }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCustomData(""); // Clear custom data after submission
    }
  };

  const sampleDataPrompts = [
    {
      title: "Sales Trend Analysis",
      prompt: "Create a line chart showing monthly sales trends with interactive tooltips and analysis of key patterns.",
      data: `Month,Sales,Profit,Customers
Jan,1200,300,150
Feb,1900,450,180
Mar,1500,375,165
Apr,2100,525,200
May,1800,450,175
Jun,2400,600,220`
    },
    {
      title: "Product Performance",
      prompt: "Generate a bar chart comparing product sales performance with analysis of market positioning.",
      data: `Product,Sales,Profit,Satisfaction
Product A,450,120,85
Product B,320,80,78
Product C,280,70,72
Product D,390,95,88
Product E,210,55,65`
    },
    {
      title: "Market Share Distribution",
      prompt: "Create a pie chart showing market share distribution with percentage analysis.",
      data: `Company,Share,Revenue
Company A,35,1200000
Company B,25,850000
Company C,20,680000
Company D,15,510000
Others,5,170000`
    }
  ];

  const loadSampleData = (sample: typeof sampleDataPrompts[0]) => {
    setCustomData(sample.data);
    setShowDataInput(true);
  };

  return (
    <ThesysWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Thesys AI Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Chat with AI and Generate Beautiful Data Visualizations
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Quick Start Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Start Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {sampleDataPrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => loadSampleData(sample)}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {sample.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {sample.prompt.substring(0, 80)}...
                  </p>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showDataInput"
                checked={showDataInput}
                onChange={(e) => setShowDataInput(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showDataInput" className="text-sm text-gray-700 dark:text-gray-300">
                Include custom data for visualization
              </label>
            </div>
          </div>

          {/* Custom Data Input */}
          {showDataInput && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Custom Data (CSV Format)
              </h2>
              <textarea
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder="Enter CSV data here (e.g., Category,Sales,Profit&#10;Product A,120,30&#10;Product B,90,20)"
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                💡 Tip: Include headers in the first row. The AI will automatically detect the best chart type for your data.
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Chat with AI
              </h2>
              
              {/* Input Area */}
              <form onSubmit={handleFormSubmit} className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me to create visualizations, analyze data, or help with anything else..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Response Area - Much Larger */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Response & Visualizations
              </h2>
              <div className="min-h-[600px] border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      return (
                        <div key={message.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          {message.role === "user" ? (
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {message.content}
                            </div>
                          ) : (
                            <C1Component
                              isStreaming={isLoading}
                              c1Response={message.content}
                              onAction={({ llmFriendlyMessage }) => {
                                console.log("Action triggered:", llmFriendlyMessage);
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Start a conversation to see visualizations and analysis
                      </p>
                                             <div className="text-sm text-gray-400 dark:text-gray-500 space-y-1">
                         <p>💡 Try: &quot;Create a bar chart comparing sales data&quot;</p>
                         <p>💡 Try: &quot;Analyze this data and show trends&quot;</p>
                         <p>💡 Try: &quot;Generate a pie chart for market share&quot;</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Use
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
              <li>• Use the quick start examples above to load sample data</li>
              <li>• Enable custom data input to analyze your own CSV data</li>
              <li>• Ask the AI to create charts, analyze trends, or provide insights</li>
              <li>• All visualizations include interactive features and explanations</li>
              <li>• Supports LineChart, BarChart, PieChart, AreaChart, RadarChart, and RadialChart</li>
            </ul>
          </div>
        </div>
      </div>
    </ThesysWrapper>
  );
};

export default Page;

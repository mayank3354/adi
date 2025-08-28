# Data Visualization with Thesys AI

This project demonstrates how to create beautiful, interactive data visualizations using the Thesys AI library. The implementation includes support for various chart types and provides a user-friendly interface for generating visualizations.

## Features

### Supported Chart Types

1. **LineChart** - Perfect for showing trends over time
   - Sales trends, temperature readings, stock prices
   - Shows correlations and fluctuations

2. **AreaChart** - Emphasizes volume and magnitude of change
   - Revenue growth by region
   - Cumulative values over time

3. **BarChart** - Compares quantities across categories
   - Product performance comparison
   - Both vertical and horizontal orientations

4. **PieChart** - Shows composition of a whole
   - Market share distribution
   - Survey responses

5. **RadarChart** - Compares multiple metrics across categories
   - Performance evaluation
   - Skill assessments

6. **RadialChart** - Shows progress and completion levels
   - Project completion status
   - Circular progress indicators

### Key Features

- **Interactive Interface**: Tab-based navigation between chat and visualization
- **Real-time Generation**: AI-powered chart generation with streaming responses
- **Sample Data**: Pre-configured sample datasets for each chart type
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic theme switching
- **Error Handling**: Graceful error handling and user feedback

## Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Thesys API Configuration
# Get your API key from: https://chat.thesys.dev/console/keys
THESYS_API_KEY=your_thesys_api_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Data Visualization Interface

1. **Navigate to Visualization Tab**: Click on "Data Visualization" in the header
2. **Select Chart Type**: Choose from the available chart types
3. **View Generated Chart**: The AI will generate a beautiful, interactive visualization
4. **Interact with Charts**: Hover, click, and explore the generated visualizations

### Chat Interface

1. **Navigate to Chat Tab**: Click on "Chat Interface" in the header
2. **Enter Prompts**: Ask questions or request specific visualizations
3. **Get AI Responses**: Receive interactive responses with charts and components

## API Endpoints

### `/api/visualize` (POST)

Generates data visualizations using Thesys AI.

**Request Body:**
```json
{
  "chartType": "lineChart",
  "data": {
    "title": "Monthly Sales",
    "data": [
      {"month": "Jan", "sales": 1200},
      {"month": "Feb", "sales": 1900}
    ]
  },
  "prompt": "Create a beautiful line chart visualization"
}
```

**Response:** Streaming response with generated visualization HTML/JSX

### `/api/ask` (POST)

Handles general chat interactions with Thesys AI.

**Request Body:**
```json
{
  "prompt": "Your question or request",
  "previousC1Response": "Optional previous context"
}
```

## Sample Data Structure

The application includes sample data for each chart type:

### Line Chart Data
```json
{
  "title": "Monthly Sales Trend",
  "data": [
    {"month": "Jan", "sales": 1200},
    {"month": "Feb", "sales": 1900},
    {"month": "Mar", "sales": 1500}
  ]
}
```

### Bar Chart Data
```json
{
  "title": "Product Performance",
  "data": [
    {"product": "Product A", "sales": 450},
    {"product": "Product B", "sales": 320}
  ]
}
```

### Pie Chart Data
```json
{
  "title": "Market Share Distribution",
  "data": [
    {"company": "Company A", "share": 35},
    {"company": "Company B", "share": 25}
  ]
}
```

## Customization

### Adding New Chart Types

1. Add new chart type to `sampleData` in `DataVisualization.tsx`
2. Update the system prompt in `/api/visualize/route.ts`
3. Add corresponding sample data

### Styling Customization

The application uses Tailwind CSS for styling. You can customize:
- Colors and themes
- Layout and spacing
- Component styling
- Dark mode appearance

### API Customization

Modify the system prompt in `/api/visualize/route.ts` to:
- Change chart generation behavior
- Add new visualization types
- Customize styling preferences
- Adjust AI parameters

## Technical Implementation

### Components

- **DataVisualization.tsx**: Main visualization interface
- **Loader.tsx**: Loading spinner component
- **page.tsx**: Main application with tab navigation

### API Routes

- **/api/visualize/route.ts**: Visualization generation endpoint
- **/api/ask/route.ts**: General chat endpoint

### State Management

- **useUIState.ts**: Custom hook for managing application state
- **api.ts**: API call utilities with streaming support

## Thesys AI Integration

The application leverages Thesys AI's capabilities:

- **Generative UI**: AI generates interactive components
- **Streaming Responses**: Real-time visualization generation
- **Component Library**: Built-in chart and UI components
- **Theme Support**: Automatic light/dark mode handling

## Best Practices

### Data Visualization

1. **Choose Appropriate Chart Types**: Match chart type to data structure
2. **Include Proper Labels**: Always add titles, axis labels, and legends
3. **Use Meaningful Colors**: Ensure good contrast and accessibility
4. **Make Interactive**: Add tooltips and hover effects
5. **Responsive Design**: Ensure charts work on all screen sizes

### API Usage

1. **Error Handling**: Always handle API errors gracefully
2. **Loading States**: Show loading indicators during generation
3. **Streaming**: Use streaming for better user experience
4. **Rate Limiting**: Respect API rate limits

## Troubleshooting

### Common Issues

1. **API Key Not Set**: Ensure `THESYS_API_KEY` is set in `.env.local`
2. **CORS Errors**: Check that the API endpoint is accessible
3. **Streaming Issues**: Verify that the response is properly handled
4. **Styling Problems**: Check Tailwind CSS configuration

### Debug Mode

Enable debug logging by adding to your environment:
```bash
DEBUG=thesys:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [Thesys Documentation](https://docs.thesys.dev)
- Visit the [Thesys Console](https://chat.thesys.dev/console)
- Review the [API Reference](https://docs.thesys.dev/welcome/api-reference)

# US Abortion Statistics Dashboard

A professional, interactive web dashboard for visualizing abortion statistics across the United States, featuring state-by-state breakdown and detailed data insights.

![Dashboard Preview](https://img.shields.io/badge/Dashboard-Interactive-2C3E50)
![Platform](https://img.shields.io/badge/Platform-Web-34495E)
![Framework](https://img.shields.io/badge/Framework-React/Express-61DAFB)

## Features

- **Interactive US Map Visualization**: Color-coded map showing abortion statistics by state
- **Multiple Data Views**: Toggle between total count, rate per 1,000 women, and percentage change
- **Regional and Legal Status Filters**: Filter data by US region and legal status
- **Comprehensive Data Table**: Sortable, searchable table with detailed state-level statistics
- **Summary Statistics**: National averages and key metrics at a glance
- **Responsive Design**: Optimized for desktop and mobile devices

## Technology Stack

- **Frontend**: React, Shadcn UI, Tailwind CSS, React Query
- **Backend**: Express.js
- **Data Visualization**: React Simple Maps, D3.js for scaling
- **State Management**: React Query for server state
- **Data Storage**: In-memory storage with proper typed interfaces

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/us-abortion-statistics-dashboard.git
cd us-abortion-statistics-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
├── server/                # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage implementation
│   └── vite.ts            # Vite server configuration
├── shared/                # Shared code between frontend and backend
│   ├── abortionData.ts    # Static abortion data
│   └── schema.ts          # TypeScript types and schemas
└── README.md              # Project documentation
```

## Data Views

The dashboard offers three different ways to view the data:

- **Total Count**: The absolute number of abortions per state
- **Rate**: Abortions per 1,000 women aged 15-44 in each state
- **Percentage Change**: Year-over-year change in abortion rates

## Filtering Options

Users can filter the data by:

- **Region**: Northeast, Midwest, South, West, or All
- **Legal Status**: Legal, Restricted, Banned, or All
- **Search**: Filter states by name or other attributes

## Interactive Map Features

- **Hover Tooltips**: Display detailed state information on hover
- **Click Interaction**: Show detailed state statistics when clicked
- **Zoom Controls**: Zoom in/out and reset view

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sourced from authoritative public health institutions
- Map visualization based on US GeoJSON data
- Built with modern React and Express best practices
# MacroBoard - Economic Data Dashboard

This project is a **full-stack economic data visualization dashboard** that fetches and displays U.S. economic indicators from the Federal Reserve Economic Data (FRED) API with AI-powered insights.  
It combines **FastAPI backend** with **React frontend** to create an interactive and intelligent economic analysis tool.

# How It Started
I wanted to create a **centralized platform** to track and analyze macroeconomic data, combining my interest in economics with my full-stack development skills.  
The dashboard provides real-time insights into economic trends with AI-generated analysis, making complex economic data more accessible and actionable.

# Architecture Overview
- **Backend**: FastAPI (Python) with data caching and AI-powered insights
- **Frontend**: React + Vite with Tailwind CSS and Recharts for visualization  
- **Deployment**: Render for backend, Vercel for frontend
- **Data Source**: Federal Reserve Economic Data (FRED) API

# Core Functionality

## Economic Indicators Tracked
The dashboard monitors 6 key economic indicators:
- **Unemployment Rate** (`UNRATE`) - Monthly data
- **Consumer Price Index** (`CPIAUCSL`) - Monthly inflation data  
- **Federal Funds Rate** (`FEDFUNDS`) - Monthly interest rate data
- **Gross Domestic Product** (`GDP`) - Quarterly GDP data
- **Personal Consumption Expenditures** (`PCE`) - Monthly consumer spending
- **10-Year Treasury - 3-Month Treasury Spread** (`T10Y3M`) - Daily yield curve data

## Key Features

### Data Visualization
- **Interactive line charts** for each economic indicator
- **5-year rolling window** of data (automatically updates)
- **Real-time trend analysis** with direction indicators (📈📉➡️)
- **Volatility metrics** and percentage change calculations
- **Responsive design** with dark/light mode toggle

### AI-Powered Insights
- **Individual Series Analysis**: AI-generated insights for each economic indicator
- **Overall Economic Health Score**: Composite scoring system (0-100%) based on:
  - GDP growth (year-over-year)
  - Unemployment rate (optimal around 4%)
  - Inflation vs 2% target
  - Federal Funds Rate positioning
  - Consumer spending growth
  - Yield curve health
- **Comprehensive Economic Assessment**: AI-generated narrative combining all metrics

### Performance & Caching
- **Multi-layer caching system**:
  - Backend file-based cache (24-hour duration)
  - Frontend localStorage cache with frequency-aware expiration
  - Stale-while-revalidate pattern for instant loading
- **Parallel data fetching** for faster load times
- **Cache management UI** with statistics and manual controls

# Technical Implementation

## Backend Structure
- **FastAPI** main application with CORS middleware
- **File-based caching system** for performance optimization
- **Modular series classes** for each economic indicator
- **FRED API client** with error handling and rate limiting
- **Statistical trend analysis** with volatility calculations
- **OpenAI GPT-4o-mini integration** for AI insights generation

## Frontend Structure
- **React + Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Recharts** for interactive data visualization
- **Custom API client** with intelligent caching
- **Dark/light mode** theme switching
- **Responsive design** for all device sizes

## Data Flow
1. **Data Fetching**: Backend queries FRED API for economic data
2. **Trend Analysis**: Statistical analysis computes direction, volatility, and change metrics
3. **AI Processing**: OpenAI GPT-4o-mini generates contextual insights
4. **Caching**: Results cached at multiple levels for performance
5. **Visualization**: React components render interactive charts
6. **Health Scoring**: Composite economic health calculation

# Use Cases
This dashboard is perfect for:
- **Economic analysts** monitoring U.S. economic health
- **Investors** tracking macroeconomic trends
- **Students** learning about economic indicators
- **Policy makers** assessing economic conditions
- **Anyone** interested in understanding the current economic landscape

# Challenges
- **Data integration** — combining data from FRED API with proper error handling
- **Real-time updates** — ensuring data freshness with intelligent caching
- **Performance optimization** — handling large datasets with multi-layer caching
- **AI integration** — generating meaningful insights from complex economic data
- **Full-stack coordination** — seamless communication between FastAPI and React

# Reflection
This project significantly enhanced my **full-stack development skills**, **data analysis capabilities**, and **AI integration knowledge**.  
It demonstrates my ability to work with real-world APIs, create meaningful visualizations, and build intelligent systems that make complex data accessible.  
The dashboard serves as a practical tool for economic analysis and showcases my skills in modern web development, data science, and AI implementation.

# Future Enhancements
- **Machine learning predictions** — implementing forecasting models for economic trends
- **Custom alerts** — notifications for significant economic changes
- **Comparative analysis** — side-by-side country/region comparisons
- **Mobile app version** — native mobile application for on-the-go access
- **Advanced AI features** — more sophisticated economic analysis and predictions

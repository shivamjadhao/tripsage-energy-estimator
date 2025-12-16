🚗 TripSage – Smart Trip Energy & Cost Estimator

TripSage is an AI-powered application that estimates fuel or electricity consumption, travel cost, and CO₂ emissions for trips based on distance, vehicle type, and driving conditions. It helps users make informed and cost-effective travel decisions.

🔍 Features

Estimate fuel or EV energy required for a trip

Calculate travel cost using current fuel/electricity prices

Compare multiple vehicles based on mileage and efficiency

Estimate carbon emissions for petrol, diesel, and EVs

Simple, data-driven recommendations to reduce trip cost

🛠 Tech Stack

Python

Pandas & NumPy

FastAPI / Flask (backend)

Google AI Studio (Gemini) for insights & explanations

Plotly / Matplotlib for visualizations

📊 How It Works

User inputs trip distance or route

Selects vehicle type or model

App calculates energy usage, cost, and emissions

Displays comparison and recommendations

🚀 Future Enhancements

Google Maps API integration for real-time distance

Live fuel and electricity pricing

User accounts and trip history

Mobile-friendly UI


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

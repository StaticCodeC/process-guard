# ZoPark — Halifax Parking Finder MVP

A web app for finding parking in Halifax using real open data from Halifax Regional Municipality.

## Project Structure
```
zopark/
├── backend/           # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── frontend/          # React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       └── components/
│           ├── MapView.jsx
│           ├── Navbar.jsx
│           ├── SidePanel.jsx
│           └── AiBanner.jsx
└── raw_data_halifax/  # Place HRM open data files here
```

## Data Setup

Place the following files in `raw_data_halifax/` (at the project root):

- `Parking_Pay_Stations_*.csv`
- `Accessible_Parking_Spots_*.geojson`
- `Park_Ride_*.geojson`
- `Park_Ride_*.csv`

## Running Locally

```bash
# Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:8000

## Features

- Interactive Leaflet map centered on Halifax
- 3 parking types: Pay Stations, Accessible Spots, Park & Ride
- Real-time availability simulation
- Density heatmap toggle
- Side panel with spot details + Google Maps directions
- Dark theme UI

## Data Sources

Halifax Regional Municipality Open Data:
- Parking Pay Stations
- Accessible Parking Spots
- Park & Ride lots

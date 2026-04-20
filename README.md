# U.S. Global Military Footprint

Interactive globe app built with React, Vite, react-globe.gl, and three to visualize:

- U.S. host countries
- major overseas bases
- conflict / war theaters
- animated arcs from Washington, D.C.
- timeline-based filtering
- search and region filtering

This project is a visualization tool, not an official government dataset.

## Features

- Dark “intel dashboard” style UI
- 3D interactive globe
- Country-level host-country layer
- Major-base marker layer
- Conflict / combat-theater layer
- Animated arcs from Washington, D.C.
- Timeline slider for historical filtering
- Search by country, base, region, or conflict
- Region / theater filters
- Quick camera jumps to key regions
- Ready to scale to larger JSON datasets later

## Tech Stack

- React
- Vite
- react-globe.gl
- three

## Installation

Clone the repo and install dependencies:

npm install

If needed, install the main packages explicitly:

npm install react react-dom react-globe.gl three

Run the development server:

npm run dev

## Project Structure

At minimum, the app can live in a simple Vite structure like this:

src/
  App.jsx
  main.jsx
public/
  data/

Right now, the dataset is embedded directly in App.jsx as starter arrays:

- BASE_HOST_COUNTRIES
- MAJOR_BASES
- CONFLICTS

## Data Included

The current version includes curated starter data for:

- host countries with known U.S. military presence
- selected major overseas bases
- selected wars / conflict theaters involving the United States

This is starter data, not a definitive or exhaustive list of every base, deployment site, or conflict.

## Controls

The right-side control panel lets you:

- toggle host countries
- toggle major bases
- toggle conflicts
- toggle animated arcs
- enable / disable auto-rotation
- filter by year
- search by keyword
- filter by region or theater
- jump camera view to major world regions

## Timeline Logic

The timeline slider filters records based on year:

- Host countries appear when since <= selected year
- Major bases appear when since <= selected year
- Conflicts appear when start <= selected year <= end

This allows the globe to act as a historical snapshot for a selected year.

## Scaling the Dataset

This app is already structured so the UI does not need to change when the dataset grows.

Recommended next step:

Move the embedded arrays into JSON files inside public/data/:

public/data/hosts.json
public/data/bases.json
public/data/conflicts.json

Then fetch them inside useEffect() instead of hardcoding them in App.jsx.

Suggested schema additions:

- branch
- personnel
- status
- source
- endYear
- category
- notes

## Example Future JSON Format

bases.json

[
  {
    "name": "Ramstein Air Base",
    "country": "Germany",
    "lat": 49.4369,
    "lng": 7.6003,
    "region": "Europe",
    "since": 1952,
    "kind": "Air Force"
  }
]

hosts.json

[
  {
    "id": "deu",
    "name": "Germany",
    "lat": 51.1657,
    "lng": 10.4515,
    "region": "Europe",
    "since": 1945,
    "type": "host"
  }
]

conflicts.json

[
  {
    "id": "iraq-2003",
    "name": "Iraq War / OIR era",
    "country": "Iraq",
    "lat": 33.2232,
    "lng": 43.6793,
    "start": 2003,
    "end": 2026,
    "theater": "Middle East"
  }
]

## Notes on Country Borders

The app loads country polygons from:

- world-atlas
- topojson-client

This is used to render a country-border layer on the globe.

## Disclaimer

This repository is intended for:

- educational use
- public-interest visualization
- historical / geopolitical exploration

It is not an official U.S. government resource and should not be treated as an authoritative operational map.

The current dataset is based on curated public information and is not guaranteed to be complete, current, or error-free.

## Possible Improvements

- move data into versioned JSON files
- add citations / sources per record
- add branch-specific filters
- add personnel-size or strategic-importance weighting
- add click-to-lock side panel details
- add historical base closures and end dates
- add heatmaps or regional summaries
- add mobile layout improvements

Built as a React globe visualization project for mapping U.S. military presence, major bases, and conflict theaters over time.

# Sunday Open Shops Germany

A web app to find shops that are open on Sundays in Germany. Features an interactive map with a scrollable list of shops.

## Tech Stack

- **React** (Vite) - Fast development with HMR
- **Tailwind CSS** - Utility-first styling
- **Leaflet** (react-leaflet) - Interactive maps

## Features

- Split-screen layout: Map on the left, shop list on the right
- Filter shops by category (Supermarket, Späti, Pharmacy)
- Shop cards showing name, category, and Sunday hours
- Responsive design for mobile and desktop
- Color-coded map markers by category

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── FilterBar.jsx    # Category filter buttons
│   ├── Header.jsx       # App header
│   ├── Map.jsx          # Leaflet map component
│   ├── ShopCard.jsx     # Individual shop card
│   └── ShopList.jsx     # Scrollable list of shops
├── data/
│   └── shops.json       # Shop data (edit this to add/modify shops)
├── App.jsx              # Main app component
├── index.css            # Global styles + Tailwind
└── main.jsx             # App entry point
```

## Editing Shop Data

Edit `src/data/shops.json` to add or modify shops:

```json
{
  "id": 1,
  "name": "Shop Name",
  "category": "Supermarket",
  "address": "Street Address, City",
  "sundayHours": "10:00 - 18:00",
  "lat": 52.5200,
  "lng": 13.4050
}
```

**Categories:** `Supermarket`, `Späti`, `Pharmacy`

## Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sunday Open Shops app"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/sunday-open-shops.git

# Push to GitHub
git push -u origin main
```

### Creating a New GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Enter repository name (e.g., `sunday-open-shops`)
3. Keep it public or private as preferred
4. **Do NOT** initialize with README (we already have one)
5. Click "Create repository"
6. Follow the push commands above

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the `dist` folder to Netlify
```

## License

MIT

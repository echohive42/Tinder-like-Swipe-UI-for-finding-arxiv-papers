# ArXiv Paper Discovery App 🔍

## Overview

This is a Tinder-style paper discovery application for ArXiv research papers. Users can search for papers and swipe through them, saving interesting ones for later reference.

## Key Features

- 🌙 Dark mode interface with beautiful animations
- 🔄 Tinder-like card swiping interface
- 💾 Local storage for liked and viewed papers
- ♾️ Continuous paper loading
- 📱 Responsive design for all devices

## ❤️ Support & Get 400+ AI Projects

This is one of 400+ fascinating projects in my collection! [Support me on Patreon](https://www.patreon.com/c/echohive42/membership) to get:

- 🎯 Access to 400+ AI projects (and growing daily!)
  - Including advanced projects like [2 Agent Real-time voice template with turn taking](https://www.patreon.com/posts/2-agent-real-you-118330397)
- 📥 Full source code & detailed explanations
- 📚 1000x Cursor Course
- 🎓 Live coding sessions & AMAs
- 💬 1-on-1 consultations (higher tiers)
- 🎁 Exclusive discounts on AI tools & platforms (up to $180 value)

## How to Run

1. Install requirements:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
python main.py
```

3. Open browser at: `http://127.0.0.1:8000`

## File Structure

```
├── main.py              # FastAPI server and ArXiv integration
├── requirements.txt     # Python dependencies
├── static/             # Frontend assets
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── script.js       # JavaScript functionality
```

## Core Functionality

### 1. Search

- Enter search terms in the search bar
- Press Enter to search
- Papers are fetched from ArXiv API

### 2. Paper Interaction

- Swipe right or click heart to like
- Swipe left or click X to dismiss
- Cards can be dragged with mouse/touch
- Smooth animations during interactions

### 3. Liked Papers

- Appear in left sidebar
- Click to view full details
- Opens modal with paper information
- Contains link to PDF

### 4. Data Management

- Viewed papers are tracked
- Liked papers are saved
- Data persists in local storage
- Reset button clears all data

### 5. Continuous Loading

- Papers load automatically
- Skips previously viewed papers
- Maintains smooth experience

## Technical Details

### Backend (main.py)

- FastAPI framework
- ArXiv API integration
- Handles paper fetching and pagination
- Returns JSON data to frontend

### Frontend

- Pure JavaScript (no framework)
- CSS animations and transitions
- Local storage for data persistence
- Touch and mouse interaction support

### User Interface

- Dark mode with gradients
- Glass-morphism effects
- Responsive layout
- Beautiful icons and animations
- Smooth card transitions

## Data Flow

1. User enters search term
2. Backend fetches papers from ArXiv
3. Frontend displays papers as cards
4. User interactions update local storage
5. Liked papers appear in sidebar
6. Modal shows detailed paper info

## Tips

- Use specific search terms for better results
- Swipe or use buttons for interaction
- Click liked papers to view details
- Use reset button to clear history
- Papers can be opened in new tab

> **Note**: The app requires an internet connection to fetch papers from ArXiv.

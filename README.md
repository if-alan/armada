# Armada – MBTA Vehicle Tracking App

Armada is a mobile application built with React Native and Expo that allows you to track MBTA public transportation vehicles in real-time. The app connects directly to the MBTA API to display vehicle, route, and trip data.

**Main Features**
1. Real-time Vehicle Tracking – View live vehicle positions on the map, complete with their status.
2. Filter by Route – Display only vehicles from a specific route.
3. Filter by Trip – Focus on a specific trip within a route.
4. Vehicle Details – View full info such as coordinates, status, and last update time.
5. Interactive Map – Navigate and monitor vehicles directly on a zoomable and pannable map.

## How to Use

### 1. Installation
Before getting started, make sure you have Node.js, npm, and Expo CLI installed.
```
git clone <repo-url>
cd armada
npm install
npx expo start
```
Open it in an emulator or directly use Expo Go on your phone to run the app.

### 2. App Navigation
   * **Home Screen** – Displays a list of currently active vehicles.
   * **Vehicle Filter**
     - Use the "Route Filter" button to select a specific route.
     - After selecting a route, you can use the "Trip Filter" to narrow down to a specific trip.
     - Tap "Delete All" to clear all active filters.
   * **Vehicle Details**
     - Tap on a vehicle card to view full info on the map.
     - Includes real-time location, status, coordinates, as well as route and trip information.
   * **Refresh Data** – Pull down to refresh and get the latest vehicle data.
   * **Infinite Scroll** – The vehicle list will keep loading automatically as you scroll down.

## Structure & Architecture
Armada uses a Clean Architecture approach to keep the codebase modular, organized, and scalable for future development.
Folder Structure (In short):
```
/app                 # Main routing and layout for Expo
/src
  /core              # General configs and utilities
  /data              # Data sources (API), mappings, and repositories
  /domain            # Entities, use cases, and repository interfaces
  /presentation      # UI components and hooks
  /di                # Providers for DI (Dependency Injection)
```

**Three Main Layers:**
1. Presentation Layer
   * Contains the UI and user interactions
   * Connects to the domain via hooks and props
2. Domain Layer
   * Where the business logic lives
   * Contains entities such as Vehicle, Route, Trip
   * All app logic is wrapped in use cases
3. Data Layer
   * Fetches data from the MBTA API
   * Maps API data format to internal format
   * Implements the repository interfaces

## Development Plan
Some ideas for future development:
1. Performance Optimization & Caching
   * Cache data to reduce API load
   * Offline support using AsyncStorage or a local database
2. UX/UI Enhancements
   * Automatic dark & light mode
   * Skeleton loading instead of basic spinners
3. Architecture & Infrastructure
   * Add unit tests & integration tests
   * Integrate analytics (e.g., Firebase) to monitor performance & errors

---
With a clean and modular structure, Armada is flexible enough to add new features or be modified in the future. 
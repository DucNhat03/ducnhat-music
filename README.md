# DucNhat Music Website

A modern music streaming website with a song playlist management system (CRUD operations).

## Features

- View and play songs
- Add new songs
- Edit existing songs
- Delete songs
- Search for songs by title
- Responsive design
- Dark theme with custom UI components
- Interactive music player with playback controls

## Tech Stack

### Frontend
- React.js (Vite)
- TypeScript
- TailwindCSS
- React Router Dom
- Axios for API calls

### Backend
- Spring Boot
- Spring Data JPA
- H2 Database (in-memory)
- Lombok

## Project Structure

The project is divided into two main parts:

### Frontend (`/frontend` directory)
- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/services` - API service functions
- `/src/types` - TypeScript type definitions

### Backend (`/backend` directory)
- `/src/main/java/com/ducnhat/musicapp/model` - Entity classes
- `/src/main/java/com/ducnhat/musicapp/repository` - Data repositories
- `/src/main/java/com/ducnhat/musicapp/service` - Business logic
- `/src/main/java/com/ducnhat/musicapp/controller` - REST API endpoints

## UI Features

- **Dark Theme**: Modern dark mode interface with purple accent colors
- **Responsive Design**: Optimized for desktop and mobile devices
- **Music Player**: Persistent player at the bottom of the screen
- **Custom Components**: 
  - SongCard: Displays song information with hover effects
  - Navbar: Navigation with responsive mobile menu
  - MusicPlayer: Controls for play, pause, skip, and volume
  - Footer: Information and links

## Getting Started

### Prerequisites
- Node.js and npm
- Java 17 or higher
- Maven

### Running the Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   or on Windows:
   ```
   mvnw.cmd spring-boot:run
   ```
3. The backend server will start on http://localhost:8080

### Running the Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The frontend will be available at http://localhost:5173

## API Endpoints

### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/{id}` - Get a specific song by ID
- `POST /api/songs` - Create a new song
- `PUT /api/songs/{id}` - Update an existing song
- `DELETE /api/songs/{id}` - Delete a song

### Search
- `GET /api/songs/search/title?query={query}` - Search songs by title
- `GET /api/songs/search/artist?query={query}` - Search songs by artist
- `GET /api/songs/search/genre?query={query}` - Search songs by genre

## License
This project is open source and available under the [MIT License](LICENSE). 
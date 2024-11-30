# Document Grid Project

A React-based document management interface with drag-and-drop functionality and auto-save feature.

## Features

- Interactive grid layout with drag-and-drop reordering
- Automatic saving with visual feedback
- Image preview with modal view
- Mock API with MSW for frontend development

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- MSW (Mock Service Worker)
- @hello-pangea/dnd (Drag and Drop)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/Eren-Jager/zania-document.git
cd zania-document
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Running with Docker

1. Build and start the container:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost`

To stop the containers:
```bash
docker-compose down
```

## Project Structure

```
├── src/
│   ├── components/        # React components
│   │   ├── DocumentGrid.tsx
│   │   ├── SaveStatus.tsx
│   │   └── Spinner.tsx
│   ├── services/         # API and storage services
│   │   ├── api.ts
│   │   └── storage.ts
│   ├── mocks/           # MSW handlers
│   │   ├── browser.ts
│   │   └── handlers.ts
│   ├── types/           # TypeScript interfaces
│   └── data/            # Static data
├── public/              # Static files
└── docker/              # Docker configuration
```

## API Endpoints

The mock API provides the following endpoints:

- `GET /api/documents` - Fetch all documents
- `PUT /api/documents` - Update document order
- `POST /api/documents` - Add new document

## Code Formatting

This project uses Prettier for code formatting. To format code:

```bash
npm run format
```

## Author

Chandrakanth Ande
```
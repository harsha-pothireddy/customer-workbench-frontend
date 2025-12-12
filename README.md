# Customer Workbench Frontend

Modern React-based frontend for the Customer Insights Workbench application. It provides a file upload UI (CSV/JSON) for customer interaction data and a search/filter UI to view interaction records.

## Architecture

### Technology Stack
- **Framework**: React 18.2
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: CSS3 with custom properties

### Project Structure
```
src/
├── components/
│   ├── Navigation.jsx       # Main navigation header
│   └── Navigation.css
├── pages/
│   ├── UploadPage.jsx       # File upload interface
│   ├── UploadPage.css
│   ├── SearchPage.jsx       # Search and filter interface
│   └── SearchPage.css
├── services/
│   └── api.js               # API communication
├── App.jsx                  # Main application component
├── App.css
├── index.css                # Global styles
└── main.jsx                 # Application entry point
```

### Key Features

#### 1. Navigation
- Header with app branding
- Navigation links to Upload and Search pages
- Active route indicator

#### 2. Upload Page
- File upload via standard file input (CSV and JSON)
- Client-side file validation (by MIME type and filename)
- Simple loading indicator during upload
- Success/error messages and upload summary
- Format guide with examples

> Note: There is currently no drag-and-drop area or byte-level upload progress indicator in the UI. These can be added later if desired.

#### 3. Search Page
- Multi-criteria filtering:
  - Search by Customer ID
  - Filter by Interaction Type (Email, Chat, Ticket, Feedback)
  - Filter by Date Range
- Paginated results display
- Responsive data table with:
  - Timestamp
  - Customer ID
  - Interaction Type (with badges)
  - Customer Rating
  - Feedback (truncated)
  - Support Response (truncated)
- Loading states
- Error handling

#### 4. API Integration
- Centralized API client using axios, defined in `src/services/api.js`
- Error handling and user feedback
- Multipart form data uploads for file uploads

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000` by default.

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## API Integration

The frontend communicates with the backend via REST APIs:

### Upload Endpoint

POST /api/uploads (multipart/form-data)

Request body: file (binary)

Response example:
```json
{
  "success": true,
  "message": "Upload processed",
  "uploadJobId": 123,
  "processedRecords": 42,
  "failedRecords": 0
}
```

### Search Endpoint

GET /api/interactions/search?customerId=CUST-001&interactionType=email&page=0&size=10

Response example:
```json
{
  "interactions": [ /* array of interaction objects */ ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "pageSize": 10
}
```

## Configuration

### Backend API URL
The project currently uses a hardcoded base URL for API requests in `src/services/api.js`:

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api'
```

To point the frontend to another backend URL, update that constant in `src/services/api.js`.

Tip: If you prefer to use environment variables (e.g. `VITE_API_URL`), you can change the file to read from `import.meta.env.VITE_API_URL` with a fallback.

### CORS & Dev Proxy
Vite is configured to proxy `/api` to `http://localhost:8080` during local development (see `vite.config.js`), which avoids CORS for `/api` calls when running the dev server. When deploying the frontend separately from the backend, ensure the backend enables CORS or that you configure a reverse proxy to avoid cross-origin issues.

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Optimized table layout for small screens

### Accessibility
- Semantic HTML structure
- Proper form labels and ARIA attributes
- Keyboard navigation support

### User Feedback
- Loading spinners during async operations
- Success/error alert messages
- Disabled states for buttons during loading
- Pagination controls

### Styling
- Custom CSS properties for theming
- Consistent color scheme and spacing
- Smooth transitions and animations
- Professional badge indicators for interaction types

## Component Details

### UploadPage
- Features: File selection via file input, format validation, simple loading indicator, result summary
- State Management: File, loading, message, upload result
- Error Handling: File validation, API error handling

### SearchPage
- Features: Multi-filter search, pagination, responsive table
- State Management: Filters, results, loading, error, search status
- Data Display: Formatted timestamps, truncated text, rating display

### Navigation
- Features: Logo, navigation links, active route highlighting
- Responsive: No hamburger menu yet; mobile layout is supported but a hamburger menu can be added later

## Testing

Run tests with:
```bash
npm run test
```

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure build command: `npm run build`
3. Configure output directory: `dist`
4. Add environment variables if needed
5. Deploy

### Docker
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t customer-workbench-frontend .
docker run -p 3000:80 customer-workbench-frontend
```

## Environment Variables

This project does not currently read an API URL from environment variables by default. If you'd like to configure the base API URL via an env var, add a `.env` file and update `src/services/api.js` to use `import.meta.env.VITE_API_URL` with a fallback. Example `.env` (optional):

```
VITE_API_URL=http://localhost:8080/api
```

Then change `src/services/api.js` accordingly.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations
- Lazy loading of routes with React.lazy (can be extended)
- Optimized CSS with custom properties
- Efficient re-renders with React hooks
- Pagination to limit data on screen

## Future Enhancements
- Advanced search with saved filters
- Export search results to CSV
- Data visualization and charts
- User authentication and authorization
- Real-time notifications
- Dark mode support
- Internationalization (i18n)
- Accessibility improvements

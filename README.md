# Customer Workbench Frontend

Modern React-based frontend for the Customer Insights Workbench application, enabling users to upload customer interaction data and search/filter records.

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

#### 1. **Navigation**
- Clean header with app branding
- Navigation links to Upload and Search pages
- Active route indicator

#### 2. **Upload Page**
- Drag-and-drop file upload support
- CSV and JSON file format support
- Real-time file validation
- Upload progress feedback
- Success/error messages
- Upload summary display
- Format guide with examples

#### 3. **Search Page**
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

#### 4. **API Integration**
- Centralized API client with axios
- Automatic request/response handling
- Error handling and user feedback
- Support for multipart form data uploads

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
```javascript
POST /api/uploads
Content-Type: multipart/form-data

Body: file (binary)

Response:
{
  "success": boolean,
  "message": string,
  "uploadJobId": number,
  "processedRecords": number,
  "failedRecords": number
}
```

### Search Endpoint
```javascript
GET /api/interactions/search?customerId=CUST-001&interactionType=email&page=0&size=10

Response:
{
  "interactions": [...],
  "totalElements": number,
  "totalPages": number,
  "currentPage": number,
  "pageSize": number
}
```

## Configuration

### Backend API URL
Modify the `API_BASE_URL` in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

### CORS Settings
Ensure your backend has CORS enabled for the frontend origin (e.g., `http://localhost:3000`).

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
- **Features**: File selection, format validation, upload progress, result summary
- **State Management**: File, loading, message, upload result
- **Error Handling**: File validation, API error handling

### SearchPage
- **Features**: Multi-filter search, pagination, responsive table
- **State Management**: Filters, results, loading, error, search status
- **Data Display**: Formatted timestamps, truncated text, rating display

### Navigation
- **Features**: Logo, navigation links, active route highlighting
- **Responsive**: Hamburger menu on mobile (can be extended)

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

Create a `.env` file in the project root:
```
VITE_API_URL=http://localhost:8080/api
```

Use in code:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL
```

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

# AI Resume Improver

A full-stack MERN application that uses AI to improve resumes. Upload a PDF resume and get an AI-enhanced version with better formatting, content optimization, and professional structure.

## Features

- **PDF Upload & Processing**: Upload PDF resumes and extract text content
- **AI-Powered Improvement**: Uses Groq LLaMA 3.1 8B Instant for intelligent resume enhancement
- **User Authentication**: Secure JWT-based authentication system
- **Clean PDF Output**: Generates professional, well-formatted PDF resumes
- **Responsive Design**: Modern React frontend with mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Groq API** (LLaMA 3.1 8B Instant)
- **PDF Processing** with pdf-parse
- **JWT Authentication**
- **Puppeteer** for PDF generation

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── utils/          # Frontend utilities
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── middleware/             # Express middleware
│   ├── auth.js            # JWT authentication
│   └── upload.js          # File upload handling
├── models/                # MongoDB models
│   ├── User.js            # User schema
│   └── Resume.js          # Resume schema
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   └── cv.js              # Resume processing routes
├── server.js              # Express server
├── package.json           # Backend dependencies
├── render.yaml            # Render deployment config
└── .env                   # Environment variables
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5002
```

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Groq API key

### Backend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume Processing
- `POST /api/cv/upload` - Upload PDF and extract text
- `POST /api/cv/improve` - Improve resume with AI
- `GET /api/health` - Health check

## AI Processing Pipeline

1. **PDF Upload** → Extract text content from PDF
2. **Text Processing** → Clean and structure extracted text
3. **AI Enhancement** → Send to Groq API for improvement
4. **JSON Response** → Receive structured resume data
5. **HTML Generation** → Create formatted HTML template
6. **PDF Generation** → Convert HTML to professional PDF

## Deployment

This application is configured for deployment on:
- **Backend**: Render (free tier)
- **Frontend**: Vercel (free tier)
- **Database**: MongoDB Atlas (free tier)

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

## Development

### Running Locally
```bash
# Start backend (from root directory)
npm run dev

# Start frontend (from client directory)
cd client && npm start
```

### Testing
- Backend runs on `http://localhost:5002`
- Frontend runs on `http://localhost:3001`
- Health check: `http://localhost:5002/api/health`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For deployment help, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Quick deployment checklist

---

**Ready for production deployment!** 🚀
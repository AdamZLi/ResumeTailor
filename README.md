# ResumeTailor - AI-Powered Resume Tailoring System

> A full-stack application that helps you tailor your resume for specific job applications using AI-powered keyword extraction and minimal, structure-preserving edits.

## 🌟 Features

### Resume Upload & Parsing
- Upload PDF resumes (max 10MB)
- Automatic parsing into structured format
- Extract sections: Experience, Education, Skills, etc.
- Intelligent text extraction and normalization

### Job Description Analysis
- Extract keywords from job URLs or pasted text
- Multi-strategy web scraping (Ashby, Greenhouse, and more)
- AI-powered keyword categorization using OpenAI GPT
- Resume-JD keyword comparison with auto-selection

### Smart Resume Tailoring
- **Plan-and-Annotate Workflow**: Minimal edits that preserve original structure
- **Three Insertion Strategies**: Modifier, Parenthetical, Tail
- **Strict Validation**: Maximum 2 words or 25 characters per insertion
- **PDF Annotation**: Visual feedback with highlights and sticky notes
- **Change Tracking**: Comprehensive diff and change logs

### Structured Resume Editor
- Inline editing of all resume sections
- Live preview with ATS-safe formatting
- Link management and URL validation
- Autosave functionality with 800ms debouncing
- Character limit enforcement for optimal readability

### Preview & Export
- **Three Preview Modes**: Clean, Diff, Keywords
- Side-by-side comparison of original vs. tailored resume
- Keyword highlighting in context
- Annotated PDF generation
- Export to PDF/HTML formats

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ResumeTailor
   ```

2. **Set up backend**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Configure environment
   cp env.example .env
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Set up frontend**
   ```bash
   cd nextjs-client
   npm install
   cd ..
   ```

4. **Run the application**

   **Terminal 1 - Backend:**
   ```bash
   python3 main.py
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd nextjs-client
   npm run dev
   ```

5. **Access the application**
   - **Frontend UI**: http://localhost:3000 ← **Start here!**
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📖 How to Use

1. **Upload Resume**: Click to select or drag-drop your PDF resume
2. **Enter Job Details**: Add job title and job posting URL (or paste job description text)
3. **Extract Keywords**: AI analyzes the job posting and extracts relevant keywords
4. **Review Keywords**: See which keywords you're missing (auto-selected in yellow)
5. **Edit Resume** (Optional): Use the structured editor for manual edits
6. **Tailor Resume**: Click "Tailor Resume" to generate minimal keyword insertions
7. **Review Results**: View diff comparison and download annotated PDF

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.9+), Pydantic, Uvicorn
- **AI/ML**: OpenAI GPT-4 (keyword extraction, edit planning)
- **PDF Processing**: PyMuPDF (annotation), pdfminer.six (parsing)
- **Storage**: File-based storage (no database required)

### Project Structure
```
ResumeTailor/
├── main.py                   # FastAPI application entry point
├── models.py                 # Pydantic models for API
├── models_structured.py      # Structured resume data models
├── scraping.py               # Web scraping for job postings
├── openai_service.py         # OpenAI integration
├── requirements.txt          # Python dependencies
├── env.example               # Environment variables template
│
├── routers/                  # API route handlers
│   ├── resume.py            # Resume upload, tailoring endpoints
│   └── structured_resume.py # Structured editor endpoints
│
├── services/                 # Business logic (18+ services)
│   ├── edit_plan.py         # AI-powered edit planning
│   ├── apply_plan.py        # Edit validation & application
│   ├── pdf_annotate.py      # PDF annotation with highlights
│   ├── structured_parser.py # Resume parsing engine
│   ├── keyword_placement.py # Intelligent keyword placement
│   ├── resume_loader.py     # Resume text extraction
│   ├── storage.py           # File storage management
│   └── ...                  # Additional services
│
├── nextjs-client/            # Frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Main application page
│   │   │   ├── components/         # React components
│   │   │   │   └── PreviewPanel.tsx
│   │   │   ├── structured-editor/  # Structured editor
│   │   │   │   ├── page.tsx
│   │   │   │   ├── components/     # Editor components
│   │   │   │   └── hooks/          # React hooks
│   │   │   └── api/                # API proxy routes
│   │   └── next.config.ts          # Next.js configuration
│   └── package.json
│
├── uploads/                  # Uploaded PDF files (created on first upload)
├── structured_resumes/       # Parsed resume JSON files
└── docs/                     # Additional documentation
    ├── PLAN_AND_ANNOTATE_README.md
    ├── STRUCTURED_EDITOR_README.md
    └── PREVIEW_FEATURE_README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here  # Required for AI features
```

### File Storage
- **Uploaded PDFs**: `./uploads/{resume_id}.pdf`
- **Structured Data**: `./structured_resumes/{resume_id}.json`
- **No database required** - all data is stored as files

### Storage Limitations
This application uses file-based storage, which is suitable for:
- Personal use
- Development and testing
- Small-scale deployments

For production use with multiple users, consider migrating to a database (PostgreSQL, SQLite, etc.).

## 📚 API Documentation

Interactive API documentation is available at http://localhost:8000/docs when the backend is running.

### Key Endpoints

#### Resume Management
- `POST /upload_resume` - Upload PDF resume
- `GET /resume/{id}/text` - Get resume text
- `GET /resume/{id}/pdf` - Download original PDF
- `GET /resume/{id}/annotated.pdf` - Download annotated PDF

#### Keyword Extraction
- `POST /keywords_url` - Extract keywords from job URL
- `POST /keywords_text` - Extract keywords from job text

#### Resume Tailoring (Plan-and-Annotate)
- `POST /resume/edit-plan` - Generate minimal edit plan
- `POST /resume/apply-plan` - Apply edits to resume
- `POST /resume/{id}/annotate` - Create annotated PDF

#### Structured Editor
- `POST /structured-resume/parse` - Parse resume into structured format
- `GET /structured-resume/{id}` - Get structured resume data
- `PUT /structured-resume/{id}/section` - Update a section
- `PUT /structured-resume/{id}/bullet` - Update a bullet point
- `POST /structured-resume/{id}/export` - Export to PDF/HTML

## 🎯 Features in Detail

### Plan-and-Annotate Workflow
The plan-and-annotate workflow preserves your original resume structure while making minimal, targeted keyword insertions:

- **Edit Plan Generation**: AI analyzes your resume and proposes minimal insertions
- **Three Strategies**: Modifier (add word before), Parenthetical (add in parens), Tail (add after)
- **Strict Validation**: Maximum 2 words or 25 characters per line
- **PDF Annotation**: Highlights and sticky notes show exactly what changed

See [PLAN_AND_ANNOTATE_README.md](PLAN_AND_ANNOTATE_README.md) for detailed documentation.

### Structured Resume Editor
Edit your resume with a modern, structured interface:

- **Section-based Editing**: Work, Education, Skills, etc.
- **Live Preview**: See changes in real-time
- **Autosave**: Changes saved automatically
- **Link Management**: Validate and manage URLs
- **Character Limits**: Built-in validation for optimal bullet length

See [STRUCTURED_EDITOR_README.md](STRUCTURED_EDITOR_README.md) for detailed documentation.

### Preview Feature
Review your tailored resume in three different modes:

- **Clean Mode**: Formatted view of the updated resume
- **Diff Mode**: Side-by-side comparison of original vs. updated
- **Keywords Mode**: Highlighted keywords in context

See [PREVIEW_FEATURE_README.md](PREVIEW_FEATURE_README.md) for detailed documentation.

## 🐛 Troubleshooting

### Backend Won't Start

**Issue**: `python: command not found` or `python main.py` fails
- **Solution**: Use `python3 main.py` instead
- Check Python version: `python3 --version` (need 3.9+)
- Install dependencies: `pip install -r requirements.txt`

**Issue**: `OPENAI_API_KEY not found`
- **Solution**: Create `.env` file with your OpenAI API key
- Copy template: `cp env.example .env`
- Edit `.env` and add your key

**Issue**: `Port 8000 already in use`
- **Solution**: Kill existing process on port 8000
- Find process: `lsof -i :8000`
- Kill it: `kill -9 <PID>`

### Frontend Won't Start

**Issue**: `npm: command not found`
- **Solution**: Install Node.js from nodejs.org (version 16+)

**Issue**: `next: command not found`
- **Solution**: Run `npm install` in the `nextjs-client/` directory

**Issue**: `Port 3000 already in use`
- **Solution**: Stop other processes using port 3000 or change the port
- Next.js will automatically use port 3001 if 3000 is busy

### Can't Connect Frontend to Backend

**Issue**: API calls from frontend fail
- **Solution**: Ensure both servers are running
  - Backend on http://localhost:8000
  - Frontend on http://localhost:3000
- Check `next.config.ts` has the proxy configuration
- Restart the frontend after backend is running

**Issue**: CORS errors in browser console
- **Solution**: Backend is configured for `http://localhost:3000`
- If using a different port, update CORS settings in `main.py`

### Resume Upload Issues

**Issue**: Upload fails with "File not a PDF"
- **Solution**: Only PDF files are supported (max 10MB)

**Issue**: Parsing fails or returns empty sections
- **Solution**: Resume format may not be recognized
- Try using the structured editor for manual input

### Keyword Extraction Issues

**Issue**: No keywords extracted
- **Solution**: Check OpenAI API key and quota
- Verify job URL is accessible
- Try pasting job description text instead

**Issue**: Web scraping fails for job URL
- **Solution**: Some job sites block scraping
- Use "Paste JD text instead" option

## 🧪 Testing

Run the backend test suite:
```bash
python test_api.py
```

Run resume-specific tests:
```bash
python test_resume_api.py
```

## 📊 Data Storage

The application uses a simple file-based storage system:

### Storage Locations
- **Uploaded PDFs**: `./uploads/{resume_id}.pdf`
- **Structured Resumes**: `./structured_resumes/{resume_id}.json`
- **Annotated PDFs**: `./uploads/{resume_id}_annotated.pdf`

### Data Persistence
- All data persists between application restarts
- No database setup required
- Resume IDs are UUID v4 strings

### Backup Recommendations
For important resumes, regularly backup:
- `uploads/` directory (original PDFs)
- `structured_resumes/` directory (parsed data)

## 🔐 Security & Privacy

- **API Keys**: Never commit `.env` file to version control
- **Local Storage**: All resume data stays on your machine
- **OpenAI Usage**: Resume text is sent to OpenAI API for processing
- **No Cloud Storage**: No third-party storage services used

## 📝 License

This project is part of a resume tailoring system. Use responsibly and in accordance with OpenAI's terms of service.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the detailed documentation in the `docs/` folder
3. Check the API documentation at http://localhost:8000/docs
4. Review logs in the terminal for error details

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Database integration for multi-user support
- [ ] User authentication and authorization
- [ ] Resume version history and rollback
- [ ] Multiple resume templates
- [ ] Batch processing for multiple job applications
- [ ] Advanced analytics and insights
- [ ] Export to more formats (DOCX, LaTeX, etc.)
- [ ] Integration with job boards and ATS systems

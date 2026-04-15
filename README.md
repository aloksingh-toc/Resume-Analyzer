# 🤖 AI-Powered Resume Analyzer

A full-stack AI application that analyzes resumes, generates a quality **score out of 100**, and provides **section-wise actionable feedback** — built with **Java 21 + Spring Boot 3.2** (backend) and **React.js + Vite** (frontend), powered by **Groq AI (LLaMA 3.1)** and **Oracle 23ai** database.

---

## 📸 Features

- 📄 **PDF Resume Upload** — drag & drop or click to upload
- 🧠 **AI Analysis** — powered by Groq's LLaMA 3.1 model (free, fast)
- 🎯 **Score out of 100** — with visual circular progress indicator
- 📊 **Section Scores** — Summary, Skills, Experience, Formatting, Professionalism
- 💬 **Detailed Feedback** — tab-wise feedback for each resume section
- 📜 **History** — view all past analyses with scores
- 🗄️ **Persistent Storage** — all analyses saved to Oracle 23ai database

---

## 🏗️ Architecture

```
resume-analyzer/
├── backend/                          # Spring Boot REST API (Java 21)
│   ├── pom.xml
│   └── src/main/java/com/resumeanalyzer/
│       ├── ResumeAnalyzerApplication.java
│       ├── controller/
│       │   └── ResumeController.java      # REST endpoints
│       ├── service/
│       │   ├── ResumeService.java         # Business logic + PDF extraction
│       │   └── AIService.java             # Groq AI API integration
│       ├── repository/
│       │   └── ResumeRepository.java      # Spring Data JPA
│       ├── model/
│       │   └── ResumeAnalysis.java        # Oracle Entity
│       └── dto/
│           ├── AnalysisResponse.java
│           └── AIFeedback.java
│
└── frontend/                         # React.js + Vite
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── services/api.js
        └── components/
            ├── UploadSection.jsx      # Drag & drop PDF uploader
            ├── ScoreDisplay.jsx       # Circular score + section bars
            ├── FeedbackDisplay.jsx    # Tabbed section feedback
            └── HistoryList.jsx        # Past analyses list
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 21 |
| Backend | Spring Boot 3.2 |
| AI Model | Groq — LLaMA 3.1 8B Instant (FREE) |
| PDF Parsing | Apache PDFBox 3.0 |
| Database | Oracle 23ai Free |
| ORM | Spring Data JPA + Hibernate |
| Frontend | React 18 + Vite |
| HTTP Client | Axios |
| Build Tool | Maven 3.9+ |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java | 21+ | [adoptium.net](https://adoptium.net) |
| Maven | 3.9+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Oracle DB | 23ai Free | [oracle.com/database/free](https://www.oracle.com/database/free/) |
| Groq API Key | Free | [console.groq.com](https://console.groq.com) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/aloksingh-toc/resume-analyzer.git
cd resume-analyzer
```

---

### Step 2 — Set Up Oracle Database

Open SQL*Plus or Oracle SQL Developer and run:

```sql
ALTER SESSION SET CONTAINER = FREEPDB1;

CREATE TABLE resume_analysis (
    id                   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    filename             VARCHAR2(500) NOT NULL,
    score                NUMBER NOT NULL,
    summary_score        NUMBER,
    skills_score         NUMBER,
    experience_score     NUMBER,
    formatting_score     NUMBER,
    professionalism_score NUMBER,
    summary_feedback     CLOB,
    skills_feedback      CLOB,
    experience_feedback  CLOB,
    formatting_feedback  CLOB,
    overall_feedback     CLOB,
    submitted_at         TIMESTAMP NOT NULL
);
```

---

### Step 3 — Configure the Backend

Copy the example config file:
```bash
cd backend/src/main/resources
cp application.properties.example application.properties
```

Edit `application.properties` and fill in your values:

```properties
# Oracle DB
spring.datasource.url=jdbc:oracle:thin:@localhost:1522/freepdb1
spring.datasource.username=SYSTEM
spring.datasource.password=YOUR_ORACLE_PASSWORD

# Groq API Key (get free at console.groq.com)
groq.api.key=gsk_YOUR_GROQ_API_KEY_HERE
```

---

### Step 4 — Run the Backend

```bash
cd backend
mvn spring-boot:run
```

✅ Ready when you see:
```
Started ResumeAnalyzerApplication in X seconds
```
Backend runs at: `http://localhost:8080`

---

### Step 5 — Run the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ Ready when you see:
```
➜  Local:   http://localhost:5173/
```

---

### Step 6 — Open the App

Open your browser and go to:
```
http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/analyze` | Upload PDF and get AI analysis |
| `GET` | `/api/resume/history` | Get all past analyses |
| `GET` | `/api/resume/{id}` | Get specific analysis by ID |

### Example Request

```bash
curl -X POST http://localhost:8080/api/resume/analyze \
  -F "file=@/path/to/resume.pdf"
```

### Example Response

```json
{
  "id": 1,
  "filename": "john_doe_resume.pdf",
  "score": 74,
  "summaryScore": 14,
  "skillsScore": 16,
  "experienceScore": 22,
  "formattingScore": 12,
  "professionalismScore": 10,
  "summaryFeedback": "Your summary is clear but lacks specific achievements...",
  "skillsFeedback": "Good range of technical skills. Consider grouping by category...",
  "experienceFeedback": "Work experience is well-described. Add quantified metrics...",
  "formattingFeedback": "Clean layout. Improve consistency in font sizes...",
  "overallFeedback": "Top 3 improvements: 1) Add metrics to experience bullets...",
  "submittedAt": "2026-04-15T14:30:00"
}
```

---

## 📊 Scoring Rubric

| Section | Max Points | What AI Evaluates |
|---------|-----------|-------------------|
| Summary / Objective | 20 | Clarity, relevance, impact |
| Skills | 20 | Relevance, organization, currency |
| Work Experience | 30 | Action verbs, metrics, impact |
| Formatting | 15 | Layout, ATS-friendliness, readability |
| Professionalism | 15 | Tone, grammar, consistency |
| **Total** | **100** | |

### Score Interpretation

| Score | Rating |
|-------|--------|
| 83 – 100 | 🟢 Excellent — ready for top companies |
| 71 – 82 | 🔵 Good — strong with minor improvements needed |
| 56 – 70 | 🟡 Average — decent but missing key elements |
| 41 – 55 | 🟠 Below Average — needs significant work |
| 0 – 40 | 🔴 Needs Work — major revision required |

---

## 🔐 Security Notes

- `application.properties` is in `.gitignore` — your secrets are never committed
- Use `application.properties.example` as a template
- Never share your Groq API key publicly
- Consider using environment variables in production

---

## 🛠️ Common Issues

| Error | Fix |
|-------|-----|
| `ORA-04043: table does not exist` | Run the CREATE TABLE SQL in Step 2 |
| `Groq API 400` | Model name changed — update model in `AIService.java` |
| `Port 8080 in use` | Stop other apps using 8080 or change `server.port` |
| `mvn not recognized` | Add Maven `bin` folder to system PATH |
| PDF text extraction fails | Ensure PDF has selectable text (not scanned image) |

---

## 👤 Author

**Alok Kumar Singh**
- GitHub: [@aloksingh-toc](https://github.com/aloksingh-toc)
- Email: singhalokkumar07@gmail.com

---

## 📄 License

MIT License — free to use, modify, and distribute.

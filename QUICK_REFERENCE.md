# Quick Reference Guide - Job Search & Resume Matching

## What Changed?

### Before (Old Way)
```
User Search
    ↓ (API Call #1)
Get Jobs from RapidAPI
    ↓ (API Call #2)
If skills exist → Match jobs with AI
    ↓
Display jobs (sometimes with matches)
```

### After (New Way - INTEGRATED)
```
User Search + Skills Available
    ↓ (Single API Call)
Search Jobs + Match with AI (in one API call)
    ↓
Display jobs WITH matches immediately
```

## Key Features Implemented

✅ **Automatic Job Matching on Search**
- When user searches for jobs and has previously analyzed a resume
- Jobs are automatically matched with their skills
- Match percentages appear immediately

✅ **Auto-Recommended Jobs on Resume Analysis**
- When user analyzes a resume
- System automatically searches for recommended jobs
- Jobs are shown with match percentages based on detected skills

✅ **Visual Match Indicators**
- Green badge (≥75%): Excellent fit
- Amber badge (50-75%): Good fit
- Red badge (<50%): May need skill development
- Matched skills: Green badges
- Missing skills: Red badges labeled "Skills to build"

## API Endpoints

### New Endpoint (Recommended)
```
POST /jobs/search-with-match
{
  "query": "Your search query",
  "resumeSkills": ["Skill1", "Skill2", ...]
}
```
**Response:** Jobs with matching data included

### Original Endpoints (Still Available)
```
GET /jobs/search?query=...
POST /jobs/match
```

## How It Works in Frontend

### Job Search Page
1. User enters search query
2. System checks if skills exist in localStorage
3. **If skills exist:**
   - Calls `/jobs/search-with-match` with query + skills
   - Returns jobs with match data
   - Shows "85% match", matched skills, missing skills
4. **If no skills:**
   - Calls `/jobs/search` 
   - Returns jobs without match data
   - Shows message: "Analyze a resume first..."

### Resume Analysis Page
1. User uploads and analyzes resume
2. System extracts skills --> stored in localStorage
3. **Automatically calls `/jobs/search-with-match`:**
   - Searches for jobs related to detected skills
   - Gets matching percentages
   - Shows "Recommended Jobs for You" with matches
4. All results display with:
   - Match percentage
   - Matched skills
   - Skills to develop

## Skills Display

### When Match Data Exists
```
Job Title
Company Name
📍 Location | 🕒 Employment Type | 🗓 Posted Date

Job Description

┌─────────────────────────────────┐
│ 85% match (green badge)          │
│ Matched skills:                  │
│ [Java] [Spring Boot] [REST API]  │
│                                  │
│ Skills to build:                 │
│ [Docker] [Kubernetes]            │
│                                  │
│ [Apply Now] Button               │
└─────────────────────────────────┘
```

### When No Match Data
```
Job Title
Company Name
📍 Location | 🕒 Employment Type | 🗓 Posted Date

Job Description

[Apply Now] Button
```

## Data Flow

### JobWithMatchDto (New Data Structure)
```javascript
{
  // Original Job Data
  jobId: "123",
  title: "Senior Developer",
  company: "TechCorp",
  location: "Bengaluru",
  employmentType: "Full-time",
  applyLink: "https://...",
  companyLogo: "https://...",
  description: "We are hiring...",
  postedAt: "2 days ago",
  
  // NEW: Match Data
  matchPercentage: 85,
  matchedSkills: ["Java", "Spring Boot"],
  missingSkills: ["Docker", "Kubernetes"],
  summary: "Strong match for your profile"
}
```

## State Management

### JobSearch.jsx
```javascript
// Before
jobs: []
matches: []  // ← Separate state

// After
jobs: []  // ← Includes match data directly
// matches state removed (no longer needed)
```

### AnalyzeResults.jsx
```javascript
// Before
jobs: []
matches: []  // ← Separate state

// After
jobs: []  // ← Includes match data directly
// matches state removed
```

## Error Handling

✅ **If Skills Not Available:**
- Falls back to regular job search
- Shows jobs without match percentages

✅ **If Matching Service Fails:**
- Still displays jobs
- Match data is empty/null
- User can still see job details

✅ **If API Search Fails:**
- Shows error message
- Allows user to retry

## LocalStorage Keys

- `lastResumeSkills`: Stores skills from last analyzed resume
  - Format: `["Java", "Spring Boot", "React", ...]`
  - Used by: Job Search & Resume Analysis pages
  - Cleared when: User logs out

## Browser Compatibility

✅ Works in all modern browsers
- Chrome/Edge
- Firefox
- Safari
- Uses localStorage (supported in all modern browsers)

## Performance Improvements

| Metric | Before | After |
|--------|--------|-------|
| API Calls | 2 | 1 |
| Response Time | Slower (sequential) | Faster (single call) |
| User Experience | More waiting | Immediate results |
| Data Consistency | Potential mismatch | Always consistent |

## Next Steps for Users

1. **Upload & Analyze Resume** → Skills are saved
2. **Go to Job Search** → Search for jobs
3. **See results with matching** → Jobs show % match & skills
4. **Or go to Analyze Results** → Auto-recommended jobs with matches

## Troubleshooting

**Q: Why am I not seeing match percentages?**
- A: You need to analyze a resume first. Skills are extracted and stored.

**Q: Why did I lose my match percentages after analyzing another resume?**
- A: The new resume's skills replace the old ones in localStorage.

**Q: Can I use this without analyzing a resume?**
- A: Yes! Job search still works, but without match percentages.

**Q: How long are my skills stored?**
- A: Until you logout or clear your browser's localStorage.


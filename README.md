# Nursing Chat-Based Simulator

A web-based educational tool for nursing students to practice patient interaction scenarios through realistic chat simulations.

## Features

### For Instructors
- **PIN-Based Security**: Simple 4-digit PIN access to instructor panel
- **Scenario Creation**: Create custom nursing scenarios with hospital settings, patient profiles, and interaction sequences
- **Interaction Management**: Define system messages, patient responses, and expected nurse responses
- **Scenario Management**: Edit and delete existing scenarios
- **Assessment Setup**: Set expected keywords and correct responses for automatic scoring
- **PIN Management**: Change your 4-digit access PIN from within the panel

### For Students/Nurses
- **Scenario Selection**: Browse and select from available nursing scenarios
- **Interactive Chat**: Engage in realistic patient-nurse conversations
- **Real-time Feedback**: Receive immediate scoring based on response quality
- **Performance Review**: View detailed results showing correct answers and areas for improvement

### Technical Features
- **PIN-Based Authentication**: Simple 4-digit PIN security system
- **Local Storage System**: All data stored locally in the browser
- **Anonymous Usage**: No personal information required or tracked
- **Default Content**: Comes with pre-built scenarios for immediate use
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capable**: Works without internet connection

## Setup

### Getting Started
- No configuration needed
- Works immediately out of the box

## Usage

### Getting Started
1. Open `index.html` in a web browser
2. Default scenarios are automatically loaded
3. Students can immediately start practicing
4. Instructors must log in to access the instructor panel

### For Instructors
1. Click "Instructor Panel" to access the login page
2. Enter the default PIN: **1234**
3. Change the default PIN immediately after first login using "Change PIN"
4. Use "Create Scenario" tab to build new scenarios:
   - Select hospital setting (Emergency, ICU, Medical Ward, etc.)
   - Write scenario description and patient profile
   - Add interactions in sequence (System messages, Patient responses, Expected nurse responses)
5. Use "Manage Scenarios" tab to edit or delete existing scenarios
6. Use "Change PIN" to update your 4-digit access PIN
7. Click "Logout" when finished

### For Students
1. **Enter Your Name**: On the main page, enter your full name in the text field
2. **Select a Scenario**: Choose from the available scenarios
3. **Read the Scenario**: Review the scenario description and patient information carefully
4. **Engage in Chat**: Respond to patient messages as a professional nurse
5. **Receive Feedback**: Get immediate scoring based on your responses
6. **Review Results**: See detailed feedback showing mistakes and correct answers

## Scenario Structure

Each scenario contains:
- **Hospital Setting**: The clinical environment (Emergency, ICU, etc.)
- **Description**: Overview of the clinical situation
- **Patient Profile**: Demographics, history, and presenting complaints
- **Interactions**: Sequence of system messages, patient dialogue, and expected nurse responses

## Scoring System

- Responses are evaluated based on keywords and clinical appropriateness
- Students receive a percentage score based on correct responses
- Detailed feedback shows expected vs. actual responses
- Results are saved for progress tracking

## File Structure

```
├── index.html              # Main application page (student interface)
├── login.html              # Instructor login page
├── instructor.html         # Instructor panel (protected)
├── styles/
│   ├── main.css            # Main application styles
│   └── login.css           # Login page specific styles
├── js/
│   ├── main.js             # Main application logic and navigation
│   ├── data.js             # Default scenarios and data management
│   ├── storage.js          # Local storage management
│   ├── auth.js             # Authentication system
│   ├── instructor-page.js  # Instructor panel functionality
│   └── chat.js             # Chat simulation logic
└── README.md               # This file
```

## Default Scenarios

The application includes three default scenarios:
1. **Chest Pain Assessment** (Emergency Department)
2. **Post-Operative Care** (Surgical Ward)
3. **Pediatric Fever Management** (Pediatric Unit)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Features

### PIN-Based Authentication
- **Simple 4-Digit PIN**: Easy to remember and use
- **Auto-Submit**: Automatically submits when 4 digits are entered
- **Session Management**: Auto-logout after inactivity
- **Remember Me Option**: Extended session duration (24 hours)

### Default PIN
- **Default PIN**: `1234`
- **⚠️ Important**: Change this PIN immediately after first login

### Security Best Practices
- PIN is stored locally in the browser
- Sessions expire automatically for security
- No sensitive data is transmitted over the network
- Logout functionality clears all session data
- PIN must be exactly 4 digits (numbers only)

## Data Persistence

All data is stored in the browser's local storage:
- Scenarios persist across browser sessions
- Student results are saved locally
- No internet connection required after initial load

## Customization

Instructors can easily customize:
- Hospital settings (modify the dropdown options in HTML)
- Scoring criteria (adjust keyword matching in `chat.js`)
- Default scenarios (edit `defaultScenarios` array in `data.js`)
- Visual styling (modify `main.css`)

## Future Enhancements

Potential improvements could include:
- Multi-media support (images, audio)
- More sophisticated scoring algorithms
- Export/import functionality for scenarios
- Progress tracking across multiple sessions
- Integration with Learning Management Systems




Your Nursing Chat-Based Simulator is Ready! 🏥
I've created a comprehensive web-based nursing education simulator with all the features you requested:

Key Features Implemented:

For Instructors:
✅ Scenario Creation Page - Complete form with hospital settings, scenario description, and patient profile
✅ Multiple Interaction Types - System messages, patient responses, and nurse response expectations
✅ Scenario Management - Edit and delete existing scenarios
✅ Assessment Setup - Define expected keywords and correct responses for automatic scoring

For Students/Nurses:
✅ Landing Page - Browse and select from available scenarios
✅ Interactive Chat Interface - Real-time patient-nurse conversation simulation
✅ Intelligent Scoring - Automatic evaluation based on instructor-defined criteria
✅ Detailed Results - Shows score, mistakes, and correct responses

Data Management:
✅ JSON Default Scenarios - Three pre-built scenarios (Chest Pain, Post-Op Care, Pediatric Fever)
✅ Local Storage Persistence - All data saves automatically and persists across browser sessions
✅ No Data Loss - Scenarios and results remain even after browser refresh

Default Scenarios Included:
Chest Pain Assessment (Emergency Department)
Post-Operative Care (Surgical Ward)
Pediatric Fever Management (Pediatric Unit)

How to Use:
As an Instructor:
Click "Instructor Panel"
Use "Create Scenario" to build new scenarios
Add multiple interactions (system messages, patient dialogue, expected nurse responses)
Manage existing scenarios with edit/delete options

As a Student:
Select a scenario from the landing page
Read the clinical scenario and patient information
Respond to patient messages as a professional nurse
Get immediate feedback and see your final score with detailed analysis

Technical Highlights:
📱 Responsive Design - Works on desktop and mobile
💾 Persistent Storage - Uses browser localStorage
🎯 Smart Scoring - Keyword-based evaluation system
🚀 No Backend Required - Runs entirely in the browser

The application is now ready to use! Instructors can immediately start creating scenarios, and students can practice with the three default scenarios that are already loaded.
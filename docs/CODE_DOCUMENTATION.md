# Code Documentation - Nursing Chat-Based Simulator

## Project Overview

The Nursing Chat-Based Simulator is a web-based educational tool designed for nursing education. It allows instructors to create interactive scenarios and students to practice patient-nurse conversations through a chat interface with automatic scoring.

## Architecture

The application follows a modular architecture with separate concerns:
- **Frontend**: HTML pages with CSS styling
- **Authentication**: PIN-based security system
- **Data Management**: Local storage with JSON data
- **Simulation Engine**: Interactive chat system with scoring

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser Local Storage
- **Security**: Session-based authentication with PIN
- **Design**: Responsive CSS with Flexbox/Grid
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## File Structure and Purpose

```
nursing-chat-simulator/
├── index.html              # Main student interface
├── login.html              # Instructor authentication page
├── instructor.html         # Protected instructor panel
├── styles/
│   ├── main.css            # Global application styles
│   └── login.css           # Login page specific styles
├── js/
│   ├── main.js             # Application navigation and core functionality
│   ├── data.js             # Default scenarios and data structures
│   ├── storage.js          # Local storage management
│   ├── auth.js             # Authentication and security system
│   ├── instructor-page.js  # Instructor panel functionality
│   └── chat.js             # Chat simulation engine
├── README.md               # User documentation
└── docs/
    └── CODE_DOCUMENTATION.md  # This file
```

---

## Core Components

### 1. Data Layer (`js/data.js`)
Manages default scenarios and data structures.

### 2. Storage Layer (`js/storage.js`)
Handles all local storage operations for scenarios and results.

### 3. Authentication Layer (`js/auth.js`)
Provides PIN-based security for instructor access.

### 4. Presentation Layer (HTML/CSS)
User interface components and styling.

### 5. Business Logic Layer
- `js/main.js` - Navigation and core app logic
- `js/chat.js` - Simulation engine
- `js/instructor-page.js` - Instructor functionality

---

## Data Models

### Scenario Object
```javascript
{
    id: String,              // Unique identifier
    title: String,           // Scenario name
    hospitalSetting: String, // Setting type (emergency, icu, etc.)
    description: String,     // Clinical scenario description
    patientProfile: String,  // Patient demographics and history
    interactions: Array,     // Sequence of interactions
    createdBy: String,       // 'system' or 'instructor'
    dateCreated: String     // ISO date string
}
```

### Interaction Object
```javascript
{
    type: String,           // 'system', 'patient', or 'nurse'
    message: String,        // Content of the message
    isCorrect: Boolean,     // For nurse responses only
    expectedResponse: String, // Keywords for scoring
    correctResponse: String  // Example correct answer
}
```

### Session Object
```javascript
{
    createdAt: Number,      // Timestamp
    expiresAt: Number,      // Expiration timestamp
    rememberMe: Boolean     // Extended session flag
}
```

---

## Security Model

### PIN-Based Authentication
- **Default PIN**: `1234`
- **Storage**: Local storage (encrypted in production)
- **Session Duration**: 2 hours (24 hours with "Remember Me")
- **Validation**: Client-side with automatic expiration

### Session Management
- **Creation**: On successful PIN validation
- **Validation**: Before accessing protected resources
- **Expiration**: Automatic cleanup of expired sessions
- **Logout**: Manual session termination

---

## Key Algorithms

### Scoring Algorithm
```javascript
function evaluateNurseResponse(studentResponse, expectedKeywords) {
    const keywords = expectedKeywords.toLowerCase().split(',').map(k => k.trim());
    const studentLower = studentResponse.toLowerCase();
    return keywords.some(keyword => studentLower.includes(keyword));
}
```

### Session Validation
```javascript
function isAuthenticated() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    const now = new Date().getTime();
    return session && now < session.expiresAt;
}
```

---

## API Reference

### Data Management Functions

#### `getScenarios()`
- **Purpose**: Retrieve all scenarios from local storage
- **Returns**: `Array<Scenario>` - List of all scenarios
- **Side Effects**: Initializes default scenarios if none exist

#### `addScenario(scenario)`
- **Purpose**: Add new scenario to storage
- **Parameters**: `scenario` (Object) - Scenario object without ID
- **Returns**: `String` - Generated scenario ID
- **Side Effects**: Saves to localStorage, adds timestamp and ID

#### `updateScenario(scenarioId, updatedScenario)`
- **Purpose**: Update existing scenario
- **Parameters**: 
  - `scenarioId` (String) - Scenario identifier
  - `updatedScenario` (Object) - Updated scenario data
- **Returns**: `Boolean` - Success status

#### `deleteScenario(scenarioId)`
- **Purpose**: Remove scenario from storage
- **Parameters**: `scenarioId` (String) - Scenario identifier
- **Returns**: `Boolean` - Success status

### Authentication Functions

#### `validatePin(pin)`
- **Purpose**: Verify PIN against stored value
- **Parameters**: `pin` (String) - 4-digit PIN
- **Returns**: `Boolean` - Validation result

#### `createSession(rememberMe)`
- **Purpose**: Create authenticated session
- **Parameters**: `rememberMe` (Boolean) - Extended session flag
- **Side Effects**: Stores session data in localStorage

#### `isAuthenticated()`
- **Purpose**: Check current authentication status
- **Returns**: `Boolean` - Authentication status
- **Side Effects**: Cleans up expired sessions

### Chat Simulation Functions

#### `startSimulation(scenarioId)`
- **Purpose**: Initialize chat simulation
- **Parameters**: `scenarioId` (String) - Scenario identifier
- **Side Effects**: Sets up chat interface, begins interaction sequence

#### `processNextInteraction()`
- **Purpose**: Advance to next interaction in sequence
- **Side Effects**: Displays messages, enables/disables input

#### `evaluateNurseResponse(response, keywords)`
- **Purpose**: Score student nurse response
- **Parameters**:
  - `response` (String) - Student input
  - `keywords` (String) - Expected keywords (comma-separated)
- **Returns**: `Boolean` - Correctness assessment

---

## Event Handling

### Form Submissions
- **Login Form**: PIN validation and session creation
- **Scenario Form**: Scenario creation/editing
- **PIN Change Form**: Security credential updates

### User Interactions
- **Navigation**: Page switching and routing
- **Chat Input**: Real-time message processing
- **Modal Management**: Popup form handling

### Input Validation
- **PIN Format**: 4-digit numeric validation
- **Form Data**: Required field validation
- **Session State**: Authentication checks

---

## Error Handling

### Authentication Errors
- Invalid PIN: Clear error message, field focus
- Session Expiration: Automatic redirect to login
- Access Denied: Redirect to authentication

### Data Errors
- Storage Failures: Graceful degradation
- Missing Scenarios: Default content loading
- Validation Errors: User-friendly feedback

### Network Errors
- N/A (No network dependencies in current implementation)

---

## Performance Considerations

### Local Storage Optimization
- **Data Compression**: JSON serialization
- **Selective Loading**: Load data as needed
- **Cleanup**: Remove expired sessions automatically

### Memory Management
- **Event Listeners**: Proper cleanup on navigation
- **DOM Manipulation**: Efficient element updates
- **State Management**: Minimal global variables

### Browser Compatibility
- **Feature Detection**: Graceful degradation
- **Polyfills**: Not currently implemented
- **Responsive Design**: Mobile-first approach

---

## Deployment Notes

### Prerequisites
- Modern web browser with JavaScript enabled
- Local storage support
- No server requirements

### Installation
1. Extract files to web-accessible directory
2. Open `index.html` in web browser
3. Default scenarios load automatically
4. Instructor access via `login.html`

### Configuration
- **Default PIN**: Change in `js/auth.js`
- **Session Duration**: Modify in `js/auth.js`
- **Default Scenarios**: Edit `js/data.js`

---

## Testing Strategy

### Manual Testing
- **Functional Testing**: All user workflows
- **Security Testing**: Authentication and authorization
- **Usability Testing**: Student and instructor interfaces

### Browser Testing
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Responsive**: Various screen sizes

### Data Testing
- **Scenario Creation**: All field combinations
- **Storage Persistence**: Browser refresh scenarios
- **Edge Cases**: Empty data, corrupted storage

---

## Future Enhancements

### Planned Features
- **Export/Import**: Scenario sharing capabilities
- **Advanced Scoring**: More sophisticated algorithms
- **Media Support**: Images and audio in scenarios
- **Analytics**: Detailed performance tracking

### Technical Improvements
- **Security**: Encrypted local storage
- **Performance**: Lazy loading of scenarios
- **Accessibility**: WCAG compliance
- **Testing**: Automated test suite

---

## Maintenance

### Regular Tasks
- **Security Updates**: PIN policy enforcement
- **Data Cleanup**: Remove old sessions
- **Performance Monitoring**: Storage usage

### Troubleshooting
- **Clear Storage**: Reset to default state
- **PIN Recovery**: Manual reset procedure
- **Browser Issues**: Compatibility checks

---

## Support and Documentation

### User Support
- **README.md**: User-facing documentation
- **In-App Help**: Contextual guidance
- **Error Messages**: Clear, actionable feedback

### Developer Support
- **Code Comments**: Inline documentation
- **Function Documentation**: JSDoc-style comments
- **Architecture Diagrams**: System overview

---

*Last Updated: September 2, 2025*

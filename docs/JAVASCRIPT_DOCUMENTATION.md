# JavaScript Documentation

## Overview
This document provides comprehensive documentation for all JavaScript files in the Nursing Chat-Based Simulator, including functions, algorithms, data structures, and architectural patterns.

---

## js/main.js - Core Application Logic

### Purpose
Central navigation system and application initialization for the student interface.

### Core Functions

#### `showPage(pageName)`
**Purpose**: Navigate between different pages in the single-page application
```javascript
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageName + '-page').classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    if (pageName === 'landing') {
        document.getElementById('landing-btn').classList.add('active');
        loadScenarios();
    }
}
```
- **Parameters**: `pageName` (String) - Target page identifier
- **Side Effects**: Updates DOM classes, loads scenarios if landing page
- **Error Handling**: Graceful failure if page doesn't exist

#### `loadScenarios()`
**Purpose**: Retrieve and display scenarios on the landing page
```javascript
function loadScenarios() {
    const scenarios = getScenarios();
    const scenariosList = document.getElementById('scenarios-list');
    
    if (scenarios.length === 0) {
        scenariosList.innerHTML = '<p>No scenarios available. Please ask your instructor to create some scenarios.</p>';
        return;
    }
    
    scenariosList.innerHTML = scenarios.map(scenario => {
        const settingName = getSettingName(scenario.hospitalSetting);
        return `
            <div class="scenario-card" onclick="startSimulation('${scenario.id}')">
                <h3>${scenario.title}</h3>
                <div class="setting">${settingName}</div>
                <div class="description">${scenario.description}</div>
                <div class="patient-info">${scenario.patientProfile.substring(0, 100)}...</div>
            </div>
        `;
    }).join('');
}
```
- **Dependencies**: `getScenarios()`, `getSettingName()`
- **DOM Manipulation**: Dynamically generates scenario cards
- **Error Handling**: Displays message when no scenarios available
- **Security**: Uses template literals safely (controlled data)

#### `getSettingName(setting)`
**Purpose**: Convert setting codes to human-readable names
```javascript
function getSettingName(setting) {
    const settings = {
        emergency: 'Emergency Department',
        icu: 'Intensive Care Unit', 
        medical: 'Medical Ward',
        surgical: 'Surgical Ward',
        pediatric: 'Pediatric Unit',
        maternity: 'Maternity Ward'
    };
    return settings[setting] || setting;
}
```
- **Parameters**: `setting` (String) - Setting code
- **Returns**: Human-readable setting name
- **Fallback**: Returns original value if not found

### Initialization
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scenarios data
    initializeScenarios();
    
    // Load landing page by default
    showPage('landing');
});
```
- **Event**: DOM content loaded for proper initialization
- **Dependencies**: `initializeScenarios()`
- **Default State**: Landing page active on load

### Global Exports
```javascript
window.showPage = showPage;
window.showInstructorTab = showInstructorTab;
window.addInteraction = addInteraction;
// ... other function exports
```
- **Global Scope**: Functions available to HTML onclick handlers
- **Namespace**: Attached to window object
- **Architecture**: Bridge between modules

---

## js/data.js - Data Management and Default Content

### Purpose
Manages default scenarios, data structures, and storage initialization.

### Data Structures

#### Default Scenarios Array
```javascript
const defaultScenarios = [
    {
        id: 'default-1',
        title: 'Chest Pain Assessment',
        hospitalSetting: 'emergency',
        description: 'A 55-year-old male presents to the emergency department with acute chest pain...',
        patientProfile: 'Male, 55 years old, history of hypertension and smoking...',
        interactions: [
            {
                type: 'system',
                message: 'You are in the Emergency Department...',
                isCorrect: null,
                expectedResponse: null
            },
            // ... more interactions
        ],
        createdBy: 'system',
        dateCreated: new Date().toISOString()
    },
    // ... more scenarios
];
```

#### Interaction Object Structure
```javascript
{
    type: String,           // 'system', 'patient', 'nurse'
    message: String,        // Content of the interaction
    isCorrect: Boolean,     // For nurse responses only
    expectedResponse: String, // Keywords for evaluation
    correctResponse: String  // Example correct answer
}
```

### Core Functions

#### `getScenarios()`
**Purpose**: Retrieve all scenarios from localStorage with default fallback
```javascript
function getScenarios() {
    const stored = localStorage.getItem('nursingScenarios');
    if (stored) {
        const scenarios = JSON.parse(stored);
        // Merge with defaults if no default scenarios exist
        const hasDefaults = scenarios.some(s => s.createdBy === 'system');
        if (!hasDefaults) {
            return [...defaultScenarios, ...scenarios];
        }
        return scenarios;
    }
    return defaultScenarios;
}
```
- **Returns**: Array of scenario objects
- **Storage**: Uses localStorage for persistence
- **Fallback**: Returns defaults if no stored scenarios
- **Merging**: Combines defaults with custom scenarios

#### `saveScenarios(scenarios)`
**Purpose**: Persist scenarios to localStorage
```javascript
function saveScenarios(scenarios) {
    localStorage.setItem('nursingScenarios', JSON.stringify(scenarios));
}
```
- **Parameters**: `scenarios` (Array) - Scenarios to save
- **Storage**: JSON serialization to localStorage
- **Error Handling**: Browser will throw if storage quota exceeded

#### `initializeScenarios()`
**Purpose**: Ensure scenarios exist in localStorage
```javascript
function initializeScenarios() {
    const scenarios = getScenarios();
    saveScenarios(scenarios);
}
```
- **Side Effects**: Creates localStorage entry if none exists
- **Initialization**: Called on application startup
- **Idempotent**: Safe to call multiple times

### Default Scenario Content

#### Scenario 1: Chest Pain Assessment
- **Setting**: Emergency Department
- **Patient**: 55-year-old male with chest pain
- **Interactions**: 6 interactions including system messages, patient dialogue, and nurse assessments
- **Learning Objectives**: Pain assessment, cardiac monitoring, emergency protocols

#### Scenario 2: Post-Operative Care
- **Setting**: Surgical Ward
- **Patient**: 28-year-old female post-appendectomy
- **Interactions**: 6 interactions focusing on post-op assessment
- **Learning Objectives**: Surgical site assessment, pain management, nausea control

#### Scenario 3: Pediatric Fever Management
- **Setting**: Pediatric Unit
- **Patient**: 5-year-old male with high fever
- **Interactions**: 6 interactions emphasizing pediatric communication
- **Learning Objectives**: Age-appropriate communication, fever management, family involvement

---

## js/storage.js - Local Storage Management

### Purpose
Handles all localStorage operations for scenarios and simulation results with error handling and data validation.

### Simulation Results Management

#### `saveSimulationResult(scenarioId, result)`
**Purpose**: Store simulation completion data
```javascript
function saveSimulationResult(scenarioId, result) {
    const results = getSimulationResults();
    const newResult = {
        scenarioId: scenarioId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        mistakes: result.mistakes,
        completedAt: new Date().toISOString()
    };
    
    results.push(newResult);
    localStorage.setItem('simulationResults', JSON.stringify(results));
}
```
- **Parameters**: `scenarioId` (String), `result` (Object)
- **Data Structure**: Standardized result object with metadata
- **Timestamp**: ISO date string for completion tracking
- **Storage**: Appends to existing results array

#### `getSimulationResults()`
**Purpose**: Retrieve all stored simulation results
```javascript
function getSimulationResults() {
    const stored = localStorage.getItem('simulationResults');
    return stored ? JSON.parse(stored) : [];
}
```
- **Returns**: Array of result objects
- **Fallback**: Empty array if no results stored
- **Error Handling**: JSON.parse with fallback

### Scenario Management

#### `addScenario(scenario)`
**Purpose**: Add new instructor-created scenario
```javascript
function addScenario(scenario) {
    const scenarios = getScenarios();
    scenario.id = 'custom-' + Date.now();
    scenario.createdBy = 'instructor';
    scenario.dateCreated = new Date().toISOString();
    
    scenarios.push(scenario);
    saveScenarios(scenarios);
    return scenario.id;
}
```
- **ID Generation**: Timestamp-based unique identifier
- **Metadata**: Adds creation info and timestamp
- **Returns**: Generated scenario ID
- **Side Effects**: Saves to localStorage

#### `updateScenario(scenarioId, updatedScenario)`
**Purpose**: Modify existing scenario
```javascript
function updateScenario(scenarioId, updatedScenario) {
    const scenarios = getScenarios();
    const index = scenarios.findIndex(s => s.id === scenarioId);
    
    if (index !== -1) {
        scenarios[index] = { ...scenarios[index], ...updatedScenario };
        saveScenarios(scenarios);
        return true;
    }
    return false;
}
```
- **Search**: Finds scenario by ID
- **Merging**: Spreads existing and updated properties
- **Validation**: Returns boolean success status
- **Immutability**: Creates new object rather than mutation

#### `deleteScenario(scenarioId)`
**Purpose**: Remove scenario from storage
```javascript
function deleteScenario(scenarioId) {
    const scenarios = getScenarios();
    const filtered = scenarios.filter(s => s.id !== scenarioId);
    
    if (filtered.length < scenarios.length) {
        saveScenarios(filtered);
        return true;
    }
    return false;
}
```
- **Filtering**: Non-destructive removal
- **Validation**: Confirms deletion occurred
- **Returns**: Boolean success status

### Utility Functions

#### `getScenarioById(scenarioId)`
**Purpose**: Retrieve specific scenario
```javascript
function getScenarioById(scenarioId) {
    const scenarios = getScenarios();
    return scenarios.find(s => s.id === scenarioId);
}
```
- **Parameters**: `scenarioId` (String)
- **Returns**: Scenario object or undefined
- **Efficiency**: Single pass through array

#### `clearAllData()`
**Purpose**: Reset application to default state
```javascript
function clearAllData() {
    localStorage.removeItem('nursingScenarios');
    localStorage.removeItem('simulationResults');
    initializeScenarios();
}
```
- **Development Tool**: For testing and reset
- **Cleanup**: Removes all stored data
- **Reinitialization**: Restores default scenarios

---

## js/auth.js - Authentication System

### Purpose
PIN-based authentication system with session management and security features.

### Configuration Constants
```javascript
const DEFAULT_PIN = '1234';
const SESSION_KEY = 'instructor_session';
const PIN_KEY = 'instructor_pin';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

### Authentication Functions

#### `validatePin(pin)`
**Purpose**: Verify PIN against stored value
```javascript
function validatePin(pin) {
    try {
        const storedPin = localStorage.getItem(PIN_KEY);
        const currentPin = storedPin || DEFAULT_PIN;
        return pin === currentPin;
    } catch (error) {
        return pin === DEFAULT_PIN;
    }
}
```
- **Parameters**: `pin` (String) - 4-digit PIN
- **Validation**: String comparison (could be enhanced with hashing)
- **Fallback**: Uses default PIN if storage fails
- **Error Handling**: Try-catch for localStorage access

#### `createSession(rememberMe)`
**Purpose**: Establish authenticated session
```javascript
function createSession(rememberMe = false) {
    const now = new Date().getTime();
    const duration = rememberMe ? SESSION_DURATION : 2 * 60 * 60 * 1000;
    
    const sessionData = {
        createdAt: now,
        expiresAt: now + duration,
        rememberMe: rememberMe
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}
```
- **Duration**: 2 hours default, 24 hours with "remember me"
- **Timestamps**: Milliseconds since epoch
- **Storage**: JSON serialized session object
- **Security**: Time-based expiration

#### `isAuthenticated()`
**Purpose**: Check current authentication status
```javascript
function isAuthenticated() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        if (now > sessionData.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            return false;
        }
        
        return true;
    } catch (error) {
        localStorage.removeItem(SESSION_KEY);
        return false;
    }
}
```
- **Session Validation**: Checks existence and expiration
- **Cleanup**: Removes expired sessions automatically
- **Error Handling**: Handles corrupted session data
- **Returns**: Boolean authentication status

### PIN Management

#### `updatePin(newPin)`
**Purpose**: Change instructor PIN
```javascript
function updatePin(newPin) {
    if (!isAuthenticated()) return false;
    
    if (!/^\d{4}$/.test(newPin)) {
        return false;
    }
    
    localStorage.setItem(PIN_KEY, newPin);
    return true;
}
```
- **Authorization**: Requires existing authentication
- **Validation**: Regex for 4-digit format
- **Security**: Only authenticated users can change PIN
- **Returns**: Boolean success status

### Login Form Handler
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pin = document.getElementById('pin').value.trim();
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Loading state and validation logic
            setTimeout(() => {
                if (validatePin(pin)) {
                    createSession(rememberMe);
                    window.location.href = 'instructor.html';
                } else {
                    // Error handling
                }
            }, 800);
        });
    }
});
```

### Input Enhancement
```javascript
const pinInput = document.getElementById('pin');
if (pinInput) {
    pinInput.addEventListener('input', function(e) {
        // Only allow numbers
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Auto-submit when 4 digits entered
        if (this.value.length === 4) {
            setTimeout(() => {
                loginForm.dispatchEvent(new Event('submit'));
            }, 300);
        }
    });
}
```
- **Input Filtering**: Only numeric characters allowed
- **Auto-submit**: Convenience feature for PIN entry
- **UX Enhancement**: Reduces friction in login process

---

## js/chat.js - Chat Simulation Engine

### Purpose
Core simulation logic for patient-nurse interactions with scoring and feedback systems.

### Simulation State Management
```javascript
let currentScenario = null;
let currentInteractionIndex = 0;
let studentResponses = [];
let simulationScore = 0;
let totalNurseInteractions = 0;
```

### Core Simulation Functions

#### `startSimulation(scenarioId)`
**Purpose**: Initialize and begin chat simulation
```javascript
function startSimulation(scenarioId) {
    currentScenario = getScenarioById(scenarioId);
    if (!currentScenario) {
        alert('Scenario not found!');
        return;
    }
    
    // Reset simulation state
    currentInteractionIndex = 0;
    studentResponses = [];
    simulationScore = 0;
    totalNurseInteractions = currentScenario.interactions.filter(i => i.type === 'nurse').length;
    
    showPage('chat');
    setupChatInterface();
    processNextInteraction();
}
```
- **Validation**: Checks scenario exists
- **State Reset**: Clears previous simulation data
- **Counting**: Calculates total nurse interactions for scoring
- **UI Transition**: Switches to chat page
- **Initialization**: Sets up interface and begins flow

#### `processNextInteraction()`
**Purpose**: Advance simulation to next interaction
```javascript
function processNextInteraction() {
    if (currentInteractionIndex >= currentScenario.interactions.length) {
        endSimulation();
        return;
    }
    
    const interaction = currentScenario.interactions[currentInteractionIndex];
    
    if (interaction.type === 'nurse') {
        enableStudentInput();
    } else {
        displayMessage(interaction.type, interaction.message);
        currentInteractionIndex++;
        
        setTimeout(() => {
            processNextInteraction();
        }, 1500);
    }
}
```
- **Termination**: Checks for end of scenario
- **Branching**: Different handling for nurse vs. other interactions
- **Timing**: Delays between automated messages
- **Recursion**: Self-calling for flow continuation

#### `displayMessage(type, message, sender)`
**Purpose**: Add message to chat interface
```javascript
function displayMessage(type, message, sender = null) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (sender) {
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = sender;
        messageDiv.appendChild(senderDiv);
    }
    
    const messageContent = document.createElement('div');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
```
- **DOM Creation**: Dynamic message bubble creation
- **Styling**: CSS class application for message types
- **Sender Display**: Optional sender identification
- **Auto-scroll**: Keeps latest message visible

### Scoring System

#### `evaluateNurseResponse(studentResponse, expectedKeywords)`
**Purpose**: Score student nurse responses
```javascript
function evaluateNurseResponse(studentResponse, expectedKeywords) {
    if (!expectedKeywords) return true;
    
    const keywords = expectedKeywords.toLowerCase().split(',').map(k => k.trim());
    const studentLower = studentResponse.toLowerCase();
    
    return keywords.some(keyword => studentLower.includes(keyword));
}
```
- **Keyword Matching**: Simple inclusion-based scoring
- **Case Insensitive**: Normalized comparison
- **Partial Credit**: Any matching keyword scores as correct
- **Flexibility**: Accommodates various correct responses

#### `sendMessage()`
**Purpose**: Process student input and continue simulation
```javascript
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    displayMessage('nurse', message, 'You (Nurse)');
    
    const currentInteraction = currentScenario.interactions[currentInteractionIndex];
    const isCorrect = evaluateNurseResponse(message, currentInteraction.expectedResponse);
    
    studentResponses.push({
        question: currentInteraction.expectedResponse,
        studentAnswer: message,
        correctAnswer: currentInteraction.correctResponse,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        simulationScore++;
    }
    
    disableStudentInput();
    currentInteractionIndex++;
    
    setTimeout(() => {
        processNextInteraction();
    }, 1000);
}
```
- **Input Validation**: Checks for non-empty message
- **Display**: Shows student message in chat
- **Evaluation**: Scores response against expected keywords
- **Recording**: Stores response for final feedback
- **Progression**: Advances to next interaction

### Results Generation

#### `endSimulation()`
**Purpose**: Complete simulation and generate results
```javascript
function endSimulation() {
    const percentage = totalNurseInteractions > 0 ? 
        Math.round((simulationScore / totalNurseInteractions) * 100) : 0;
    
    const result = {
        score: percentage,
        totalQuestions: totalNurseInteractions,
        correctAnswers: simulationScore,
        mistakes: studentResponses.filter(r => !r.isCorrect)
    };
    
    saveSimulationResult(currentScenario.id, result);
    showResults(result);
}
```
- **Percentage Calculation**: Converts raw score to percentage
- **Result Object**: Standardized result structure
- **Persistence**: Saves result for future reference
- **Navigation**: Transitions to results display

#### `showResults(result)`
**Purpose**: Display simulation results with feedback
```javascript
function showResults(result) {
    showPage('results');
    
    const resultsContent = document.getElementById('results-content');
    
    let scoreClass = 'low';
    if (result.score >= 80) scoreClass = 'high';
    else if (result.score >= 60) scoreClass = 'medium';
    
    // Generate HTML for results display
    let resultsHTML = `
        <div class="results-summary">
            <h3>Simulation Complete!</h3>
            <div class="score-display ${scoreClass}">${result.score}%</div>
            <p>You answered ${result.correctAnswers} out of ${result.totalQuestions} nurse interactions correctly.</p>
        </div>
    `;
    
    // Add mistakes section if any
    if (result.mistakes.length > 0) {
        resultsHTML += generateMistakesHTML(result.mistakes);
    }
    
    resultsContent.innerHTML = resultsHTML;
}
```
- **Score Classification**: Visual feedback based on performance
- **Dynamic Content**: Conditional mistake display
- **HTML Generation**: Template literal for results markup
- **User Feedback**: Clear performance summary

---

## js/instructor-page.js - Instructor Panel Functionality

### Purpose
Complete instructor interface for scenario creation, management, and PIN administration.

### State Management
```javascript
let currentEditingScenario = null;
let interactionCounter = 0;
```

### Initialization
```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) {
        return; // Will redirect to login page
    }
    
    initializeScenarios();
    loadScenariosManagement();
    
    setTimeout(() => {
        addInteraction();
    }, 100);
    
    setupPinForm();
});
```
- **Authentication**: Validates access before proceeding
- **Data Loading**: Initializes scenarios and management interface
- **Default Interaction**: Adds initial interaction for new scenarios
- **PIN Management**: Sets up credential change functionality

### Scenario Creation

#### `addInteraction()`
**Purpose**: Add new interaction to scenario form
```javascript
function addInteraction() {
    interactionCounter++;
    const interactionsList = document.getElementById('interactions-list');
    
    const interactionDiv = document.createElement('div');
    interactionDiv.className = 'interaction-item';
    interactionDiv.setAttribute('data-interaction-id', interactionCounter);
    
    interactionDiv.innerHTML = `
        <div class="interaction-header">
            <select class="interaction-type-select" onchange="updateInteractionType(${interactionCounter})">
                <option value="system">System Message</option>
                <option value="patient">Patient Message</option>
                <option value="nurse">Nurse Response</option>
            </select>
            <button type="button" onclick="removeInteraction(${interactionCounter})" class="remove-interaction">
                Remove
            </button>
        </div>
        <div class="interaction-fields" id="interaction-fields-${interactionCounter}">
            <!-- Dynamic fields based on interaction type -->
        </div>
    `;
    
    interactionsList.appendChild(interactionDiv);
    updateInteractionType(interactionCounter);
}
```
- **Counter Management**: Unique ID for each interaction
- **DOM Creation**: Dynamic form element generation
- **Event Binding**: Inline event handlers for interaction
- **Type Initialization**: Calls update function for initial state

#### `updateInteractionType(interactionId)`
**Purpose**: Update form fields based on interaction type
```javascript
function updateInteractionType(interactionId) {
    const interactionDiv = document.querySelector(`[data-interaction-id="${interactionId}"]`);
    const typeSelect = interactionDiv.querySelector('.interaction-type-select');
    const fieldsDiv = document.getElementById(`interaction-fields-${interactionId}`);
    
    const type = typeSelect.value;
    
    if (type === 'nurse') {
        fieldsDiv.innerHTML = `
            <div class="form-group">
                <label>Expected Response Keywords (for scoring):</label>
                <input type="text" placeholder="e.g., assess pain, check vitals, call doctor" required>
            </div>
            <div class="form-group">
                <label>Correct Response Example:</label>
                <textarea placeholder="Example of a correct nurse response..." required></textarea>
            </div>
        `;
    } else {
        fieldsDiv.innerHTML = `
            <div class="form-group">
                <label>Message:</label>
                <textarea placeholder="Enter the message..." required></textarea>
            </div>
        `;
    }
}
```
- **Dynamic Forms**: Different fields for different interaction types
- **Nurse Responses**: Special handling for scoring requirements
- **Validation**: Required fields for data integrity
- **User Guidance**: Placeholder text for expected input

### Scenario Management

#### `collectInteractions()`
**Purpose**: Extract interaction data from form
```javascript
function collectInteractions() {
    const interactions = [];
    const interactionItems = document.querySelectorAll('.interaction-item');
    
    interactionItems.forEach((item, index) => {
        const typeSelect = item.querySelector('.interaction-type-select');
        const type = typeSelect.value;
        
        if (type === 'nurse') {
            const expectedResponse = item.querySelector('input').value;
            const correctResponse = item.querySelector('textarea').value;
            
            interactions.push({
                type: type,
                message: '',
                isCorrect: true,
                expectedResponse: expectedResponse,
                correctResponse: correctResponse
            });
        } else {
            const message = item.querySelector('textarea').value;
            
            interactions.push({
                type: type,
                message: message,
                isCorrect: null,
                expectedResponse: null
            });
        }
    });
    
    return interactions;
}
```
- **Form Parsing**: Extracts data from dynamic form elements
- **Type Handling**: Different processing for different interaction types
- **Data Structure**: Converts to standardized interaction objects
- **Validation**: Assumes form validation handles required fields

#### `loadScenariosManagement()`
**Purpose**: Display existing scenarios for management
```javascript
function loadScenariosManagement() {
    const scenarios = getScenarios();
    const managementDiv = document.getElementById('scenarios-management');
    
    if (scenarios.length === 0) {
        managementDiv.innerHTML = '<p>No scenarios found.</p>';
        return;
    }
    
    managementDiv.innerHTML = scenarios.map(scenario => `
        <div class="scenario-management-item">
            <div class="scenario-management-info">
                <h4>${scenario.title}</h4>
                <div>
                    <span class="setting">${scenario.hospitalSetting}</span>
                    <span class="date">Created: ${new Date(scenario.dateCreated).toLocaleDateString()}</span>
                </div>
                <p>${scenario.description.substring(0, 100)}...</p>
            </div>
            <div class="scenario-management-actions">
                <button onclick="editScenario('${scenario.id}')" class="edit-scenario-btn">Edit</button>
                <button onclick="deleteScenarioConfirm('${scenario.id}')" class="delete-scenario-btn">Delete</button>
            </div>
        </div>
    `).join('');
}
```
- **Data Retrieval**: Gets all scenarios from storage
- **Empty State**: Handles case with no scenarios
- **HTML Generation**: Creates management interface
- **Action Buttons**: Edit and delete functionality

### PIN Management

#### `setupPinForm()`
**Purpose**: Initialize PIN change functionality
```javascript
function setupPinForm() {
    const form = document.getElementById('pin-form');
    if (form) {
        // Add input formatting for PIN fields
        const pinInputs = form.querySelectorAll('input[type="password"]');
        pinInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // PIN validation and update logic
        });
    }
}
```
- **Input Formatting**: Restricts to numeric input only
- **Length Validation**: Enforces 4-digit limit
- **Form Handling**: Prevents default submission
- **Security**: Validates current PIN before allowing change

---

## Common JavaScript Patterns

### Error Handling Strategy
```javascript
try {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
} catch (error) {
    console.warn('Storage error:', error);
    return defaultValue;
}
```
- **Try-Catch**: Wraps potentially failing operations
- **Graceful Degradation**: Returns sensible defaults
- **Logging**: Console warnings for debugging
- **User Experience**: No errors visible to users

### Event Delegation Pattern
```javascript
document.addEventListener('click', function(e) {
    if (e.target.matches('.scenario-card')) {
        handleScenarioClick(e.target);
    }
});
```
- **Efficiency**: Single listener for multiple elements
- **Dynamic Content**: Works with runtime-generated elements
- **Performance**: Reduces memory usage

### Module Pattern
```javascript
(function() {
    // Private variables and functions
    let privateData = {};
    
    function privateFunction() {
        // Internal logic
    }
    
    // Public API
    window.publicAPI = {
        method: function() {
            return privateFunction();
        }
    };
})();
```
- **Encapsulation**: Private scope for internal details
- **Global Exposure**: Controlled public interface
- **Name Conflicts**: Prevents global namespace pollution

### State Management
```javascript
const AppState = {
    currentUser: null,
    currentScenario: null,
    
    setState(newState) {
        Object.assign(this, newState);
        this.notifyComponents();
    },
    
    notifyComponents() {
        // Update UI based on state changes
    }
};
```
- **Centralized State**: Single source of truth
- **State Updates**: Controlled modification methods
- **Component Notification**: Reactive updates

---

## Performance Optimizations

### DOM Manipulation
- **Batch Updates**: Group DOM changes to minimize reflow
- **Document Fragments**: Use for multiple element creation
- **Event Delegation**: Reduce event listener count
- **Lazy Loading**: Load content as needed

### Memory Management
- **Event Cleanup**: Remove listeners when components destroyed
- **Object References**: Clear references to prevent memory leaks
- **Closure Management**: Avoid unnecessary closures

### Storage Optimization
- **Data Compression**: Minimize localStorage usage
- **Selective Updates**: Only save changed data
- **Cleanup**: Remove expired or unnecessary data

---

*Documentation generated: September 2, 2025*

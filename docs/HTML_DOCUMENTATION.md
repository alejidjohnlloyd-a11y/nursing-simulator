# HTML Files Documentation

## Overview
This document provides detailed documentation for all HTML files in the Nursing Chat-Based Simulator application.

---

## index.html - Main Student Interface

### Purpose
The primary entry point for students to access and practice nursing scenarios through chat simulation.

### Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags and CSS imports -->
</head>
<body>
    <div class="container">
        <header>
            <!-- Navigation and title -->
        </header>
        
        <!-- Landing Page - Scenario Selection -->
        <div id="landing-page" class="page active">
            <!-- Scenario grid display -->
        </div>
        
        <!-- Chat Simulation Page -->
        <div id="chat-page" class="page">
            <!-- Chat interface -->
        </div>
        
        <!-- Results Page -->
        <div id="results-page" class="page">
            <!-- Score and feedback display -->
        </div>
    </div>
    
    <!-- JavaScript imports -->
</body>
</html>
```

### Key Elements

#### Header Section
- **Title**: "Nursing Chat Simulator"
- **Navigation**: 
  - "Select Scenario" button (student interface)
  - "Instructor Panel" link (redirects to login)

#### Landing Page (`#landing-page`)
- **Purpose**: Display available scenarios for selection
- **Content**: 
  - Grid of scenario cards
  - Each card shows title, setting, description, patient info
- **Interaction**: Click to start simulation

#### Chat Page (`#chat-page`)
- **Purpose**: Interactive chat simulation interface
- **Components**:
  - Scenario header with patient information
  - Chat messages container
  - Input field for student responses
  - Send button
  - End simulation button

#### Results Page (`#results-page`)
- **Purpose**: Display simulation results and feedback
- **Content**:
  - Score percentage
  - Correct/incorrect response summary
  - Detailed feedback for mistakes
  - Return to scenarios button

### JavaScript Dependencies
- `js/data.js` - Scenario data management
- `js/storage.js` - Local storage operations
- `js/chat.js` - Chat simulation logic
- `js/main.js` - Navigation and core functionality

### CSS Dependencies
- `styles/main.css` - Global application styles

---

## login.html - Instructor Authentication

### Purpose
Secure login interface for instructors to access the protected instructor panel.

### Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags and CSS imports -->
</head>
<body>
    <div class="container">
        <header>
            <!-- Login page header -->
        </header>
        
        <div class="page active">
            <div class="login-container">
                <div class="login-card">
                    <!-- PIN entry form -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- JavaScript imports -->
</body>
</html>
```

### Key Elements

#### Header Section
- **Title**: "Instructor Login"
- **Navigation**: Back to main scenarios link

#### Login Card
- **PIN Input**: 4-digit password field with validation
- **Remember Me**: Checkbox for extended session
- **Submit Button**: "Access Panel" with loading states
- **Error Display**: Invalid PIN feedback
- **Help Text**: Default PIN information

### Form Validation
- **Pattern**: `[0-9]{4}` - Exactly 4 digits
- **Max Length**: 4 characters
- **Auto-submit**: When 4 digits entered
- **Error Handling**: Clear feedback for invalid attempts

### JavaScript Dependencies
- `js/auth.js` - Authentication logic

### CSS Dependencies
- `styles/main.css` - Global styles
- `styles/login.css` - Login-specific styles

---

## instructor.html - Protected Instructor Panel

### Purpose
Comprehensive interface for instructors to create, manage, and edit nursing scenarios.

### Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags and CSS imports -->
</head>
<body>
    <div class="container">
        <header>
            <!-- Instructor panel header with logout -->
        </header>
        
        <div class="page active">
            <div class="page-content">
                <!-- Tab navigation -->
                <div class="instructor-tabs">
                    <!-- Create/Manage tabs -->
                </div>
                
                <!-- Create Scenario Tab -->
                <div id="create-scenario" class="tab-content active">
                    <!-- Scenario creation form -->
                </div>
                
                <!-- Manage Scenarios Tab -->
                <div id="manage-scenarios" class="tab-content">
                    <!-- Scenario management interface -->
                </div>
            </div>
        </div>
        
        <!-- Change PIN Modal -->
        <div id="pin-modal" class="modal">
            <!-- PIN change form -->
        </div>
    </div>
    
    <!-- JavaScript imports -->
</body>
</html>
```

### Key Elements

#### Header Section
- **Title**: "Instructor Panel"
- **Navigation**:
  - Back to scenarios link
  - Change PIN button
  - Logout button (red styling)

#### Tab Navigation
- **Create Scenario**: Form for new scenario creation
- **Manage Scenarios**: List and edit existing scenarios

#### Create Scenario Form
- **Hospital Setting**: Dropdown selection
  - Emergency Department
  - Intensive Care Unit
  - Medical Ward
  - Surgical Ward
  - Pediatric Unit
  - Maternity Ward

- **Scenario Details**:
  - Title input
  - Description textarea
  - Patient profile textarea

- **Interactions Section**:
  - Dynamic interaction list
  - Add interaction button
  - Remove interaction options
  - Interaction type selector (System/Patient/Nurse)

#### Manage Scenarios Interface
- **Scenario List**: All created scenarios
- **Actions**: Edit and delete buttons
- **Metadata**: Creation date, setting, description preview

#### PIN Change Modal
- **Current PIN**: Verification field
- **New PIN**: 4-digit input
- **Confirm PIN**: Validation field
- **Actions**: Cancel/Update buttons

### Form Interactions

#### Interaction Types
1. **System Messages**: Scene-setting information
2. **Patient Messages**: Patient dialogue
3. **Nurse Responses**: Expected student responses with:
   - Expected keywords for scoring
   - Example correct responses

### JavaScript Dependencies
- `js/data.js` - Scenario data
- `js/storage.js` - Storage management
- `js/auth.js` - Authentication checks
- `js/instructor-page.js` - Instructor functionality

### CSS Dependencies
- `styles/main.css` - Global and modal styles

---

## Common HTML Patterns

### Page Structure
All pages follow a consistent structure:
```html
<div class="container">
    <header>
        <h1>Page Title</h1>
        <nav><!-- Navigation elements --></nav>
    </header>
    
    <div class="page active">
        <div class="page-content">
            <!-- Page-specific content -->
        </div>
    </div>
</div>
```

### Form Elements
Standard form structure across all forms:
```html
<form id="form-id" class="form-class">
    <div class="form-group">
        <label for="input-id">Label Text:</label>
        <input type="text" id="input-id" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Modal Structure
Consistent modal pattern for popups:
```html
<div id="modal-id" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Modal Title</h3>
            <button onclick="hideModal()" class="close-btn">&times;</button>
        </div>
        
        <!-- Modal content -->
        
        <div class="modal-actions">
            <button class="btn btn-secondary">Cancel</button>
            <button class="btn btn-primary">Confirm</button>
        </div>
    </div>
</div>
```

### Navigation Buttons
Standard button styling and behavior:
```html
<button onclick="functionName()" class="nav-btn">Button Text</button>
<a href="page.html" class="nav-btn">Link Text</a>
```

---

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy (`h1` → `h2` → `h3`)
- Form labels associated with inputs
- Button elements for interactive actions
- Section elements for content organization

### Form Accessibility
- Required field indicators
- Label/input associations
- Error message displays
- Keyboard navigation support

### Navigation
- Skip links (could be added)
- Logical tab order
- Clear focus indicators
- Descriptive link text

---

## SEO and Metadata

### Meta Tags
All pages include:
- `charset="UTF-8"` - Character encoding
- `viewport` - Mobile responsiveness
- `title` - Descriptive page titles

### Title Structure
- Main page: "Nursing Chat Simulator"
- Login: "Instructor Login - Nursing Chat Simulator"
- Instructor: "Instructor Panel - Nursing Chat Simulator"

---

## Browser Compatibility

### HTML5 Features Used
- Semantic elements (`header`, `nav`, `section`)
- Form validation attributes
- Input types (`password`, `text`)
- Pattern validation

### Fallback Strategies
- Progressive enhancement approach
- Graceful degradation for older browsers
- No dependencies on cutting-edge features

---

*Documentation generated: September 2, 2025*

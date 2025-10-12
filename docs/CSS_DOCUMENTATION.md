# CSS Documentation

## Overview
This document provides comprehensive documentation for all CSS files and styling approaches used in the Nursing Chat-Based Simulator.

---

## styles/main.css - Global Application Styles

### Purpose
Primary stylesheet containing global styles, layout systems, and reusable components for the entire application.

### CSS Reset and Base Styles
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
- **Universal Reset**: Removes default browser margins and padding
- **Box Sizing**: Border-box for predictable element sizing
- **Consistency**: Ensures uniform appearance across browsers

### Typography
```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}
```
- **Font Stack**: Modern, readable sans-serif fonts
- **Line Height**: Optimal readability (1.6)
- **Colors**: Dark gray text on light background
- **Background**: Subtle gray (#f5f5f5) for reduced eye strain

### Layout System

#### Container
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
```
- **Max Width**: Prevents content from becoming too wide
- **Centering**: Auto margins for horizontal centering
- **Padding**: Consistent spacing from viewport edges

#### Header Component
```css
header {
    background: linear-gradient(135deg, #2c3e50, #3498db);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```
- **Gradient Background**: Professional blue gradient
- **Typography**: White text for contrast
- **Border Radius**: Rounded corners (10px)
- **Shadow**: Subtle depth effect

### Navigation System

#### Navigation Buttons
```css
.nav-btn {
    padding: 12px 24px;
    border: none;
    background: rgba(255,255,255,0.2);
    color: white;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    text-decoration: none;
    display: inline-block;
}
```
- **Padding**: Comfortable touch targets
- **Background**: Semi-transparent white overlay
- **Border Radius**: Pill-shaped buttons (25px)
- **Transitions**: Smooth hover effects (0.3s)
- **Accessibility**: Proper cursor and display properties

#### Hover States
```css
.nav-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}
```
- **Background Change**: Lighter on hover
- **Transform**: Subtle lift effect
- **Interactive Feedback**: Clear user interaction response

### Page System

#### Page Container
```css
.page {
    display: none;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
}

.page.active {
    display: block;
}
```
- **Visibility Toggle**: JavaScript-controlled page switching
- **Background**: Clean white content areas
- **Shadows**: Depth and separation from background
- **Overflow**: Hidden for clean edges

### Grid Systems

#### Scenarios Grid
```css
.scenarios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
}
```
- **CSS Grid**: Modern layout system
- **Responsive Columns**: Auto-fill with minimum 300px width
- **Gap**: Consistent 20px spacing
- **Flexibility**: Adapts to different screen sizes

#### Scenario Cards
```css
.scenario-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.scenario-card:hover {
    border-color: #3498db;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
```
- **Card Design**: Clean, bordered containers
- **Hover Effects**: Color change and lift animation
- **Shadows**: Enhanced depth on interaction
- **Transitions**: Smooth animation for all properties

### Form Components

#### Form Groups
```css
.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #2c3e50;
}
```
- **Spacing**: Consistent 25px bottom margin
- **Labels**: Block display for proper positioning
- **Typography**: Bold weight for emphasis
- **Color**: Professional dark blue-gray

#### Input Fields
```css
.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
```
- **Full Width**: 100% width for consistency
- **Padding**: Comfortable input areas
- **Border Styling**: Subtle gray borders
- **Focus States**: Blue border and glow effect
- **Accessibility**: Removed default outline, added custom focus

### Button System

#### Primary Buttons
```css
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
    transform: translateY(-2px);
}
```
- **Consistent Sizing**: Uniform padding and font size
- **Hover Effects**: Darker shade and lift animation
- **Typography**: Bold weight for prominence
- **Accessibility**: Proper cursor and focus states

#### Button Variants
```css
.btn-secondary {
    background: #95a5a6;
    color: white;
}

.btn-danger {
    background: #e74c3c;
    color: white;
}

.logout-btn {
    background: #e74c3c !important;
}
```
- **Color Coding**: Different colors for different actions
- **Semantic Meaning**: Red for destructive actions, gray for secondary
- **Override Classes**: Important declarations for specificity

### Chat Interface

#### Chat Container
```css
.chat-container {
    height: 500px;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
}
```
- **Fixed Height**: Consistent chat window size
- **Flexbox Layout**: Column direction for proper stacking
- **Scrollable Messages**: Overflow handling for long conversations
- **Background**: Light gray for message area

#### Message Bubbles
```css
.message {
    margin-bottom: 15px;
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 80%;
    position: relative;
}

.message.system {
    background: #e74c3c;
    color: white;
    margin: 0 auto;
    text-align: center;
    border-radius: 8px;
    max-width: 90%;
    font-style: italic;
}

.message.patient {
    background: #f39c12;
    color: white;
    margin-right: auto;
}

.message.nurse {
    background: #3498db;
    color: white;
    margin-left: auto;
}
```
- **Bubble Design**: Rounded rectangles for modern chat appearance
- **Color Coding**: Different colors for different speakers
- **Alignment**: Auto margins for left/right/center positioning
- **Typography**: Italic for system messages

### Modal System

#### Modal Overlay
```css
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
```
- **Full Screen**: Fixed positioning covering entire viewport
- **Overlay**: Semi-transparent black background
- **Centering**: Flexbox for perfect centering
- **Z-Index**: High value to appear above other content

#### Modal Content
```css
.modal-content {
    background: white;
    border-radius: 10px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```
- **Background**: Clean white container
- **Responsive Width**: 90% with maximum 500px
- **Height Constraint**: Maximum 80% of viewport height
- **Scrolling**: Auto overflow for long content
- **Shadow**: Strong shadow for prominence

### Responsive Design

#### Mobile Breakpoints
```css
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    header h1 {
        font-size: 2em;
    }
    
    nav {
        flex-direction: column;
        gap: 10px;
    }
    
    .scenarios-grid {
        grid-template-columns: 1fr;
    }
}
```
- **Tablet/Mobile**: 768px breakpoint
- **Reduced Padding**: Less space on smaller screens
- **Typography Scaling**: Smaller headings
- **Navigation**: Vertical stacking for mobile
- **Grid Adaptation**: Single column layout

---

## styles/login.css - Login Page Specific Styles

### Purpose
Specialized styles for the login page with focus on the PIN entry interface and security-themed design.

### Login Container
```css
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 20px;
}
```
- **Centering**: Full flexbox centering
- **Height**: 60% of viewport for proper positioning
- **Padding**: Safety margin for small screens

### Login Card
```css
.login-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    padding: 40px;
    max-width: 450px;
    width: 100%;
    text-align: center;
}
```
- **Card Design**: Elevated white container
- **Border Radius**: More rounded than standard (15px)
- **Shadow**: Stronger shadow for prominence
- **Typography**: Center-aligned content
- **Width**: Responsive with maximum constraint

### PIN Input Styling
```css
.login-form input[type="password"]#pin {
    font-size: 24px;
    letter-spacing: 12px;
    text-align: center;
    font-weight: bold;
}

input[type="password"][maxlength="4"] {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 4px;
}
```
- **Large Font**: Enhanced visibility (24px)
- **Letter Spacing**: Space between digits for clarity
- **Center Alignment**: Symmetrical appearance
- **Bold Weight**: Emphasizes security importance
- **Selector Specificity**: Targets PIN inputs specifically

### Security Indicators
```css
.security-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: #27ae60;
    font-size: 0.9em;
}

.security-indicator::before {
    content: "🔒";
    margin-right: 8px;
}
```
- **Flexbox Centering**: Proper icon and text alignment
- **Color**: Green for security confidence
- **Icon**: Lock emoji via CSS content
- **Spacing**: Margin for visual separation

### Loading States
```css
.login-btn.loading {
    background: #95a5a6;
    cursor: not-allowed;
    position: relative;
}

.login-btn.loading::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    margin: auto;
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```
- **State Management**: Visual feedback during processing
- **Color Change**: Gray background when loading
- **Cursor**: Not-allowed to prevent additional clicks
- **Spinner**: CSS-only loading animation
- **Positioning**: Absolute positioning for overlay effect

### Help Section
```css
.login-help {
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #3498db;
}

.login-help code {
    background: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    color: #e74c3c;
    font-weight: bold;
}
```
- **Information Box**: Distinct styling for help content
- **Border Accent**: Left border for visual hierarchy
- **Code Styling**: Monospace font with background highlight
- **Color Coding**: Red for important information (PIN)

---

## CSS Architecture and Methodology

### Naming Conventions
- **BEM-inspired**: Block__Element--Modifier pattern where applicable
- **Semantic Names**: Class names describe purpose, not appearance
- **Hyphen-case**: Consistent kebab-case for multi-word classes

### Selector Strategy
- **Low Specificity**: Avoid deeply nested selectors
- **Class-based**: Prefer classes over element selectors
- **State Classes**: Use classes like `.active`, `.loading` for state management

### Color Palette
```css
:root {
    --primary-blue: #3498db;
    --dark-blue: #2c3e50;
    --success-green: #27ae60;
    --warning-orange: #f39c12;
    --danger-red: #e74c3c;
    --secondary-gray: #95a5a6;
    --light-gray: #f8f9fa;
    --border-gray: #e0e0e0;
}
```
- **Consistent Colors**: Defined color scheme
- **Semantic Names**: Purpose-based color naming
- **CSS Variables**: Could be implemented for easier maintenance

### Layout Patterns
1. **Flexbox**: Primary layout system for alignment
2. **CSS Grid**: Secondary system for complex layouts
3. **Float**: Avoided in favor of modern alternatives
4. **Positioning**: Used sparingly for modals and overlays

### Animation Principles
- **Subtle Effects**: Gentle hover states and transitions
- **Performance**: Transform and opacity for smooth animations
- **Duration**: 0.3s standard for most transitions
- **Easing**: Default ease for natural feeling

### Responsive Strategy
- **Mobile First**: Could be improved with mobile-first approach
- **Breakpoint**: Single breakpoint at 768px
- **Flexible Units**: Mix of px, %, and viewport units
- **Grid Adaptation**: Responsive grid columns

---

## Performance Considerations

### CSS Optimization
- **Selector Efficiency**: Avoid complex selectors
- **Property Grouping**: Related properties grouped together
- **Vendor Prefixes**: Minimal use, modern browser focus
- **File Size**: Single CSS file for simplicity

### Browser Compatibility
- **Modern Features**: CSS Grid, Flexbox, Transitions
- **Fallbacks**: Graceful degradation for older browsers
- **Vendor Prefixes**: Not extensively used (modern browser focus)

### Loading Strategy
- **Inline Styles**: Avoided for maintainability
- **External Stylesheets**: Linked CSS files
- **Critical CSS**: Could be implemented for performance

---

*Documentation generated: September 2, 2025*

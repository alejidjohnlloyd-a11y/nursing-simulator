// Chat simulation functionality

let currentScenario = null;
let currentInteractionIndex = 0;
let studentResponses = [];
let simulationScore = 0;
let totalNurseInteractions = 0;
let timerInterval = null;
let remainingTime = 0; // in seconds
let isTimerRunning = false;

// Loading screen functions
function showLoading(message = 'Processing simulation results...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = overlay.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = message;
    }
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'none';
}

// Start chat simulation
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
    
    // Initialize timer only if duration is set
    if (currentScenario.timerDuration && currentScenario.timerDuration > 0) {
        remainingTime = currentScenario.timerDuration * 60; // Convert to seconds
        isTimerRunning = false;
    } else {
        remainingTime = 0;
        isTimerRunning = false;
    }
    
    // Show chat page
    showPage('chat');
    
    // Setup chat interface
    setupChatInterface();
    
    // Start the timer only if it's configured
    if (currentScenario.timerDuration && currentScenario.timerDuration > 0) {
        startTimer();
    } else {
        hideTimer();
    }
    
    // Start the first interaction
    processNextInteraction();
}

// Setup chat interface with scenario info
function setupChatInterface() {
    document.getElementById('chat-scenario-title').textContent = currentScenario.title;
    document.getElementById('chat-hospital-setting').innerHTML = `<strong>Setting:</strong> ${getSettingName(currentScenario.hospitalSetting)}`;
    document.getElementById('chat-patient-profile').innerHTML = `<strong>Patient:</strong> ${currentScenario.patientProfile}`;
    
    // Clear previous messages
    document.getElementById('chat-messages').innerHTML = '';
    
    // Enable/disable input
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    chatInput.disabled = true;
    sendBtn.disabled = true;
}

// Get human-readable setting name
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

// Process next interaction in sequence
function processNextInteraction() {
    if (currentInteractionIndex >= currentScenario.interactions.length) {
        // Show loading screen with completion message
        showLoading('Scenario complete! Calculating results...');
        
        // Add a brief delay before ending
        setTimeout(() => {
            endSimulation();
        }, 1000);
        return;
    }
    
    const interaction = currentScenario.interactions[currentInteractionIndex];
    
    if (interaction.type === 'nurse') {
        // Wait for student input
        enableStudentInput();
    } else {
        // Display system or patient message
        displayMessage(interaction.type, interaction.message);
        currentInteractionIndex++;
        
        // Continue to next interaction after a brief delay
        setTimeout(() => {
            processNextInteraction();
        }, 1500);
    }
}

// Display a message in the chat
function displayMessage(type, message, sender = null) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Check if it's a system message containing "Hint", "HINT", or "hint"
    if (type === 'system' && (message.includes('Hint') || message.includes('HINT') || message.includes('hint'))) {
        messageDiv.style.backgroundColor = 'green';
    }
    
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

// Enable student input
function enableStudentInput() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
    
    chatInput.placeholder = 'Type your response as a nurse...';
}

// Disable student input
function disableStudentInput() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    chatInput.disabled = true;
    sendBtn.disabled = true;
    chatInput.value = '';
}

// Send student message
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Display student's message
    displayMessage('nurse', message, 'You (Nurse)');
    
    // Evaluate the response
    const currentInteraction = currentScenario.interactions[currentInteractionIndex];
    const isCorrect = evaluateNurseResponse(message, currentInteraction.expectedResponse);
    
    // Store student response
    studentResponses.push({
        question: currentInteraction.expectedResponse,
        studentAnswer: message,
        correctAnswer: currentInteraction.correctResponse,
        rationale: currentInteraction.rationale || '',
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        simulationScore++;
    }
    
    // Disable input
    disableStudentInput();
    
    // Move to next interaction
    currentInteractionIndex++;
    
    // Continue simulation after brief delay
    setTimeout(() => {
        processNextInteraction();
    }, 1000);
}

// Evaluate nurse response
function evaluateNurseResponse(studentResponse, expectedKeywords) {
    if (!expectedKeywords) return true;
    
    const keywords = expectedKeywords.toLowerCase().split(',').map(k => k.trim());
    const studentLower = studentResponse.toLowerCase();
    
    // Check if student response contains any of the expected keywords
    return keywords.some(keyword => studentLower.includes(keyword));
}

// Handle Enter key in chat input
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !this.disabled) {
        sendMessage();
    }
});

// End simulation and show results
function endSimulation() {
    // Check if loading screen is already showing
    const overlay = document.getElementById('loading-overlay');
    const isAlreadyLoading = overlay.style.display === 'flex';
    
    // Show loading screen only if not already showing
    if (!isAlreadyLoading) {
        showLoading('Processing simulation results...');
    }
    
    // Stop the timer if it was running
    if (currentScenario.timerDuration && currentScenario.timerDuration > 0) {
        stopTimer();
    }
    
    const percentage = totalNurseInteractions > 0 ? Math.round((simulationScore / totalNurseInteractions) * 100) : 0;
    
    const result = {
        score: percentage,
        totalQuestions: totalNurseInteractions,
        correctAnswers: simulationScore,
        mistakes: studentResponses.filter(r => !r.isCorrect),
        timeRemaining: remainingTime,
        hasTimer: currentScenario.timerDuration && currentScenario.timerDuration > 0
    };
    
    // Save result to local storage
    saveSimulationResult(currentScenario.id, result);
    
    // Add a slight delay to show loading screen, then show results
    const delay = isAlreadyLoading ? 500 : 1500; // Shorter delay if already loading
    setTimeout(() => {
        showResults(result);
        hideLoading();
    }, delay);
}

// Show results page
function showResults(result) {
    showPage('results');
    
    const resultsContent = document.getElementById('results-content');
    
    let scoreClass = 'low';
    let scoreDisplay = `${result.score}%`;
    let statusMessage = 'Simulation Complete!';
    
    // Handle zero score - mark as failed
    if (result.score === 0) {
        scoreClass = 'failed';
        scoreDisplay = 'FAILED';
        statusMessage = 'Simulation Failed - Review Required';
    } else {
        if (result.score >= 80) scoreClass = 'high';
        else if (result.score >= 60) scoreClass = 'medium';
    }
    
    let resultsHTML = `
        <div class="results-summary">
            <h3>${statusMessage}</h3>
            <div class="score-display ${scoreClass}">${scoreDisplay}</div>
            <p>You answered ${result.correctAnswers} out of ${result.totalQuestions} nurse interactions correctly.</p>
            ${result.hasTimer ? 
                (result.timeRemaining > 0 ? 
                    `<p class="time-info">Time remaining: ${Math.floor(result.timeRemaining / 60)}:${(result.timeRemaining % 60).toString().padStart(2, '0')}</p>` : 
                    `<p class="time-info time-up">Time expired during simulation</p>`
                ) :
                `<p class="time-info">No time limit was set for this scenario</p>`
            }
            ${result.score === 0 ? 
                `<div class="failure-message">
                    <p><strong>⚠️ All responses need improvement. Please review the correct answers below and retake the simulation.</strong></p>
                </div>` : ''
            }
        </div>
    `;

    // For zero score, show all correct answers prominently
    if (result.score === 0) {
        const allResponses = studentResponses.filter(response => response.correctAnswer);
        if (allResponses.length > 0) {
            resultsHTML += `
                <div class="mandatory-review-section">
                    <h3>📚 Mandatory Review: Correct Responses</h3>
                    <p class="review-instruction">Please study these correct responses before retaking the simulation:</p>
                    ${allResponses.map((response, index) => `
                        <div class="response-review-item mandatory-review">
                            <div class="response-number">Required Response ${index + 1}</div>
                            <div class="question"><strong>Situation:</strong> ${response.question}</div>
                            <div class="your-answer incorrect"><strong>Your Response:</strong> ${response.studentAnswer}</div>
                            <div class="correct-answer"><strong>Correct Response:</strong> ${response.correctAnswer}</div>
                            ${response.rationale ? `<div class="rationale"><strong>Why This Matters:</strong> ${response.rationale}</div>` : ''}
                            <div class="score-indicator failed">❌ Requires Improvement</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        // Normal flow for non-zero scores
        if (result.mistakes.length > 0) {
            resultsHTML += `
                <div class="mistakes-section">
                    <h3>Areas for Improvement</h3>
                    ${result.mistakes.map(mistake => `
                        <div class="mistake-item">
                            <div class="question"><strong>Expected:</strong> ${mistake.question}</div>
                            <div class="your-answer"><strong>Your Response:</strong> ${mistake.studentAnswer}</div>
                            <div class="correct-answer"><strong>Better Response:</strong> ${mistake.correctAnswer}</div>
                            ${mistake.rationale ? `<div class="rationale"><strong>Rationale:</strong> ${mistake.rationale}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Show all responses for review (for passing scores)
        const allResponses = studentResponses.filter(response => response.correctAnswer);
        if (allResponses.length > 0) {
            resultsHTML += `
                <div class="correct-answers-section">
                    <h3>Review: All Responses</h3>
                    ${allResponses.map((response, index) => `
                        <div class="response-review-item ${response.isCorrect ? 'correct' : 'incorrect'}">
                            <div class="response-number">Response ${index + 1}</div>
                            <div class="question"><strong>Expected:</strong> ${response.question}</div>
                            <div class="your-answer"><strong>Your Response:</strong> ${response.studentAnswer}</div>
                            <div class="correct-answer"><strong>Model Response:</strong> ${response.correctAnswer}</div>
                            ${response.rationale ? `<div class="rationale"><strong>Rationale:</strong> ${response.rationale}</div>` : ''}
                            <div class="score-indicator">${response.isCorrect ? '✅ Correct' : '❌ Needs Improvement'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Show perfect score message only for non-zero scores
    if (result.mistakes.length === 0 && result.score > 0) {
        resultsHTML += `
            <div class="perfect-score">
                <h3>Excellent Work!</h3>
                <p>You demonstrated proper nursing assessment and intervention skills throughout this scenario.</p>
            </div>
        `;
    }
    
    resultsContent.innerHTML = resultsHTML;
}

// Timer functions
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    isTimerRunning = true;
    showTimer();
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            timeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isTimerRunning = false;
}

function showTimer() {
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
        timerContainer.style.display = 'block';
    }
}

function hideTimer() {
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
        timerContainer.style.display = 'none';
    }
}

function updateTimerDisplay() {
    // Only update timer display if there's actually a timer running
    if (!currentScenario.timerDuration || currentScenario.timerDuration <= 0) {
        return;
    }
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timer-display');
    if (timerElement) {
        timerElement.textContent = display;
        
        // Change color when time is running low
        if (remainingTime <= 60) { // Last minute
            timerElement.style.color = '#ff4444';
            timerElement.style.fontWeight = 'bold';
        } else if (remainingTime <= 300) { // Last 5 minutes
            timerElement.style.color = '#ff8800';
        } else {
            timerElement.style.color = '#333';
        }
    }
}

function timeUp() {
    stopTimer();
    
    // Display time's up message
    displayMessage('system', 'Time\'s up! The simulation has ended automatically.');
    
    // Disable input if it was enabled
    disableStudentInput();
    
    // Show loading screen with time up message
    showLoading('Time expired! Processing final results...');
    
    // End simulation after a brief delay
    setTimeout(() => {
        endSimulation();
    }, 2000);
}

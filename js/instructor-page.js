// Instructor page specific functionality

let currentEditingScenario = null;
let interactionCounter = 0;

// Initialize instructor page
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication first
    if (!requireAuth()) {
        return; // Will redirect to login page
    }
    
    // Initialize scenarios data
    await initializeScenarios();
    
    // Load scenarios management
    loadScenariosManagement();
    
    // Add first interaction for new scenarios
    setTimeout(() => {
        addInteraction();
    }, 100);
    
    // Setup PIN form
    setupPinForm();
});

// Loading screen functions
function showLoadingScreen(message = 'Saving scenario...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = overlay.querySelector('.loading-text');
    loadingText.textContent = message;
    overlay.style.display = 'flex';
}

function hideLoadingScreen() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'none';
}

// Show instructor tab
function showInstructorTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'create') {
        document.getElementById('create-scenario').classList.add('active');
    } else if (tabName === 'manage') {
        document.getElementById('manage-scenarios').classList.add('active');
        loadScenariosManagement();
    }
}

// Add new interaction to the form
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
            <div class="form-group">
                <label>Message:</label>
                <textarea placeholder="Enter the message..." required></textarea>
            </div>
        </div>
    `;
    
    interactionsList.appendChild(interactionDiv);
    updateInteractionType(interactionCounter);
}

// Update interaction type fields
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
            <div class="form-group">
                <label>Rationale (optional):</label>
                <textarea placeholder="Explain why this response is appropriate (e.g., assessing pain level helps determine urgency and appropriate interventions...)"></textarea>
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

// Remove interaction
function removeInteraction(interactionId) {
    const interactionDiv = document.querySelector(`[data-interaction-id="${interactionId}"]`);
    if (interactionDiv) {
        interactionDiv.remove();
    }
}

// Handle scenario form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scenario-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading screen
            showLoadingScreen();
            
            // Simulate a small delay for better UX
            setTimeout(() => {
                try {
                    const interactions = collectInteractions();
                    
                    const timerDurationValue = document.getElementById('timer-duration').value;
                    
                    const scenario = {
                        title: document.getElementById('scenario-title').value,
                        hospitalSetting: document.getElementById('hospital-setting').value,
                        description: document.getElementById('scenario-description').value,
                        patientProfile: document.getElementById('patient-profile').value,
                        timerDuration: timerDurationValue ? parseInt(timerDurationValue) : null,
                        interactions: interactions
                    };
                    
                    if (currentEditingScenario) {
                        // Update existing scenario
                        updateScenario(currentEditingScenario, scenario);
                        currentEditingScenario = null;
                        
                        // Hide loading screen and show success message
                        hideLoadingScreen();
                        alert('Scenario updated successfully!');
                        
                        // Redirect to scenario selection page
                        window.location.href = 'index.html';
                    } else {
                        // Add new scenario
                        addScenario(scenario);
                        
                        // Hide loading screen and show success message
                        hideLoadingScreen();
                        alert('Scenario created successfully!');
                        
                        // Redirect to scenario selection page
                        window.location.href = 'index.html';
                    }
                    
                    // Reset form
                    this.reset();
                    document.getElementById('interactions-list').innerHTML = '';
                    interactionCounter = 0;
                    addInteraction(); // Add one interaction for next scenario
                    
                    // Refresh management view if it's active
                    if (document.getElementById('manage-scenarios').classList.contains('active')) {
                        loadScenariosManagement();
                    }
                } catch (error) {
                    // Hide loading screen and show error message
                    hideLoadingScreen();
                    alert('Error saving scenario. Please try again.');
                    console.error('Error saving scenario:', error);
                }
            }, 800); // 800ms delay for better UX
        });
    }
});

// Collect interactions from form
function collectInteractions() {
    const interactions = [];
    const interactionItems = document.querySelectorAll('.interaction-item');
    
    interactionItems.forEach((item, index) => {
        const typeSelect = item.querySelector('.interaction-type-select');
        const type = typeSelect.value;
        
        if (type === 'nurse') {
            const expectedResponse = item.querySelector('input').value;
            const textareas = item.querySelectorAll('textarea');
            const correctResponse = textareas[0].value;
            const rationale = textareas[1] ? textareas[1].value : '';
            
            interactions.push({
                type: type,
                message: '', // Nurse responses are input by students
                isCorrect: true,
                expectedResponse: expectedResponse,
                correctResponse: correctResponse,
                rationale: rationale
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

// Load scenarios for management
function loadScenariosManagement() {
    const scenarios = getScenarios();
    const managementDiv = document.getElementById('scenarios-management');
    
    if (scenarios.length === 0) {
        managementDiv.innerHTML = `
            <div class="scenarios-header">
                <h3>Manage Scenarios</h3>
                <div class="scenarios-actions">
                    <button onclick="exportScenariosAsJSON()" class="export-btn">Export All as JSON</button>
                    <input type="file" id="import-scenarios" accept=".json" style="display: none;" onchange="handleImportScenarios(event)">
                    <button onclick="document.getElementById('import-scenarios').click()" class="import-btn">Import from JSON</button>
                </div>
            </div>
            <p>No scenarios found.</p>
        `;
        return;
    }
    
    managementDiv.innerHTML = `
        <div class="scenarios-header">
            <h3>Manage Scenarios</h3>
            <div class="scenarios-actions">
                <button onclick="exportScenariosAsJSON()" class="export-btn">Export All as JSON</button>
                <input type="file" id="import-scenarios" accept=".json" style="display: none;" onchange="handleImportScenarios(event)">
                <button onclick="document.getElementById('import-scenarios').click()" class="import-btn">Import from JSON</button>
            </div>
        </div>
        <div class="scenarios-list">
            ${scenarios.map(scenario => `
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
            `).join('')}
        </div>
    `;
}

// Handle import scenarios from JSON file
async function handleImportScenarios(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const scenarios = await importScenariosFromJSON(file);
        
        // Show success message
        alert(`Successfully imported ${scenarios.length} scenarios!`);
        
        // Reload the scenarios management view
        loadScenariosManagement();
        
        // Clear the file input
        event.target.value = '';
        
    } catch (error) {
        alert(`Error importing scenarios: ${error.message}`);
        console.error('Import error:', error);
        
        // Clear the file input
        event.target.value = '';
    }
}

// Edit scenario
function editScenario(scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return;
    
    currentEditingScenario = scenarioId;
    
    // Switch to create tab
    showInstructorTab('create');
    
    // Fill form with scenario data
    document.getElementById('scenario-title').value = scenario.title;
    document.getElementById('hospital-setting').value = scenario.hospitalSetting;
    document.getElementById('scenario-description').value = scenario.description;
    document.getElementById('patient-profile').value = scenario.patientProfile;
    document.getElementById('timer-duration').value = scenario.timerDuration || '';
    
    // Clear and rebuild interactions
    document.getElementById('interactions-list').innerHTML = '';
    interactionCounter = 0;
    
    scenario.interactions.forEach(interaction => {
        addInteraction();
        const interactionDiv = document.querySelector(`[data-interaction-id="${interactionCounter}"]`);
        const typeSelect = interactionDiv.querySelector('.interaction-type-select');
        
        typeSelect.value = interaction.type;
        updateInteractionType(interactionCounter);
        
        if (interaction.type === 'nurse') {
            const expectedInput = interactionDiv.querySelector('input');
            const textareas = interactionDiv.querySelectorAll('textarea');
            expectedInput.value = interaction.expectedResponse || '';
            textareas[0].value = interaction.correctResponse || '';
            if (textareas[1]) {
                textareas[1].value = interaction.rationale || '';
            }
        } else {
            const textarea = interactionDiv.querySelector('textarea');
            textarea.value = interaction.message;
        }
    });
}

// Delete scenario with confirmation
function deleteScenarioConfirm(scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return;
    
    if (confirm(`Are you sure you want to delete "${scenario.title}"?`)) {
        // Show loading screen for deletion
        showLoadingScreen('Deleting scenario...');
        
        // Simulate a delay for deletion
        setTimeout(() => {
            try {
                deleteScenario(scenarioId);
                loadScenariosManagement();
                hideLoadingScreen();
                alert('Scenario deleted successfully!');
            } catch (error) {
                hideLoadingScreen();
                alert('Error deleting scenario. Please try again.');
                console.error('Error deleting scenario:', error);
            }
        }, 500); // 500ms delay for deletion
    }
}

// Utility function to get setting display name
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

// PIN management functions
function showPinModal() {
    const modal = document.getElementById('pin-modal');
    modal.style.display = 'flex';
    document.getElementById('current-pin').focus();
}

function hidePinModal() {
    const modal = document.getElementById('pin-modal');
    modal.style.display = 'none';
    
    // Clear form
    document.getElementById('pin-form').reset();
}

function setupPinForm() {
    const form = document.getElementById('pin-form');
    if (form) {
        // Add input formatting for all PIN fields
        const pinInputs = form.querySelectorAll('input[type="password"]');
        pinInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                // Only allow numbers
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Limit to 4 digits
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPin = document.getElementById('current-pin').value;
            const newPin = document.getElementById('new-pin').value;
            const confirmPin = document.getElementById('confirm-pin').value;
            
            // Validation
            if (currentPin !== getCurrentPin()) {
                alert('Current PIN is incorrect.');
                document.getElementById('current-pin').focus();
                return;
            }
            
            if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
                alert('New PIN must be exactly 4 digits.');
                document.getElementById('new-pin').focus();
                return;
            }
            
            if (newPin !== confirmPin) {
                alert('PINs do not match.');
                document.getElementById('confirm-pin').focus();
                return;
            }
            
            if (newPin === currentPin) {
                alert('New PIN must be different from current PIN.');
                document.getElementById('new-pin').focus();
                return;
            }
            
            // Show loading screen for PIN update
            showLoadingScreen('Updating PIN...');
            
            // Simulate a delay for PIN update
            setTimeout(() => {
                try {
                    // Update PIN
                    if (updatePin(newPin)) {
                        hideLoadingScreen();
                        alert('PIN updated successfully!');
                        hidePinModal();
                    } else {
                        hideLoadingScreen();
                        alert('Failed to update PIN. Please try again.');
                    }
                } catch (error) {
                    hideLoadingScreen();
                    alert('Error updating PIN. Please try again.');
                    console.error('Error updating PIN:', error);
                }
            }, 600); // 600ms delay for PIN update
        });
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('pin-modal');
    if (e.target === modal) {
        hidePinModal();
    }
});

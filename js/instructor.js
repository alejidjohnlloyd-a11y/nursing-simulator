// Instructor panel functionality

let currentEditingScenario = null;
let interactionCounter = 0;

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
document.getElementById('scenario-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const interactions = collectInteractions();
    
    // Get timer duration - only set if a value is provided
    const timerDurationValue = document.getElementById('timer-duration').value;
    const timerDuration = timerDurationValue ? parseInt(timerDurationValue) : null;
    
    console.log('Timer duration input value:', timerDurationValue);
    console.log('Processed timer duration:', timerDuration);
    
    const scenario = {
        title: document.getElementById('scenario-title').value,
        hospitalSetting: document.getElementById('hospital-setting').value,
        description: document.getElementById('scenario-description').value,
        patientProfile: document.getElementById('patient-profile').value,
        timerDuration: timerDuration,
        interactions: interactions
    };
    
    if (currentEditingScenario) {
        // Update existing scenario
        updateScenario(currentEditingScenario, scenario);
        currentEditingScenario = null;
        alert('Scenario updated successfully!');
    } else {
        // Add new scenario
        addScenario(scenario);
        alert('Scenario created successfully!');
    }
    
    // Reset form
    this.reset();
    document.getElementById('interactions-list').innerHTML = '';
    interactionCounter = 0;
    
    // Refresh management view if it's active
    if (document.getElementById('manage-scenarios').classList.contains('active')) {
        loadScenariosManagement();
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
            const correctResponse = item.querySelector('textarea').value;
            
            interactions.push({
                type: type,
                message: '', // Nurse responses are input by students
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

// Load scenarios for management
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
            const correctTextarea = interactionDiv.querySelector('textarea');
            expectedInput.value = interaction.expectedResponse || '';
            correctTextarea.value = interaction.correctResponse || '';
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
        deleteScenario(scenarioId);
        loadScenariosManagement();
        alert('Scenario deleted successfully!');
    }
}

// Main application functionality

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load scenarios on page load
    loadScenarios();
});

// Page navigation
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

// Load and display scenarios on landing page
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

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize scenarios data
    await initializeScenarios();
    
    // Load landing page by default
    showPage('landing');
    
    // Add first interaction when creating scenarios
    setTimeout(() => {
        if (document.getElementById('create-scenario').classList.contains('active')) {
            addInteraction();
        }
    }, 100);
});

// Utility function to get setting display name (used in multiple files)
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

// Export functions for use in other files
window.showPage = showPage;
window.showInstructorTab = showInstructorTab;
window.addInteraction = addInteraction;
window.updateInteractionType = updateInteractionType;
window.removeInteraction = removeInteraction;
window.editScenario = editScenario;
window.deleteScenarioConfirm = deleteScenarioConfirm;
window.startSimulation = startSimulation;
window.sendMessage = sendMessage;
window.endSimulation = endSimulation;

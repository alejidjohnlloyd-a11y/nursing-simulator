// Load default scenarios from JSON file
let defaultScenarios = [];

// Function to load scenarios from JSON file
async function loadDefaultScenarios() {
    try {
        const response = await fetch('../data/scenarios.json');
        if (response.ok) {
            defaultScenarios = await response.json();
            // Set current date for scenarios that don't have it
            defaultScenarios.forEach(scenario => {
                if (!scenario.dateCreated) {
                    scenario.dateCreated = new Date().toISOString();
                }
            });
        } else {
            console.warn('Could not load default scenarios from JSON file');
            defaultScenarios = [];
        }
    } catch (error) {
        console.error('Error loading default scenarios:', error);
        defaultScenarios = [];
    }
}

// Get scenarios from localStorage or use defaults
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

// Save scenarios to localStorage
function saveScenarios(scenarios) {
    localStorage.setItem('nursingScenarios', JSON.stringify(scenarios));
}

// Initialize scenarios in localStorage if not present
async function initializeScenarios() {
    // Load default scenarios first
    await loadDefaultScenarios();
    
    const scenarios = getScenarios();
    saveScenarios(scenarios);
}

// Export scenarios as JSON
function exportScenariosAsJSON() {
    const scenarios = getScenarios();
    const dataStr = JSON.stringify(scenarios, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nursing-scenarios.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import scenarios from JSON file
function importScenariosFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const scenarios = JSON.parse(e.target.result);
                // Validate the structure
                if (Array.isArray(scenarios)) {
                    saveScenarios(scenarios);
                    resolve(scenarios);
                } else {
                    reject(new Error('Invalid JSON structure'));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

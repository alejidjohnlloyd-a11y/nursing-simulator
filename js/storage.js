// Storage management for scenarios and simulation results

// Save simulation result
function saveSimulationResult(scenarioId, result) {
    const results = getSimulationResults();
    const newResult = {
        scenarioId: scenarioId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        mistakes: result.mistakes,
        status: result.score === 0 ? 'FAILED' : result.score >= 60 ? 'PASSED' : 'NEEDS_IMPROVEMENT',
        isPassing: result.score > 0, // Clear pass/fail indicator
        completedAt: new Date().toISOString()
    };
    
    results.push(newResult);
    localStorage.setItem('simulationResults', JSON.stringify(results));
}

// Get all simulation results
function getSimulationResults() {
    const stored = localStorage.getItem('simulationResults');
    return stored ? JSON.parse(stored) : [];
}

// Get results for a specific scenario
function getScenarioResults(scenarioId) {
    const results = getSimulationResults();
    return results.filter(result => result.scenarioId === scenarioId);
}

// Add new scenario
function addScenario(scenario) {
    const scenarios = getScenarios();
    scenario.id = 'custom-' + Date.now();
    scenario.createdBy = 'instructor';
    scenario.dateCreated = new Date().toISOString();
    
    scenarios.push(scenario);
    saveScenarios(scenarios);
    return scenario.id;
}

// Update existing scenario
function updateScenario(scenarioId, updatedScenario) {
    const scenarios = getScenarios();
    const index = scenarios.findIndex(s => s.id === scenarioId);
    
    if (index !== -1) {
        console.log('Updating scenario:', scenarioId);
        console.log('Original timerDuration:', scenarios[index].timerDuration);
        console.log('New timerDuration:', updatedScenario.timerDuration);
        
        // Preserve original id and creation info, but update all other fields
        scenarios[index] = { 
            ...scenarios[index], 
            ...updatedScenario,
            id: scenarios[index].id, // Ensure ID is preserved
            createdBy: scenarios[index].createdBy,
            dateCreated: scenarios[index].dateCreated
        };
        
        console.log('Updated timerDuration:', scenarios[index].timerDuration);
        saveScenarios(scenarios);
        return true;
    }
    return false;
}

// Delete scenario
function deleteScenario(scenarioId) {
    const scenarios = getScenarios();
    const filtered = scenarios.filter(s => s.id !== scenarioId);
    
    if (filtered.length < scenarios.length) {
        saveScenarios(filtered);
        return true;
    }
    return false;
}

// Get scenario by ID
function getScenarioById(scenarioId) {
    const scenarios = getScenarios();
    return scenarios.find(s => s.id === scenarioId);
}

// Clear all data (for testing purposes)
async function clearAllData() {
    localStorage.removeItem('nursingScenarios');
    localStorage.removeItem('simulationResults');
    await initializeScenarios();
}



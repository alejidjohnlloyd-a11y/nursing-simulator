# Data Directory

This directory contains the JSON data files for the Nursing Chat-Based Simulator.

## Files

### scenarios.json
Contains the default nursing scenarios used in the simulator. Each scenario includes:

- **id**: Unique identifier for the scenario
- **title**: Display name of the scenario
- **hospitalSetting**: Type of hospital unit (emergency, surgical, pediatric, etc.)
- **description**: Brief description of the scenario
- **patientProfile**: Detailed patient information and presenting condition
- **timerDuration**: Time limit for the scenario in minutes
- **interactions**: Array of conversation interactions between system, patient, and nurse
- **createdBy**: Creator identifier (system for defaults, instructor ID for custom)
- **dateCreated**: ISO timestamp of creation

## Interaction Structure

Each interaction in the `interactions` array contains:

- **type**: 'system', 'patient', or 'nurse'
- **message**: The text content of the interaction
- **isCorrect**: Boolean indicating if this is a correct nurse response (null for system/patient)
- **expectedResponse**: Brief description of what the student should do
- **correctResponse**: Example of an appropriate nurse response
- **rationale**: Educational explanation of why this response is correct

## Usage

The JSON file is loaded by the `loadDefaultScenarios()` function in `data.js`. Instructors can:

1. Export current scenarios using `exportScenariosAsJSON()`
2. Import new scenarios using `importScenariosFromJSON(file)`
3. Manually edit the JSON file to modify default scenarios

## Adding New Scenarios

To add new default scenarios:

1. Edit `scenarios.json` following the existing structure
2. Ensure unique IDs for each scenario
3. Set `createdBy` to "system" for default scenarios
4. Include proper interaction flows with educational rationales

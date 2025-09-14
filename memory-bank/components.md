# Calculator Component Architecture

## Core Components

### 1. Display Component
**Purpose**: Shows current number, operations, and results
**Files**: `display.js`, `display.css`
**Dependencies**: Calculator State
**Responsibilities**:
- Render current value
- Format numbers (commas, decimals)
- Handle overflow/underflow
- Show error states

### 2. Button Grid Component  
**Purpose**: Renders and manages all calculator buttons
**Files**: `buttons.js`, `buttons.css`
**Dependencies**: Event Handler, Button Definitions
**Responsibilities**:
- Render button layout
- Handle button styling states
- Manage button animations
- Responsive sizing

### 3. Calculator Engine
**Purpose**: Core calculation logic and state management
**Files**: `calculator.js`
**Dependencies**: None (pure logic)
**Responsibilities**:
- Perform arithmetic operations
- Manage calculation state
- Handle operation precedence
- Validate inputs

### 4. Event Handler
**Purpose**: Manages user interactions and input processing
**Files**: `events.js`
**Dependencies**: Calculator Engine, Display Component
**Responsibilities**:
- Process button clicks
- Handle keyboard input
- Validate input sequences
- Trigger display updates

### 5. Main Application
**Purpose**: Initializes and coordinates all components
**Files**: `app.js`, `index.html`, `styles.css`
**Dependencies**: All other components
**Responsibilities**:
- Initialize application
- Set up event listeners
- Coordinate component communication
- Handle application lifecycle

## Component Dependencies

```
Main Application
├── Display Component
│   └── Calculator Engine (state)
├── Button Grid Component
│   └── Event Handler
├── Event Handler
│   ├── Calculator Engine
│   └── Display Component
└── Calculator Engine (independent)
```

## Data Flow

1. **User Input** → Event Handler
2. **Event Handler** → Calculator Engine (process input)
3. **Calculator Engine** → Display Component (update display)
4. **Display Component** → DOM (render changes)

## File Structure

```
calculator/
├── index.html              # Main HTML structure
├── css/
│   ├── styles.css          # Main styles and layout
│   ├── display.css         # Display-specific styles
│   └── buttons.css         # Button-specific styles
├── js/
│   ├── app.js              # Main application entry point
│   ├── calculator.js       # Calculator engine/logic
│   ├── display.js          # Display component
│   ├── buttons.js          # Button grid component
│   └── events.js           # Event handling
└── README.md               # Project documentation
```

## Integration Points

### Calculator Engine ↔ Display Component
- **Interface**: `updateDisplay(value, operation, error)`
- **Data**: Current value, pending operation, error state

### Event Handler ↔ Calculator Engine  
- **Interface**: `processInput(type, value)`
- **Data**: Input type (number/operation/function), input value

### Button Grid ↔ Event Handler
- **Interface**: `handleButtonClick(buttonId, buttonType)`
- **Data**: Button identifier, button type classification

### Display Component ↔ DOM
- **Interface**: Direct DOM manipulation
- **Data**: Formatted display text, error messages

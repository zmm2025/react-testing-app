// Import assets
import '../assets/styles/class-selector.css';
import classesData from "../data/classes.json";

export default function ClassSelector() {
    return (
        <div className="class-selector">
            {tableColumns}
        </div>
    );
}

// Define helper functions
function childrenCount(object) {
    return Object.keys(object).length;
}

// Define classes data
const classesDataDepth = 7;
let currentClassPath = ["Site Products", "Ground Anchorages"];

// Initialize table columns
let tableColumns = [];
let levelClasses = classesData;
for (let colIndex = 0; colIndex < classesDataDepth; colIndex++) {
    let columnCells = [];

    // Add header to column
    columnCells.push(
        <div className="header">
            Level {colIndex + 1}
        </div>
    );

    // Initialize body cells
    let columnBodyCells = [];
    for (let rowIndex = 0; rowIndex < childrenCount(levelClasses); rowIndex++) {
        let rowClass = Object.keys(levelClasses)[rowIndex];
        columnBodyCells.push(
            <div className="body-cell">
                {rowClass}
            </div>
        );
    }

    // Add body to column
    columnCells.push(
        <div className="body">
            {columnBodyCells}
        </div>
    );

    // Add column to array
    tableColumns.push(
        <div className="column">
            {columnCells}
        </div>
    );

    if (colIndex < currentClassPath.length) {
        let selectedClass = currentClassPath[colIndex];
        levelClasses = levelClasses[selectedClass];
    } else {
        levelClasses = {};
    }
}

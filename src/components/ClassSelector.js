// Import assets
import '../assets/styles/class-selector.css';
import classesData from "../data/classes.json"

export default function ClassSelector() {
    return (
        <table className="class-selector">
            <thead>
                <tr>
                    {headerCells}
                </tr>
            </thead>
            <tbody>
                {bodyRows}
            </tbody>
        </table>
    )
}

// Define helper functions
function childrenCount(object) {
    return Object.keys(object).length;
}

// Define classes data
const classesDataDepth = 7;
let currentClassPath = ["Site Products", "Ground Anchorages"];

// Generate table header cells
let headerCells = [];
for (let levelIndex = 1; levelIndex <= classesDataDepth; levelIndex++) {
    headerCells.push(<th>Level {levelIndex}</th>);
}

// Generate table body rows
let bodyRows = [];
for (let rowIndex = 0; rowIndex < childrenCount(classesData); rowIndex++) {
    // Generate table row cells by traversing selected classes indexing each cell's class
    let rowCells = [];
    let levelClass = classesData;
    for (let levelIndex = 1; levelIndex <= classesDataDepth; levelIndex++) {
        let cellText = "";
        // If the cell's level is within the selected or next class,
        // get its text and traverse to the next class if its level is selected
        if (levelIndex <= currentClassPath.length + 1) {
            cellText = Object.keys(levelClass)[rowIndex];
            
            if (levelIndex <= currentClassPath.length) {
                let nextClass = currentClassPath[levelIndex - 1]
                levelClass = levelClass[nextClass];
            }
        }
        rowCells.push(<td>{cellText}</td>);
    }
    bodyRows.push(<tr>{rowCells}</tr>);
}

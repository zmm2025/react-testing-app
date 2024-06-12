// Import assets
import '../assets/styles/class-selector.css';

export default function ClassSelector() {
    return (
        <table className="class-selector">
            <thead>
                <tr>
                    {headerCells}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                </tr>
                <tr>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                </tr>
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
const classesData = {
    "Site Products": {
        "Ground Anchorages": {
            "Retaining Stabilizing Ground Anchors": {
                "Retaining Stabilizing Ground Components": {
                    "Stabilizing Ground Anchor Heads": {

                    },
                    "Stabilizing Ground Tendons": {

                    },
                },
                "Stabilizing Ground Grouted Anchors": {

                },
                "Stabilizing Ground Plate Anchors": {

                },
            },
            "Earth Reinforcement Anchors": {

            },
        },
        "Ground Improvement Products": {

        },
        "Sheeting and Revetments": {

        },
    },
    "Structural and Exterior Enclosure Products": {

    },
    "Interior and Finish Products": {

    },
}
const classesDataDepth = 5;
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

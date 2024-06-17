import "../assets/styles/class-selector.css";
import level1Classes from "../data/classes.json";
import { useState } from "react";

export default function ClassSelector() {
    const classesDataDepth = 7; // TODO: make this dynamically calculated from JSON

    const [classPath, setClassPath] = useState(["Site Products", "Ground Anchorages"]); // TEMP: Default test value
    const [levels, setLevels] = useState(updateLevels(classPath));
    
    function updateClassPath(selectedClass, classLevelNum) {
        let newClassPath = classPath.slice(classLevelNum - 0).push(selectedClass);
        setClassPath(newClassPath);
        updateLevels();
    }
    
    function updateLevels() {
        let newLevels = [];
        
        // Push level 1 to levels array
        let levelClasses = level1Classes;
        newLevels.push(Object.keys(levelClasses));

        // Push all other selected levels to levels array
        for (const pathClass of classPath) {
            levelClasses = levelClasses[pathClass];
            newLevels.push(Object.keys(levelClasses));
        }

        setLevels(newLevels);
    }

    function childrenCount(object) {
        return Object.keys(object).length;
    }

    let selectorColumns = levels.map((level, colIndex) => {
        const levelNum = colIndex + 1;
        // CONTINUE HERE
        
        // let columnBodyCells = 

        return (
            <div className="column">
                <div className="header">
                    Level {levelNum}
                </div>
                <div className="horizontal-separator" />
                <div className="body">
                    {columnbodyCells}
                </div>
            </div>
        );
    });
    
    return (
        <div className="class-selector">
            {selectorColumns}
        </div>
    );
}

// Initialize class selector columns
let selectorColumns = [];

let levelClasses = level1Classes;
for (let colIndex = 0; colIndex < classesDataDepth; colIndex++) {
    let columnCells = [];

    let levelNum = colIndex + 1;

    // Add header to column
    columnCells.push(
        <div className="header">
            Level {levelNum}
        </div>
    );

    // Add horizontal divider to column
    columnCells.push(
        <div className="horizontal-divider" />
    );

    // Initialize body cells
    let columnBodyCells = [];
    for (let rowIndex = 0; rowIndex < childrenCount(levelClasses); rowIndex++) {
        let rowClass = Object.keys(levelClasses)[rowIndex];
        columnBodyCells.push(
            <button className="body-cell" onClick={updatePath(rowClass, levelNum)}>
                {rowClass}
            </button>
        );
    }

    // Add body to column
    columnCells.push(
        <div className="body">
            {columnBodyCells}
        </div>
    );

    // Add column to array
    selectorColumns.push(
        <div className="column">
            {columnCells}
        </div>
    );

    // Add vertical divider to array
    selectorColumns.push(
        <div className="vertical-divider" />
    );

    // Traverse to next level
    if (colIndex < currentClassPath.length) {
        let selectedClass = currentClassPath[colIndex];
        levelClasses = levelClasses[selectedClass];
    } else {
        levelClasses = {};
    }
}

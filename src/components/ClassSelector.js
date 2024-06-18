import "../assets/styles/class-selector.css";
import level1Classes from "../data/classes.json";
import { useEffect, useState, Fragment } from "react";

export default function ClassSelector() {
    const classesDataDepth = 7; // TODO: make this dynamically calculated from JSON (if used)

    const [classPath, setClassPath] = useState([]);
    const [levels, setLevels] = useState([Object.keys(level1Classes)]);

    // Update levels every time the class path is updated
    useEffect(() => updateLevels(), [classPath]);

    // Update the class path so that the selected class is the deepest selected class
    function updateClassPath(selectedClass, classLevelNum) {
        let newClassPath = classPath.slice(0, classLevelNum - 1);
        newClassPath.push(selectedClass);
        setClassPath(newClassPath);
    }
    
    // Update all class selector based on the current class path
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

    // Initialize class selector columns
    let selectorColumns = levels.map((level, colIndex) => {
        const levelNum = colIndex + 1;
        
        // Initialize column body cells
        let columnBodyCells = level.map((className, rowIndex) => {
            return (
                <div key={className} className="body-cell" onClick={() => updateClassPath(className, levelNum)}>
                    {className}
                </div>
            );
        })

        return (
            <Fragment key={levelNum}>
                <div key={"level-" + levelNum} className="column">
                    <div className="header">
                        Level {levelNum}
                    </div>
                    <div className="horizontal-separator" />
                    <div className="body">
                        {columnBodyCells}
                    </div>
                </div>
                <div key={"level-" + levelNum + "-sep"} className="vertical-separator" />
            </Fragment>
        );
    });
    
    return (
        <div className="class-selector">
            {selectorColumns}
        </div>
    );
}

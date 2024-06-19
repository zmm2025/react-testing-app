import { Fragment, useEffect, useState } from "react";
import level1Classes from "../../data/classes.json";
import SelectorCell from "../SelectorCell/SelectorCell";
import "./ClassSelector.css";

export default function ClassSelector() {
    const [classPath, setClassPath] = useState([]);
    const [levels, setLevels] = useState([Object.keys(level1Classes)]);

    // Update levels every time the class path is updated
    useEffect(() => {
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

        updateLevels();
    }, [classPath]);

    // Update the class path so that the selected class is the deepest selected class
    function updateClassPath(selectedClass, classLevelNum) {
        let newClassPath = classPath.slice(0, classLevelNum - 1);
        newClassPath.push(selectedClass);
        setClassPath(newClassPath);
    }

    // Update the class path when a cell is clicked
    function handleCellClick(cellClass, cellLevelNum) {
        updateClassPath(cellClass, cellLevelNum);
    }

    // Initialize class selector columns
    let selectorColumns = levels.map((level, colIndex) => {
        const levelNum = colIndex + 1;
        
        // Initialize column body cells
        let columnBodyCells = level.map((className) => {
            return (
                <SelectorCell
                    key={className}
                    classText={className}
                    onClick={() => handleCellClick(className, levelNum)}
                    classPath={classPath}
                    hasChildren={true} // TODO: Make this dynamic
                />
            );
        })

        return (
            <Fragment key={levelNum}>
                <div key={"level-" + levelNum} className="column">
                    <div className="col-header">
                        Level {levelNum}
                    </div>
                    <div className="horizontal-divider" />
                    <div className="col-body">
                        {columnBodyCells}
                    </div>
                </div>
                <div key={"level-" + levelNum + "-sep"} className="vertical-divider" />
            </Fragment>
        );
    });
    
    return (
        <div className="class-selector">
            {selectorColumns}
        </div>
    );
}

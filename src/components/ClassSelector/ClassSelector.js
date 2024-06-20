import { Fragment, useState } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

export default function ClassSelectorV2() {
    const [classPath, setClassPath] = useState([]);

    // Assemble selector columns
    let columns = [];
    let levelClasses = level1Classes;
    for (let levelNum = 1; levelNum <= classPath.length + 1; levelNum++) {
        // Step into next level class if this isn't the first level
        if (levelNum >= 2) {
            const pathIndex = levelNum - 2;
            const pathClass = classPath[pathIndex];
            levelClasses = levelClasses[pathClass];
        }
        
        // Add column to array
        columns.push(
            <Fragment key={"level-" + levelNum + "-fragment"}>
                {levelNum === 1 ? null : <Divider orientation="vertical" />} {/* Skip divider for first column */}
                <Column
                    levelNum={levelNum}
                    levelClasses={levelClasses}
                    classPath={classPath}
                    setClassPath={setClassPath}
                />
            </Fragment>
        );
    }

    return (
        <div className="class-selector">
            {columns}
        </div>
    );
}

function Column({ levelNum, levelClasses, classPath, setClassPath }) {
    return (
        <div className="column">
            <HeaderCell levelNum={levelNum} />
            <Divider orientation="horizontal" />
            <ColumnBody
                levelClasses={levelClasses}
                classPath={classPath}
                levelNum={levelNum}
                setClassPath={setClassPath}
            />
        </div>
    );
}

function Divider({ orientation }) {
    return (
        <div className={"divider " + orientation} />
    );
}

function HeaderCell({ levelNum }) {
    const text = levelNum === 0 ? null : <p>Level {levelNum}</p>;
    
    return (
        <div className="header-cell">
            {text}
        </div>
    );
}

function ColumnBody({ levelClasses, classPath, levelNum, setClassPath }) {
    function updateClassPath(selectedClassName, classLevelNum) {
        let newClassPath = classPath.slice(0, classLevelNum - 1);
        newClassPath.push(selectedClassName);
        setClassPath(newClassPath);
    }
    
    // Assemble column body cells
    const cells = Object.entries(levelClasses).map(([cellClassName, cls]) => {
        const hasChildren = Object.keys(cls).length;
        const isSelected = classPath.includes(cellClassName);

        return (
            <Cell
                key={cellClassName}
                cellClassName={cellClassName}
                hasChildren={hasChildren}
                isSelected={isSelected}
                onClick={() => updateClassPath(cellClassName, levelNum)}
            />
        );
    });

    return (
        <div className="column-body">
            {cells}
        </div>
    );
}

function Cell({ cellClassName, hasChildren, isSelected, onClick }) {
    const styleClass = "cell " + (isSelected ? "selected" : "unselected");

    return (
        <div className={styleClass} onClick={onClick}>
            <p className="cell-text">{cellClassName}</p>
            {hasChildren ? <RightChevron className="chevron" /> : null}
        </div>
    );
}

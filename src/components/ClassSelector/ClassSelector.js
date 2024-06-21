import { Fragment, useState } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

export default function ClassSelectorV2() {
    const [classPath, setClassPath] = useState([]);

    // Undefined levelNum and levelClasses will generate a filler column
    function pushLevelElements(elementsArray, levelNum = null, levelClasses = {}, hasDivider = true) {
        elementsArray.push(
            <Fragment key={"level-" + levelNum + "-fragment"}>
                {hasDivider ? <Divider orientation="vertical" /> : null}
                <Column
                    levelNum={levelNum}
                    levelClasses={levelClasses}
                    classPath={classPath}
                    setClassPath={setClassPath}
                />
            </Fragment>
        );
        return elementsArray;
    }

    // Assemble selector elements
    let elementsArray = [];
    let levelClasses = level1Classes;

    pushLevelElements(elementsArray, 1, levelClasses, false);
    
    for (const [pathIndex, pathClass] of classPath.entries()) {
        levelClasses = levelClasses[pathClass];

        if (Object.keys(levelClasses).length === 0) {
            break;
        }

        const levelNum = pathIndex + 2;
        pushLevelElements(elementsArray, levelNum, levelClasses);
    }

    pushLevelElements(elementsArray);

    return (
        <div className="class-selector">
            {elementsArray}
        </div>
    );
}

function Column({ levelNum, levelClasses, classPath, setClassPath }) {
    const styleClass = "column" + (Object.keys(levelClasses).length === 0 ? " filler" : "");
    
    return (
        <div className={styleClass}>
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
    const text = levelNum === null ? null : <p>Level {levelNum}</p>;
    
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
        const hasChildren = Object.keys(cls).length > 0;
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

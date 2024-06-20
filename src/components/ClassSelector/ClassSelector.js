import { Fragment, useState } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

export default function ClassSelectorV2() {
    const [classPath, setClassPath] = useState([]);
    
    // Assemble selector columns
    let levelClasses = level1Classes;
    let columns = [ // TODO: Combine this with lower definition
        <Column
            key={"level-1"}
            levelNum={1}
            levelClasses={levelClasses}
            classPath={classPath}
            setClassPath={setClassPath}
        />
    ];
    const remainingColumns = classPath.map((pathClass, pathIndex) => {
        const levelNum = pathIndex + 2;
        levelClasses = levelClasses[pathClass];
        return (
            <Fragment key={"level-" + levelNum + "-fragment"}>
                <Divider orientation="vertical" />
                <Column
                    levelNum={levelNum}
                    levelClasses={levelClasses}
                    classPath={classPath}
                    setClassPath={setClassPath}
                />
            </Fragment>
        );
    });
    columns.push(...remainingColumns);
    
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
        <div className={"divider " + orientation} /> // TODO: Double check the className formatting on this
    );
}

function HeaderCell({ levelNum }) {
    return (
        <div className="header-cell">
            <p>Level {levelNum}</p>
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

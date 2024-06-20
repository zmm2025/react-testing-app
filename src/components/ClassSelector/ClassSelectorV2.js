import { Fragment, useState } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelectorV2.css";

export default function ClassSelectorV2() {
    const [classPath, setClassPath] = useState([]);
    
    // Assemble selector columns
    let levelClasses = level1Classes;
    let columns = [
        <Column levelNum={1} levelClasses={levelClasses}/>
    ];
    const remainingColumns = classPath.map((pathClass, pathIndex) => {
        const levelNum = pathIndex + 1;
        levelClasses = levelClasses[pathClass];
        return (
            <Fragment>
                <Divider orientation="vertical" />
                <Column levelNum={levelNum} levelClasses={levelClasses}/>
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

function Column({ levelNum, levelClasses }) {
    return (
        <div key={"column-level-" + levelNum} className="column">
            <HeaderCell levelNum={levelNum} />
            <Divider orientation="horizontal" />
            <ColumnBody levelClasses={levelClasses} />
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

function ColumnBody({ levelClasses }) {
    // Assemble column body cells
    const cells = Object.entries(levelClasses).map(([cellClassName, cls]) => {
        const hasChildren = Object.keys(cls).length;

        return (
            <Cell cellClassName={cellClassName} hasChildren={hasChildren}/>
        );
    });

    return (
        <div className="column-body">
            {cells}
        </div>
    );
}

function Cell({ cellClassName, hasChildren }) {
    return (
        <div className="cell2 unselected">
            <p className="cell-text">{cellClassName}</p>
            {hasChildren && <RightChevron className="chevron" />}
        </div>
    );
}

import { Fragment, useState } from "react";
import level1Classes from "../../data/classes.json";
import "./ClassSelectorV2.css";

export default function ClassSelectorV2() {
    const [classPath, setClassPath] = useState([]);
    
    // Assemble selector columns
    let columns = [
        <Column levelNum={1} />
    ];
    const remainingColumns = classPath.map((pathClass, pathIndex) => {
        const levelNum = pathIndex + 1;
        return (
            <Fragment>
                <Divider orientation="vertical" />
                <Column levelNum={levelNum}/>
            </Fragment>
        )
    });
    columns.push(...remainingColumns);
    
    return (
        <div className="class-selector">
            {columns}
        </div>
    );
}

function Column({ levelNum }) {
    return (
        <div key={"column-level-" + levelNum} className="column">
            <HeaderCell levelNum={levelNum} />
            <Divider orientation="horizontal" />
            <ColumnBody levelClasses="" /> {/* TODO: Generalize levelClasses */}
        </div>
    )
}

function Divider({ orientation }) {
    return (
        <div className={"divider" + orientation} /> // TODO: Double check the className formatting on this
    )
}

function HeaderCell({ levelNum }) {
    return (
        <div className="header-cell">
            <p>Level {levelNum}</p>
        </div>
    )
}

function ColumnBody({ levelClasses }) {
    return (
        <div />
    )
}

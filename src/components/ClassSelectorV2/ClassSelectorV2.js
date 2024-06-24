import { createContext, useContext } from "react";
import "./ClassSelectorV2.css";

const SelectedClassesContext = createContext([]);

export default function ClassSelectorV2() {
    const initialSelectedClasses = [];
    const selectorCSSClass = "class-selector";
    
    return (
        <SelectedClassesContext.Provider value={initialSelectedClasses}>
            <div className={selectorCSSClass}>
                <SelectorElements />
            </div>
        </SelectedClassesContext.Provider>
    )
}

function SelectorElements() {
    const selectedClasses = useContext(SelectedClassesContext);
    const dividerOrientation = "vertical";
    let levelNum = 1;
    
    return (
        <>
            <SelectorColumn levelNum={levelNum} />
            {selectedClasses.map((_selectedClass, _selectedClassIndex) => {
                levelNum++;
                return (
                    <>
                        <Divider orientation={dividerOrientation} />
                        <SelectorColumn key={levelNum} levelNum={levelNum} />
                    </>
                )
            })}
            <Divider orientation={dividerOrientation} />
            <SelectorColumn levelNum={++levelNum} isHoverColumn={true} />
        </>
    )
}

function SelectorColumn({ levelNum, isHoverColumn = false }) {
    const columnCSSClass = "selector-column";
    
    return (
        <div className={columnCSSClass}>
            <HeaderCell levelNum={levelNum} />
            <Divider orientation={"horizontal"} />
            <ColumnBody levelNum={levelNum} />
        </div>
    )
}

function Divider({ orientation }) {
    const dividerCSSClass = "divider " + orientation;
    
    return (
        <div className={dividerCSSClass} />
    )
}

function HeaderCell({ levelNum }) {
    const cellCSSClass = "header-cell";
    
    return (
        <div className={cellCSSClass} />
    )
}

function ColumnBody({ levelNum }) {
    const bodyCSSClass = "column-body";

    return (
        <div className={bodyCSSClass} />
    )
}

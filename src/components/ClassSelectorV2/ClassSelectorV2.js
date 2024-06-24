import { createContext, useContext } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
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
    let levelNum = 1;
    const selectedClasses = useContext(SelectedClassesContext);
    const dividerOrientation = "vertical";
    const needsFillerColumn = selectedClasses.length === 0;
    
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
            {needsFillerColumn ? (
                <>
                    <Divider orientation={dividerOrientation} />
                    <SelectorColumn />
                </>
            ) : (
                null
            )}
        </>
    )
}

function SelectorColumn({ levelNum = null, isHoverColumn = false }) {
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
    const dividerCSSClass = `divider ${orientation}`;
    
    return (
        <div className={dividerCSSClass} />
    )
}

function HeaderCell({ levelNum = null }) {
    const cellCSSClass = "header-cell";
    const levelIsDefined = levelNum !== null;
    
    return (
        <div className={cellCSSClass}>
            {levelIsDefined ? (
                <p>{`Level ${levelNum}`}</p>
            ) : (
                null
            )}
        </div>
    )
}

function ColumnBody({ levelNum }) {
    const selectedClasses = useContext(SelectedClassesContext);
    const bodyCSSClass = "column-body";
    
    let levelClasses = level1Classes;
    if (levelNum === null) {
        levelClasses = {};
    } else {
        for (let levelIndex = 1; levelIndex < Math.min(selectedClasses.length + 1, levelNum); levelIndex++) {
            const selectedLevelClass = selectedClasses[levelIndex];
            levelClasses = levelClasses[selectedLevelClass];
        }
    }
    const levelClassEntries = Object.entries(levelClasses);

    return (
        <div className={bodyCSSClass}>
            {levelClassEntries.map(([name, children], index) => {
                const hasChildren = Object.keys(children).length > 0;
                return (
                    <Cell key={index} cellClassName={name} hasChildren={hasChildren} />
                )
            })}
        </div>
    )
}

function Cell({ cellClassName, hasChildren }) {
    const selectedClasses = useContext(SelectedClassesContext);
    const isSelected = selectedClasses.includes(cellClassName);
    const cellCSSClass = `cell ${isSelected ? "selected" : "unselected"}`;

    return (
        <div className={cellCSSClass}>
            <p className="cell-text">{cellClassName}</p>
            {hasChildren ? (
                <RightChevron className="cell-chevron" />
            ) : (
                null
            )}
        </div>
    )
}

import { createContext, useContext } from "react";
import "./ClassSelectorV2.css";

const SelectedClassesContext = createContext([]);

export default function ClassSelectorV2() {
    const initialSelectedClasses = [];
    
    return (
        <SelectedClassesContext.Provider value={initialSelectedClasses}>
            <div className="class-selector">
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
    return (
        <div className="selector-column" />
    )
}

function Divider({ orientation }) {
    return (
        <div className={"divider " + orientation} />
    )
}

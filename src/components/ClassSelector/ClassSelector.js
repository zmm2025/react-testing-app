import { Fragment, createContext, useContext, useEffect, useRef, useState } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

const ColumnTypes = Object.freeze({
    PREVIOUS:      "previous",
    SELECTION:     "selection",
    HOVER_PREVIEW: "hover-preview",
    FILLER:        "filler"
});

const SelectorContext = createContext({
    selectedClasses: [],
    selectClass: () => {},
    hoveredClass: null,
    setHoveredClass: () => {}
});    

const ColumnContext = createContext({
    levelNum: 1,
    type: ColumnTypes.SELECTION
});

export default function ClassSelector() {
    const initialSelectedClasses = [];

    const [selectedClasses, setSelectedClasses] = useState(initialSelectedClasses);
    const [hoveredClass, setHoveredClass] = useState(null);
    const selectorRef = useRef(null);
    const selectedClassRef = useRef(["", {}]);
    const selectorCSSClass = "class-selector";

    useEffect(scrollRightIfChildren, [selectedClasses]);

    function scrollRightIfChildren() {
        const [, selectedClassChildren] = selectedClassRef.current;
        const hasChildren = Object.keys(selectedClassChildren).length > 0;

        if (hasChildren) {
            const centerLevel = selectedClasses.length + 1;
            centerLevelInView(centerLevel);
        }
    }

    function centerLevelInView(level) {
        const centerElementIndex = 2 * (level - 1);

        const leftElementIndex  = centerElementIndex - 2;
        const rightElementIndex = centerElementIndex + 2;
        
        const leftElement  = selectorRef.current.children[leftElementIndex];
        const rightElement = selectorRef.current.children[rightElementIndex];

        leftElement.scrollIntoView();
        rightElement.scrollIntoView();
    }

    function selectClass(selectedClass, level) {
        selectedClassRef.current = selectedClass;
        const [className, classChildren] = selectedClass;
        const hasChildren = Object.keys(classChildren).length > 0;
        
        const centerLevel = Math.max(2, level) + hasChildren;
        centerLevelInView(centerLevel);

        let newSelectedClasses = selectedClasses.slice(0, level - 1);
        newSelectedClasses.push(className);
        setSelectedClasses(newSelectedClasses);
    }

    return (
        <SelectorContext.Provider value={{
            selectedClasses: selectedClasses,
            selectClass: selectClass,
            hoveredClass: hoveredClass,
            setHoveredClass: setHoveredClass
        }}>
            <div ref={selectorRef} className={selectorCSSClass}>
                <SelectorElements />
            </div>
        </SelectorContext.Provider>
    )
}

function SelectorElements() {
    const {selectedClasses} = useContext(SelectorContext);
    let levelNum = 0;
    const dividerOrientation = "vertical";

    return (
        <>
            {selectedClasses.map((_selectedClass, selectedClassIndex) => {
                levelNum++;
                return (
                    <Fragment key={selectedClassIndex}>
                        <Column type={ColumnTypes.PREVIOUS} levelNum={levelNum} />
                        <Divider orientation={dividerOrientation} />
                    </Fragment>
                )
            })}

            <Column type={ColumnTypes.SELECTION} levelNum={++levelNum} />
            <Divider orientation={dividerOrientation} />
            <Column type={ColumnTypes.HOVER_PREVIEW} levelNum={++levelNum} />
            <Divider orientation={dividerOrientation} />
            <Column type={ColumnTypes.FILLER} levelNum={null} />
        </>
    )
}

function Column({ type, levelNum = null }) {
    const columnCSSClass = `column ${type}`;
    
    return (
        <ColumnContext.Provider value={{levelNum: levelNum, type: type}}>
            <div className={columnCSSClass}>
                <HeaderCell />
                <Divider orientation={"horizontal"} />
                <ColumnBody />
            </div>
        </ColumnContext.Provider>
    )
}

function Divider({ orientation }) {
    const dividerCSSClass = `divider ${orientation}`;
    
    return (
        <div className={dividerCSSClass} />
    )
}

function HeaderCell() {
    const {levelNum, type} = useContext(ColumnContext);
    const cellCSSClass = `header-cell ${type}`;
    const showText = type !== ColumnTypes.FILLER;
    
    return (
        <div className={cellCSSClass}>
            {showText ? (
                <p>{`Level ${levelNum}`}</p>
            ) : (
                null
            )}
        </div>
    )
}

function ColumnBody() {
    const {selectedClasses, hoveredClass} = useContext(SelectorContext);
    const {levelNum, type} = useContext(ColumnContext);
    const bodyCSSClass = `column-body ${type}`;

    const levelClassEntries = getLevelClassEntries(type)
    
    function getLevelClassEntries(type) {
        if ((type === ColumnTypes.FILLER) || (type === ColumnTypes.HOVER_PREVIEW && hoveredClass === null)) {
            return [];
        }
        
        let levelClasses = level1Classes;
        for (let levelIndex = 1; levelIndex < Math.min(selectedClasses.length + 1, levelNum); levelIndex++) {
            const selectedLevelClass = selectedClasses[levelIndex - 1];
            levelClasses = levelClasses[selectedLevelClass];
        }
        if (type === ColumnTypes.HOVER_PREVIEW) {
            levelClasses = levelClasses[hoveredClass];
        }

        return Object.entries(levelClasses);
    }

    return (
        <div className={bodyCSSClass}>
            {levelClassEntries.map((classEntry, index) => {
                return (
                    <Cell key={index} cellClass={classEntry} />
                )
            })}
        </div>
    )
}

function Cell({ cellClass }) {
    const {selectedClasses, selectClass, setHoveredClass} = useContext(SelectorContext);
    const {levelNum, type} = useContext(ColumnContext);

    const [cellClassName, children] = cellClass;
    const hasChildren = Object.keys(children).length > 0;
    const isSelected = selectedClasses.includes(cellClassName);
    const cellCSSClass = `cell ${type} ${isSelected ? "selected" : "unselected"}`;
    const textCSSClass = `cell-text ${type}`;
    const chevronCSSClass = `chevron ${type}`;

    function handleMouseOver() {
        if (type === ColumnTypes.SELECTION) {
            setHoveredClass(cellClassName);
        }
    }

    function handleMouseOut() {
        if (type === ColumnTypes.SELECTION) {
            setHoveredClass(null);
        }
    }

    function handleClick() {
        setHoveredClass(null);
        selectClass(cellClass, levelNum);
    }

    return (
        <div className={cellCSSClass} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClick}>
            <p className={textCSSClass}>{cellClassName}</p>
            {hasChildren ? (
                <RightChevron className={chevronCSSClass} />
            ) : (
                null
            )}
        </div>
    )
}

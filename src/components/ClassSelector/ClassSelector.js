import { Fragment, createContext, useContext, useEffect, useRef, useState } from "react";
import level1Classes from "../../data/classes.json";
import { usePrevious } from "../../hooks/usePrevious.js";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

const ColumnTypes = Object.freeze({
    PREVIOUS:      "previous",
    SELECTION:     "selection",
    HOVER_PREVIEW: "hover-preview",
    FILLER:        "filler"
});

const ScrollDirection = Object.freeze({
    LEFT:  "left",
    RIGHT: "right"
})

const SelectorContext = createContext({
    selectedClasses: [],
    updateSelectedClasses: () => {},
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
    const previousSelectedClasses = usePrevious(selectedClasses, initialSelectedClasses);
    const selectorCSSClass = "class-selector";

    useEffect(scrollRightIfNeeded, [selectedClasses]);

    function scrollRightIfNeeded() {
        const selectedClassesGrew = selectedClasses.length > previousSelectedClasses.length;
        
        if (selectedClassesGrew) {
            const selectedClassLevel = selectedClasses.length;
            const selectedClass = selectedClasses[selectedClassLevel - 1];
            
            let levelClasses = level1Classes;
            for (let level = 1; level <= selectedClassLevel; level++) {                
                const selectedLevelClass = selectedClasses[level - 1];
                levelClasses = levelClasses[selectedLevelClass];
            }
            const selectedClassHasChildren = Object.keys(levelClasses).length > 0;

            const rightmostLevel = selectedClasses.length + 1 + selectedClassHasChildren;
            scrollSelectorToLevel(rightmostLevel);
        }
    }
    
    function scrollSelectorToLevel(scrollLevel) {
        const scrollElementIndex = 2 * (scrollLevel - 1);
        const scrollElement = selectorRef.current.children[scrollElementIndex];
        
        scrollElement.scrollIntoView();
    }

    function updateSelectedClasses(selectedClass, selectedClassLevel) {
        let newSelectedClasses = selectedClasses.slice(0, selectedClassLevel - 1);
        newSelectedClasses.push(selectedClass);

        const selectedClassesGrew = newSelectedClasses.length > selectedClasses.length;

        if (selectedClassesGrew) {
            setSelectedClasses(newSelectedClasses);

        } else {
            const previousLevel = Math.max(1, selectedClassLevel - 1);
            scrollSelectorToLevel(previousLevel);

            // "scrollend" compatibility: https://caniuse.com/mdn-api_element_scrollend_event
            selectorRef.current.addEventListener("scrollend", () => {
                setSelectedClasses(newSelectedClasses);
            }, {once: true});
        
        }
    }

    return (
        <SelectorContext.Provider value={{
            selectedClasses: selectedClasses,
            updateSelectedClasses: updateSelectedClasses,
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
    const showFillerColumn = selectedClasses.length === 0;

    return (
        //       # selected * <Previous Col>,  <Divider>
        //                1 * <Selection Col>, <Divider>
        //                1 * <Preview Col>
        // showFillerColumn * <Divider>,       <Filler Col>
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
            {showFillerColumn ? (
                <>
                    <Divider orientation={dividerOrientation} />
                    <Column type={ColumnTypes.FILLER} levelNum={null} />
                </>
            ) : (
                null
            )}
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
        let levelClasses = {};
        
        if ((type === ColumnTypes.FILLER) || (type === ColumnTypes.HOVER_PREVIEW && hoveredClass === null)) {
            return Object.entries(levelClasses);
        }
        
        levelClasses = level1Classes;
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
    const {selectedClasses, updateSelectedClasses, setHoveredClass} = useContext(SelectorContext);
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
        updateSelectedClasses(cellClassName, levelNum);
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

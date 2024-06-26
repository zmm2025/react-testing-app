import { Fragment, createContext, useContext, useEffect, useRef, useState } from "react";
import level1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

const ColumnTypes = Object.freeze({
    PREVIOUS:  "previous",
    SELECTION: "selection",
    PREVIEW:   "preview",
    FILLER:    "filler"
});

const SelectorContext = createContext({
    selectedClassNames: [],
    selectedClassDataRef: null,
    selectClass: () => {},
    hoveredClassName: null,
    setHoveredClassName: () => {}
});    

const ColumnContext = createContext({
    classEntries: [],
    level: 1,
    type: ColumnTypes.SELECTION
});

export default function ClassSelector() {
    const [selectedClassNames, setSelectedClassNames] = useState([]);
    const [hoveredClassname, setHoveredClassName] = useState(null);
    const selectorRef = useRef(null);
    const selectedClassDataRef = useRef({name: null, children: {}});
    const selectorCSSClass = "class-selector";

    useEffect(scrollRightIfChildren, [selectedClassNames]);

    function scrollRightIfChildren() {
        const {children: selectedClassChildren} = selectedClassDataRef.current;
        const selectedClassHasChildren = Object.keys(selectedClassChildren).length > 0;

        if (selectedClassHasChildren) {
            const centerLevel = selectedClassNames.length + 1;
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

    function selectClass(classData, level) {
        selectedClassDataRef.current = classData;
        const {name: className, children: classChildren} = classData;
        const isAtFirstLevel = level === 1;
        const hasChildren = Object.keys(classChildren).length > 0;
        
        const centerLevel = level + (isAtFirstLevel || hasChildren);
        centerLevelInView(centerLevel);

        let newSelectedClasses = selectedClassNames.slice(0, level - 1);
        newSelectedClasses.push(className);
        setSelectedClassNames(newSelectedClasses);
    }

    return (
        <SelectorContext.Provider value={{
            selectedClassNames: selectedClassNames,
            selectClass: selectClass,
            hoveredClassName: hoveredClassname,
            setHoveredClassName: setHoveredClassName,
            selectedClassDataRef: selectedClassDataRef
        }}>
            <div ref={selectorRef} className={selectorCSSClass}>
                <SelectorElements />
            </div>
        </SelectorContext.Provider>
    )
}

function SelectorElements() {
    const {selectedClassNames} = useContext(SelectorContext);
    let level = 0;
    const dividerOrientation = "vertical";

    return (
        <>
            {selectedClassNames.map((_className, classIndex) => {
                level++;
                return (
                    <Fragment key={classIndex}>
                        <Column type={ColumnTypes.PREVIOUS} level={level} />
                        <Divider orientation={dividerOrientation} />
                    </Fragment>
                )
            })}

            <Column type={ColumnTypes.SELECTION} level={++level} />
            <Divider orientation={dividerOrientation} />
            <Column type={ColumnTypes.PREVIEW} level={++level} />
            <Divider orientation={dividerOrientation} />
            <Column type={ColumnTypes.FILLER} level={null} />
        </>
    )
}

function Column({ type, level: columnLevel = null }) {
    const {selectedClassNames, hoveredClassName} = useContext(SelectorContext);
    const classEntries = getColumnClassEntries();
    const columnCSSClass = `column ${type}`;
    
    function getColumnClassEntries() {
        const isFillerColumn = type === ColumnTypes.FILLER;
        const isEmptyPreviewColumn = (type === ColumnTypes.PREVIEW) && (hoveredClassName === null);
        
        if (isFillerColumn || isEmptyPreviewColumn) {
            return [];
        }

        let levelClasses = level1Classes;
        for (let level = 1; level < Math.min(selectedClassNames.length + 1, columnLevel); level++) {
            const levelSelectedClassName = selectedClassNames[level - 1];
            levelClasses = levelClasses[levelSelectedClassName];
        }
        if (type === ColumnTypes.PREVIEW) {
            levelClasses = levelClasses[hoveredClassName];
        }

        return Object.entries(levelClasses);
    }

    return (
        <ColumnContext.Provider value={{classEntries: classEntries, level: columnLevel, type: type}}>
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
    const {level, type} = useContext(ColumnContext);
    const cellCSSClass = `header-cell ${type}`;
    const showText = type !== ColumnTypes.FILLER;
    
    return (
        <div className={cellCSSClass}>
            {showText ? (
                <p>{`Level ${level}`}</p>
            ) : (
                null
            )}
        </div>
    )
}

function ColumnBody() {
    const {classEntries, type} = useContext(ColumnContext);
    const bodyCSSClass = `column-body ${type}`;

    return (
        <div className={bodyCSSClass}>
            {classEntries.map((classEntry, classEntryIndex) => {
                return (
                    <Cell key={classEntryIndex} classEntry={classEntry} />
                )
            })}
        </div>
    )
}

function Cell({ classEntry }) {
    const {selectedClassNames, selectClass, setHoveredClassName} = useContext(SelectorContext);
    const {level, type} = useContext(ColumnContext);

    const [name, children] = classEntry;
    const hasChildren = Object.keys(children).length > 0;

    const isSelected = selectedClassNames.includes(name);
    const cellCSSClass = `cell ${type} ${isSelected ? "selected" : "unselected"}`;
    const textCSSClass = `cell-text ${type}`;
    const chevronCSSClass = `chevron ${type}`;

    function handleMouseOver() {
        if (type === ColumnTypes.SELECTION) {
            setHoveredClassName(name);
        }
    }

    function handleMouseOut() {
        if (type === ColumnTypes.SELECTION) {
            setHoveredClassName(null);
        }
    }

    function handleClick() {
        setHoveredClassName(null);
        const selectedClassData = {name: name, children: children};
        selectClass(selectedClassData, level);
    }

    return (
        <div className={cellCSSClass} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClick}>
            <p className={textCSSClass}>{name}</p>
            {hasChildren && <RightChevron className={chevronCSSClass} />}
        </div>
    )
}

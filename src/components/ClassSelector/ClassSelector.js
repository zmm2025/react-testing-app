import { Fragment, createContext, useContext, useEffect, useRef, useState } from "react";
import column1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

const ColumnTypes = Object.freeze({
    SELECTED: "selected",
    SELECTION: "selection",
    PREVIEW: "preview",
    FILLER: "filler"
});

const SelectorContext = createContext({
    selectedClassNames: [],
    selectedClassData: { name: null, children: {} },
    selectClass: () => { },
    hoveredClassName: null,
    setHoveredClassName: () => { }
});

const ColumnContext = createContext({
    classEntries: [],
    level: 1,
    type: ColumnTypes.SELECTION,
    isHoverable: null
});

export default function ClassSelector() {
    const [selectedClassNames, setSelectedClassNames] = useState([]);
    const [selectedClassData, setSelectedClassData] = useState({ name: null, children: {} });
    const [hoveredClassName, setHoveredClassName] = useState(null);
    const selectorRef = useRef(null);
    const selectorCSSClass = "class-selector";

    useEffect(scrollRightIfChildren, [selectedClassNames, selectedClassData]);

    function scrollRightIfChildren() {
        const { children: selectedClassChildren } = selectedClassData;
        const selectedClassHasChildren = Object.keys(selectedClassChildren).length > 0;

        if (selectedClassHasChildren) {
            const centerLevel = selectedClassNames.length + 1;
            centerLevelInView(centerLevel);
        }
    }

    function centerLevelInView(level) {
        const centerElementIndex = 2 * (level - 1);

        const leftElementIndex = centerElementIndex - 2;
        const rightElementIndex = centerElementIndex + 2;

        const leftElement = selectorRef.current.children[leftElementIndex];
        const rightElement = selectorRef.current.children[rightElementIndex];

        leftElement.scrollIntoView();
        rightElement.scrollIntoView();
    }

    function selectClass(classData, level) {
        setSelectedClassData(classData);
        const { name: className, children: classChildren } = classData;
        const isAtFirstLevel = level === 1;
        const hasChildren = Object.keys(classChildren).length > 0;

        const centerLevel = level + (isAtFirstLevel || hasChildren);
        centerLevelInView(centerLevel);

        let newSelectedClassNames = selectedClassNames.slice(0, level - 1);
        newSelectedClassNames.push(className);
        setSelectedClassNames(newSelectedClassNames);
    }

    return (
        <SelectorContext.Provider value={{
            selectedClassNames: selectedClassNames,
            selectedClassData: selectedClassData,
            selectClass: selectClass,
            hoveredClassName: hoveredClassName,
            setHoveredClassName: setHoveredClassName,
        }}>
            <div ref={selectorRef} className={selectorCSSClass}>
                <SelectorElements />
            </div>
        </SelectorContext.Provider>
    );
}

function SelectorElements() {
    const { selectedClassNames, selectedClassData } = useContext(SelectorContext);
    const { children: selectedClassChildren } = selectedClassData;

    let level = 0;
    const dividerOrientation = "vertical";
    const noClassesSelected = selectedClassNames.length === 0;
    const selectedColumnHasChildren = Object.keys(selectedClassChildren).length > 0;

    return (
        <>
            {selectedClassNames.map((_className, classIndex) => {
                return (
                    <Fragment key={classIndex}>
                        <Column type={ColumnTypes.SELECTED} level={++level} />
                        <Divider orientation={dividerOrientation} />
                    </Fragment>
                );
            })}

            {(noClassesSelected || selectedColumnHasChildren) && <>
                <Column type={ColumnTypes.SELECTION} level={++level} />
                <Divider orientation={dividerOrientation} />
            </>}
            <Column type={ColumnTypes.PREVIEW} level={++level} />
            <Divider orientation={dividerOrientation} />
            <Column type={ColumnTypes.FILLER} level={null} />
        </>
    );
}

function Column({ type, level: columnLevel = null }) {
    const { selectedClassNames, selectedClassData, hoveredClassName } = useContext(SelectorContext);
    const { children: selectedClassChildren } = selectedClassData;

    const selectedClassIsChildless = Object.keys(selectedClassChildren).length === 0;

    const classEntries = getColumnClassEntries();
    const isHoverable = getColumnHoverability();
    const columnCSSClass = `column col-${type}`;

    function getColumnClassEntries() {
        const isEmptyPreviewColumn = (type === ColumnTypes.PREVIEW) && (hoveredClassName === null);
        const isFillerColumn = type === ColumnTypes.FILLER;

        if (isEmptyPreviewColumn || isFillerColumn) {
            return [];
        }

        const isPreviewColumnForSelectedLevel = (type === ColumnTypes.PREVIEW) && selectedClassIsChildless;
        let columnClasses = column1Classes;
        for (let level = 1; level <= Math.min(columnLevel - 1, selectedClassNames.length - isPreviewColumnForSelectedLevel); level++) {
            const selectedClassNameAtLevel = selectedClassNames[level - 1];
            columnClasses = columnClasses[selectedClassNameAtLevel];
        }
        if (type === ColumnTypes.PREVIEW) {
            const previewClasses = columnClasses[hoveredClassName];
            columnClasses = previewClasses !== undefined ? previewClasses : {};
        }

        const columnClassEntries = Object.entries(columnClasses);
        return columnClassEntries;
    }

    function getColumnHoverability() {
        const isSelectedColumn = type === ColumnTypes.SELECTED;
        const isSelectionColumn = type === ColumnTypes.SELECTION;
        const isChildlessSelectedColumn = isSelectedColumn && selectedClassIsChildless;
        const isHoverable = isChildlessSelectedColumn || isSelectionColumn;

        return isHoverable;
    }

    return (
        <ColumnContext.Provider value={{
            classEntries: classEntries,
            level: columnLevel,
            type: type,
            isHoverable: isHoverable
        }}>
            <div className={columnCSSClass}>
                <HeaderCell />
                <Divider orientation={"horizontal"} />
                <ColumnBody />
            </div>
        </ColumnContext.Provider>
    );
}

function Divider({ orientation }) {
    const dividerCSSClass = `divider ${orientation}`;

    return (
        <div className={dividerCSSClass} />
    );
}

function HeaderCell() {
    const { level, type } = useContext(ColumnContext);
    const cellCSSClass = `header-cell col-${type}`;
    const showText = type !== ColumnTypes.FILLER;

    return (
        <div className={cellCSSClass}>
            {showText && <p>{`Level ${level}`}</p>}
        </div>
    );
}

function ColumnBody() {
    const { classEntries, type } = useContext(ColumnContext);
    const bodyCSSClass = `column-body col-${type}`;

    return (
        <div className={bodyCSSClass}>
            {classEntries.map((classEntry, classEntryIndex) => {
                return (
                    <Cell key={classEntryIndex} classEntry={classEntry} />
                );
            })}
        </div>
    );
}

function Cell({ classEntry }) {
    const { selectedClassNames, selectClass, setHoveredClassName } = useContext(SelectorContext);
    const { level, type: columnType, isHoverable: columnIsHoverable } = useContext(ColumnContext);

    const [name, children] = classEntry;

    const isSelected = selectedClassNames.includes(name);
    const cellCSSClass = `cell col-${columnType} cell-${isSelected ? "selected" : "unselected"}`;
    const textCSSClass = `cell-text col-${columnType}`;
    const chevronCSSClass = `chevron col-${columnType}`;

    const hasChildren = Object.keys(children).length > 0;

    function handleMouseOver() {
        if (columnIsHoverable) {
            setHoveredClassName(name);
        }
    }

    function handleMouseOut() {
        if (columnIsHoverable) {
            setHoveredClassName(null);
        }
    }

    function handleClick() {
        setHoveredClassName(null);
        const selectedClassData = { name: name, children: children };
        selectClass(selectedClassData, level);
    }

    return (
        <div className={cellCSSClass} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClick}>
            <p className={textCSSClass}>{name}</p>
            {hasChildren && <RightChevron className={chevronCSSClass} />}
        </div>
    );
}

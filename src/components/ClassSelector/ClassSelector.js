import { Fragment, createContext, useContext, useRef, useState } from "react";
import column1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./ClassSelector.css";

const SelectorContext = createContext({
    columnsData: [],
    selectClass: () => null,
    deselectClass: () => null,
    hoverClass: () => null
});

const ColumnContext = createContext({
    level: 0,
    isHoverable: false,
    isPreviewColumn: false,
    columnData: {},
    selectColumnClass: () => null,
    hoverColumnClass: () => null
});

export default function ClassSelector() {
    const emptyColumnData = {
        selectedClassID: null,
        hoveredClassID: null,
        classes: []
    };
    const initialColumnsData = [
        {
            selectedClassID: null,
            hoveredClassID: null,
            classes: column1Classes
        },
        emptyColumnData,
        emptyColumnData,
        emptyColumnData
    ];
    const [columnsData, setColumnsData] = useState(initialColumnsData);
    const selectorRef = useRef(null);
    const selectorCSSClass = "class-selector";

    function centerLevelInView(level) {
        const centerElementIndex = 2 * (level - 1);

        const leftElementIndex = centerElementIndex - 2;
        const rightElementIndex = centerElementIndex + 2;

        const leftElement = selectorRef.current.children[leftElementIndex];
        const rightElement = selectorRef.current.children[rightElementIndex];

        leftElement.scrollIntoView();
        rightElement.scrollIntoView();
    }

    function selectClass(classID, classLevel) {
        let newColumnsData = columnsData.slice(0, classLevel);

        let selectedColumnData = newColumnsData[classLevel - 1];
        selectedColumnData.selectedClassID = classID;

        let newNextColumnData = { ...emptyColumnData };
        const selectedClassIndex = selectedColumnData.classes.findIndex(columnClass => columnClass.id === selectedColumnData.selectedClassID);
        const selectedClass = selectedColumnData.classes[selectedClassIndex];
        newNextColumnData.classes = selectedClass.children;
        newColumnsData.push(newNextColumnData);

        newColumnsData.push(emptyColumnData);
        newColumnsData.push(emptyColumnData);

        const isAtFirstLevel = classLevel === 1;
        const hasChildren = selectedClass.children.length > 0;
        const levelToCenter = classLevel + (isAtFirstLevel || hasChildren);
        centerLevelInView(levelToCenter);

        setColumnsData(newColumnsData);
    }

    function deselectClass(classLevel) {
        let newColumnsData = columnsData.slice(0, classLevel);

        let deselectedColumnData = newColumnsData[classLevel - 1];
        deselectedColumnData.selectedClassID = null;

        newColumnsData.push(emptyColumnData);
        newColumnsData.push(emptyColumnData);

        const isAtFirstLevel = classLevel === 1;
        const levelToCenter = classLevel + isAtFirstLevel;
        centerLevelInView(levelToCenter);

        setColumnsData(newColumnsData);
    }

    function hoverClass(classID, level) {
        let newColumnsData = JSON.parse(JSON.stringify(columnsData)); // deep copy

        let hoveredColumnData = newColumnsData[level - 1];
        hoveredColumnData.hoveredClassID = classID;

        const hoveredClassIndex = hoveredColumnData.classes.findIndex(columnClass => columnClass.id === classID);
        newColumnsData[level].classes = (hoveredClassIndex === -1) ? [] : hoveredColumnData.classes[hoveredClassIndex].children;

        setColumnsData(newColumnsData);
    }

    return (
        <SelectorContext.Provider value={{
            columnsData: columnsData,
            selectClass: selectClass,
            deselectClass: deselectClass,
            hoverClass: hoverClass
        }}>
            <div ref={selectorRef} className={selectorCSSClass}>
                <SelectorElements />
            </div>
        </SelectorContext.Provider>
    );
}

function SelectorElements() {
    const { columnsData } = useContext(SelectorContext);
    let level = 1;
    const dividerOrientation = "vertical";

    return (
        <>
            {columnsData.map((_columnData, columnIndex) => {
                const isLastColumn = (columnIndex + 1) === columnsData.length;
                return (
                    <Fragment key={columnIndex}>
                        <Column level={level++} />
                        {!isLastColumn && <Divider orientation={dividerOrientation} />}
                    </Fragment>
                );
            })}
            <FixedButton
                type="tonal"
                text="Back"
                handleClick={() => null}
                xSide="left"
                ySide="bottom"
            />
            <FixedButton
                type="filled"
                text="Select tag"
                handleClick={() => null}
                xSide="right"
                ySide="bottom"
            />
        </>
    );
}

function FixedButton({ type = "filled", text, handleClick, xSide, ySide }) {
    const cssClassName = `fixed-button ${type}`;
    const xSideOffset = "calc(10vw + 16px)";
    const ySideOffset = "calc(10vh + 16px)";
    const cssStyle = { [xSide]: xSideOffset, [ySide]: ySideOffset };

    return (
        <button className={cssClassName} style={cssStyle} onClick={handleClick}>{text}</button>
    );
}

function Column({ level }) {
    const { columnsData } = useContext(SelectorContext);
    const columnData = columnsData[level - 1];
    const hasClasses = columnData.classes.length > 0;
    const columnCSSClass = "column" + (hasClasses ? "" : " empty");
    const dividerCSSClass = "horizontal";

    function getColumnHoverability(level) {
        const columnData = columnsData[level - 1];
        if (columnData.selectedClassID !== null) {
            let selectedClass = null;
            for (let columnClass of columnData.classes) {
                if (columnClass.id === columnData.selectedClassID) {
                    selectedClass = columnClass;
                    break;
                }
            }
            const selectedClassIsChildless = selectedClass.children.length === 0;
            return selectedClassIsChildless;

        } else {
            if (level === 1) {
                return true;
            }

            const previousColumnData = columnsData[level - 2];
            const previousColumnHasSelectedClass = previousColumnData.selectedClassID !== null;
            return previousColumnHasSelectedClass;
        }
    }

    function getColumnPreviewability(level) {
        if (level === 1) {
            return false;
        }

        const previousColumnIsHoverable = getColumnHoverability(level - 1);
        return previousColumnIsHoverable;
    }

    return (
        <ColumnContext.Provider value={{
            level: level,
            isHoverable: getColumnHoverability(level),
            isPreviewColumn: getColumnPreviewability(level),
            columnData: columnData,
        }}>
            <div className={columnCSSClass}>
                <HeaderCell />
                <Divider orientation={dividerCSSClass} />
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
    const { level, columnData } = useContext(ColumnContext);
    const columnHasClasses = columnData.classes.length > 0;
    const cellCSSClass = "header-cell";

    return (
        <div className={cellCSSClass}>
            {columnHasClasses && <p>{`Level ${level}`}</p>}
        </div>
    );
}

function ColumnBody() {
    const { columnData } = useContext(ColumnContext);
    const bodyCSSClass = "column-body";

    return (
        <div className={bodyCSSClass}>
            {columnData.classes.map((columnClass, columnClassIndex) => {
                return (
                    <Cell key={columnClassIndex} cellClass={columnClass} />
                );
            })}
        </div>
    );
}

function Cell({ cellClass }) {
    const { selectClass, deselectClass, hoverClass } = useContext(SelectorContext);
    const { level, isHoverable, isPreviewColumn, columnData } = useContext(ColumnContext);
    const classHasChildren = cellClass.children.length > 0;
    const classIsSelected = columnData.selectedClassID === cellClass.id;
    const cellCSSClass = `cell cell-${classIsSelected ? "selected" : "unselected"}`;
    const textCSSClass = "cell-text" + (isPreviewColumn ? " col-preview" : "");
    const chevronCSSClass = "chevron" + (isPreviewColumn ? " col-preview" : "");

    function handleMouseOver() {
        if (isHoverable) {
            hoverClass(cellClass.id, level);
        }
    }

    function handleMouseOut() {
        if (isHoverable) {
            hoverClass(null, level);
        }
    }

    function handleClick() {
        if (columnData.selectedClassID === cellClass.id) {
            deselectClass(level);
        } else {
            selectClass(cellClass.id, level);
        }
    }

    return (
        <button
            className={cellCSSClass}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
        >
            <p className={textCSSClass}>{cellClass.name}</p>
            {classHasChildren && <RightChevron className={chevronCSSClass} />}
        </button>
    );
}

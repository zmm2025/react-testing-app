import { Fragment, createContext, useContext, useRef, useState } from "react";
import column1Classes from "../../data/classes.json";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import Button from "../Button/Button";
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

export default function ClassSelector({ initialClassPath, stageClassPath }) {
    const emptyColumnData = {
        selectedClassID: null,
        hoveredClassID: null,
        classes: []
    };
    const initialColumnsData = classPathToColumnsData(initialClassPath);
    const [columnsData, setColumnsData] = useState(initialColumnsData);
    const selectorRef = useRef(null);
    const selectorCSSClass = "class-selector";
    let level = 1;
    const dividerOrientation = "vertical";
    const classesAreSelected = columnsData[0].selectedClassID !== null;


    function classPathToColumnsData(classPath) {
        if (classPath.length === 0) {
            const columnsData = [
                {
                    selectedClassID: null,
                    hoveredClassID: null,
                    classes: column1Classes
                },
                emptyColumnData,
                emptyColumnData,
                emptyColumnData
            ];
            return columnsData;
        }

        const selectedColumnsData = classPath.map((pathClass, classIndex) => {
            let columnClasses = column1Classes;
            if (classIndex > 0) {
                const previousClass = classPath[classIndex - 1];
                columnClasses = previousClass.children;
            }
            
            return {
                selectedClassID: pathClass.id,
                hoveredClassID: null,
                classes: columnClasses
            }
        });
        const columnsData = [
            ...selectedColumnsData,
            emptyColumnData,
            emptyColumnData
        ];
        return columnsData;
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

    function selectClass(id, level) {
        let newColumnsData = columnsData.slice(0, level);

        let selectedColumnData = newColumnsData[level - 1];
        selectedColumnData.selectedClassID = id;

        let newNextColumnData = { ...emptyColumnData };
        const selectedClass = selectedColumnData.classes.find(columnClass => columnClass.id === selectedColumnData.selectedClassID);
        newNextColumnData.classes = selectedClass.children;
        newColumnsData.push(newNextColumnData);

        newColumnsData.push(emptyColumnData);
        newColumnsData.push(emptyColumnData);

        const isAtFirstLevel = level === 1;
        const hasChildren = selectedClass.children.length > 0;
        const levelToCenter = level + (isAtFirstLevel || hasChildren);
        centerLevelInView(levelToCenter);

        setColumnsData(newColumnsData);
    }

    function deselectClass(level = null) {
        if (level === null) {
            const lastSelectedLevel = columnsData.findIndex(columnData => columnData.selectedClassID === null);
            level = lastSelectedLevel;

            if (level === 0) {
                return;
            }
        }

        let newColumnsData = columnsData.slice(0, level);

        let deselectedColumnData = newColumnsData[level - 1];
        deselectedColumnData.selectedClassID = null;

        newColumnsData.push(emptyColumnData);
        newColumnsData.push(emptyColumnData);

        const isAtFirstLevel = level === 1;
        const levelToCenter = level + isAtFirstLevel;
        centerLevelInView(levelToCenter);

        setColumnsData(newColumnsData);
    }

    function hoverClass(id, level) {
        let newColumnsData = JSON.parse(JSON.stringify(columnsData)); // deep copy

        let hoveredColumnData = newColumnsData[level - 1];
        hoveredColumnData.hoveredClassID = id;

        const hoveredClass = hoveredColumnData.classes.find(columnClass => columnClass.id === id);
        newColumnsData[level].classes = (hoveredClass === undefined) ? [] : hoveredClass.children;

        setColumnsData(newColumnsData);
    }

    function stageSelectedClass() {
        const unfilteredClassPath = columnsData.map((columnData) => {
            let selectedClass = null;
            if (columnData.selectedClassID !== null) {
                selectedClass = columnData.classes.find(columnClass => columnClass.id === columnData.selectedClassID)
            }
            return selectedClass;
        });
        const classPath = unfilteredClassPath.filter(pathClass => pathClass !== null);
        stageClassPath(classPath);
    }

    return (
        <SelectorContext.Provider value={{
            columnsData: columnsData,
            selectClass: selectClass,
            deselectClass: deselectClass,
            hoverClass: hoverClass
        }}>
            <div ref={selectorRef} className={selectorCSSClass}>
                {columnsData.map((_columnData, columnIndex) => {
                    const isLastColumn = (columnIndex + 1) === columnsData.length;
                    return (
                        <Fragment key={columnIndex}>
                            <Column level={level++} />
                            {!isLastColumn && <Divider orientation={dividerOrientation} />}
                        </Fragment>
                    );
                })}
                <Button
                    type="tonal"
                    text="Back"
                    onClick={deselectClass}
                    enabled={classesAreSelected}
                    style={{
                        position: "absolute",
                        left: "calc(10vw + 16px)",
                        bottom: "calc(10vh + 16px)"
                    }}
                />
                <Button
                    type="filled"
                    text="Select class"
                    onClick={stageSelectedClass}
                    enabled={classesAreSelected}
                    style={{
                        position: "absolute",
                        right: "calc(10vw + 16px)",
                        bottom: "calc(10vh + 16px)"
                    }}
                />
            </div>
        </SelectorContext.Provider>
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

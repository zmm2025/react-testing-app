import { Fragment } from "react";
import Button from "../Button/Button";
import "./ConfirmationWindow.css";

export default function ConfirmationWindow({ stagedClassPath, stageClassPath, confirmClassPath, selectionSource }) {
    function clearClassPath() {
        stageClassPath([]);
    }
    
    return (
        <div className="confirmation-window">
            <ContentPreview />
            <ClassPathText classPath={stagedClassPath}/>
            <BlameText source={selectionSource}/>
            <ActionButtons onConfirm={confirmClassPath} onModify={clearClassPath}/>
        </div>
    );
}

function ContentPreview() {
    return (
        null
    );
}

function ClassPathText({ classPath }) {
    const cssClassName = "class-path-text";
    const delimiterCSSClassName = "delimiter";
    const textCSSClassName = "text";
    
    return (
        <div className={cssClassName}>
            {classPath.map((pathClass, index) => {
                const isFirstClass = index === 0;
                return (
                    <Fragment key={index}>
                        {!isFirstClass && <p className={delimiterCSSClassName}> &gt; </p>} {/* "&gt;" == ">" */}
                        <p className={textCSSClassName}>{pathClass.name}</p>
                    </Fragment>
                )
            })}
        </div>
    );
}

function BlameText({ source }) {
    const cssClassName = `blame-text ${source === "AVAIL AI" ? "avail" : "other"}`;
    
    return (
        <p className={cssClassName}>Assigned by {source}</p>
    );
}

function ActionButtons({ onConfirm, onModify }) {
    const cssClassName = "action-buttons";

    return (
        <div className={cssClassName}>
            <Button
                type="filled"
                text="Confirm"
                onClick={onConfirm}
            />
            <Button
                type="tonal"
                text="Modify"
                onClick={onModify}
            />
        </div>
    );
}


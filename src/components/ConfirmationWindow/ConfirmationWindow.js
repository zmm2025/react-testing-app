import { Fragment } from "react";
import "./ConfirmationWindow.css";

export default function ConfirmationWindow({ stagedClassPath, confirmClassPath, selectionSource }) {
    return (
        <div className="confirmation-window">
            <ContentPreview />
            <ClassPathText classPath={stagedClassPath}/>
            <BlameText source={selectionSource}/>
            <ActionButtons />
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

function ActionButtons() {
    return (
        null
    );
}


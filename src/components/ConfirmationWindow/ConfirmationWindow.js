import { Fragment } from "react";
import "./ConfirmationWindow.css";

export default function ConfirmationWindow({ stagedClassPath, confirmClassPath }) {
    return (
        <div className="confirmation-window">
            <ContentPreview />
            <ClassPathText classPath={stagedClassPath}/>
            <BlameText />
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
    const delimiterCSSClassName = "divider";
    
    return (
        <div className={cssClassName}>
            {classPath.map((pathClass, index) => {
                const isFirstClass = index !== 0;
                return (
                    <Fragment key={index}>
                        {!isFirstClass && <p className={delimiterCSSClassName}> &gt; </p>} {/* "&gt;" == ">" */}
                        <p>{pathClass.name}</p>
                    </Fragment>
                )
            })}
        </div>
    );
}

function BlameText() {
    return (
        null
    );
}

function ActionButtons() {
    return (
        null
    );
}


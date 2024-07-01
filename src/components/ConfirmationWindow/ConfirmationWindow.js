import "./ConfirmationWindow.css";

export default function ConfirmationWindow({ stagedClassPath, confirmClassPath }) {
    return (
        <div className="confirmation-window">
            <ContentPreview />
            <ClassPathText />
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

function ClassPathText() {
    return (
        null
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


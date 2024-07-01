import "./Button.css";

export default function Button({ type = "filled", text, onClick, enabled = true, style }) {
    const enabledString = enabled ? "enabled" : "disabled";
    const cssClassName = `button ${type} ${enabledString}`;

    function runOnClickIfEnabled() {
        if (enabled) {
            onClick();
        }
    }

    return (
        <button className={cssClassName} style={style} onClick={runOnClickIfEnabled}>{text}</button>
    );
}

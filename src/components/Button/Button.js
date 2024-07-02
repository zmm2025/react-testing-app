import "./Button.css";

export default function Button({ type = "filled", text, onClick, enabled = true, style = {} }) {
    const toggle = enabled ? "enabled" : "disabled";
    const cssClassName = `button ${type} ${toggle}`;

    function runOnClickIfEnabled() {
        if (enabled) {
            onClick();
        }
    }

    return (
        <button className={cssClassName} style={style} onClick={runOnClickIfEnabled}>
            {text}
        </button>
    );
}

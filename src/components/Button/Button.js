import { ReactComponent as LeftChevron } from "../../images/chevron_left.svg";
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";
import "./Button.css";

export default function Button({
    type = "filled",
    text,
    onClick,
    arrow = null,
    enabled = true,
    style = {},
}) {
    const toggle = enabled ? "enabled" : "disabled";
    const cssClassName = `button ${type} ${toggle}` + (arrow ? ` ${arrow}` : "");
    const chevronCSSClass = `chevron ${type} ${toggle}`;

    function runOnClickIfEnabled() {
        if (enabled) {
            onClick();
        }
    }

    return (
        <button className={cssClassName} style={style} onClick={runOnClickIfEnabled}>
            {arrow === "left" && <LeftChevron className={chevronCSSClass} />}
            {text}
            {arrow === "right" && <RightChevron className={chevronCSSClass} />}
        </button>
    );
}

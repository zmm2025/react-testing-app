import './SelectorCell.css';
import { ReactComponent as RightChevron } from "../../images/chevron_right.svg";

export default function SelectorCell({ classPath, classText, onClick, hasChildren }) {
    const cellClass = classPath.includes(classText) ? "cell selected" : "cell unselected";

    return (
        <div className={cellClass} onClick={onClick}>
            <p className="text">{classText}</p>
            {hasChildren && <RightChevron className="icon" />}
        </div>
    );
}

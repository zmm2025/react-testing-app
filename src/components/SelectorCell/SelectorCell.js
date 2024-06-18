import './SelectorCell.css';

export default function SelectorCell({ classText, onClick, classPath }) {
    return (
        <div className={classPath.includes(classText) ? "cell selected" : "cell unselected"} onClick={onClick}>
            {classText}
        </div>
    );
}

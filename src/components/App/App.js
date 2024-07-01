import { useState } from "react";
import ClassSelector from "../ClassSelector/ClassSelector";
import ConfirmationWindow from "../ConfirmationWindow/ConfirmationWindow";
import "./App.css";

export default function App() {
    const initialStagedClassPath = [];
    const [stagedClassPath, setStagedClassPath] = useState(initialStagedClassPath);
    const initialSelectionSource = "AVAIL AI";
    const [selectionSource, setSelectionSource] = useState(initialSelectionSource);

    function confirmClassPath() {
        return null;
    }

    function stageClassPath(classPath) {
        setStagedClassPath(classPath);
        setSelectionSource("you");
    }

    return (
        <div className="app">
            {stagedClassPath.length > 0 ? (
                <ConfirmationWindow
                    stagedClassPath={stagedClassPath}
                    confirmClassPath={confirmClassPath}
                    selectionSource={selectionSource}
                />
            ) : (
                <ClassSelector stageClassPath={stageClassPath} />
            )}
        </div>
    );
}

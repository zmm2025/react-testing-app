import { useState } from "react";
import ClassSelector from "../ClassSelector/ClassSelector";
import ConfirmationWindow from "../ConfirmationWindow/ConfirmationWindow";
import "./App.css";

export default function App() {
    const initialStagedClassPath = [];
    const initialSelectionSource = "AVAIL AI";
    const [stagedClassPath, setStagedClassPath] = useState(initialStagedClassPath);
    const [pathIsStaged, setPathIsStaged] = useState(false);
    const [selectionSource, setSelectionSource] = useState(initialSelectionSource);

    function confirmClassPath() {
        return null;
    }

    function stageClassPath(classPath) {
        setStagedClassPath(classPath);
        setSelectionSource("you");
        setPathIsStaged(true);
    }

    function unstageClassPath() {
        setPathIsStaged(false);
    }

    return (
        <div className="app">
            {pathIsStaged ? (
                <ConfirmationWindow
                    stagedClassPath={stagedClassPath}
                    unstageClassPath={unstageClassPath}
                    confirmClassPath={confirmClassPath}
                    selectionSource={selectionSource}
                />
            ) : (
                <ClassSelector initialClassPath={stagedClassPath} stageClassPath={stageClassPath} />
            )}
        </div>
    );
}

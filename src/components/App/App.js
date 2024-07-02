import { useState } from "react";
import samplePath from "../../data/sample-path.json";
import ClassSelector from "../ClassSelector/ClassSelector";
import ConfirmationWindow from "../ConfirmationWindow/ConfirmationWindow";
import "./App.css";

export default function App() {
    const initialStagedClassPath = samplePath;
    const initialSelectionSource = "AVAIL AI";
    const [stagedClassPath, setStagedClassPath] = useState(initialStagedClassPath);
    // Keep this as "useState(true)" once AI class path assignment is linked:
    const [pathIsStaged, setPathIsStaged] = useState(true);
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

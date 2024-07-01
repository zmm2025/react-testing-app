import { useState } from "react";
import ClassSelector from "../ClassSelector/ClassSelector";
import ConfirmationWindow from "../ConfirmationWindow/ConfirmationWindow";
import "./App.css";

export default function App() {
    const initialStagedClassPath = [];
    const [stagedClassPath, setStagedClassPath] = useState(initialStagedClassPath);

    function confirmClassPath() {
        return null;
    }

    return (
        <div className="app">
            {stagedClassPath.length > 0 ? (
                <ConfirmationWindow stagedClassPath={stagedClassPath} confirmClassPath={confirmClassPath} />
            ) : (
                <ClassSelector stageClassPath={setStagedClassPath} />
            )}
        </div>
    );
}

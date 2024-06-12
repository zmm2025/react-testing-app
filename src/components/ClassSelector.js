// Import assets
import '../assets/styles/class-selector.css';

export default function ClassSelector() {
    return (
        <table className="class-selector">
            <thead>
                <tr>
                    {headerCells}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                </tr>
                <tr>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                    <td>Value</td>
                </tr>
            </tbody>
        </table>
    )
}

// Define classes data
const classesData = {
    "Site Products": {
        "Ground Anchorages": {
            "Retaining Stabilizing Ground Anchors": {
                "Retaining Stabilizing Ground Components": {
                    "Stabilizing Ground Anchor Heads": {

                    },
                    "Stabilizing Ground Tendons": {

                    },
                },
                "Stabilizing Ground Grouted Anchors": {

                },
                "Stabilizing Ground Plate Anchors": {

                },
            },
            "Earth Reinforcement Anchors": {

            },
        },
        "Ground Improvement Products": {

        },
        "Sheeting and Revetments": {

        },
    },
    "Structural and Exterior Enclosure Products": {

    },
    "Interior and Finish Products": {

    },
}
const classesDataDepth = 5;

// Generate header cells
let headerCells = [];
for (let level = 1; level <= classesDataDepth; level++) {
    headerCells.push(<th>Level {level}</th>);
}

// Import assets
import '../assets/styles/class-selector.css';

export default function ClassSelector() {
    return (
        <table className="class-selector">
            <thead>
                <tr>
                    <th>Level 1</th>
                    <th>Level 2</th>
                    <th>Level 3</th>
                    <th>Level 4</th>
                    <th>Level 5</th>
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
const classDataDepth = 5;

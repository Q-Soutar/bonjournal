import { useState } from "react";
import EntryCard from "../EntryCard/EntryCard";
import TimelineEnd from "./TimelineEnd";
import TimelineEntry from "./TimelineEntry";

const Timeline = function (props) {
    if (props.entries !== []) {
        return (
            <div>
                {props.entries.map((entry) => {
                    return (
                        <TimelineEntry
                            entry={entry}
                            deleteEntry={props.deleteEntry}
                            submitFunction={props.editEntry}
                            key={entry.uuid}
                            startCardMode={"DISPLAY"}
                        />
                    );
                })}
                <TimelineEnd />
            </div>
        );
    } else {
        return "No entries";
    }
};

export default Timeline;

import React from "react";
import { attributes, react as DashcamContent } from "../content/dashcam.md";
import Lessons from "../components/Lessons";

export default () => {
  let { title, date, lessons } = attributes;
  return (
    <div className="main">
      <h1>{title}</h1>
      <h2>{date}</h2>
      <DashcamContent />
      <Lessons lessons={lessons} />
    </div>
  );
};

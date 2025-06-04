import React from "react";
import { attributes, react as CapstoneContent } from "../content/capstone.md";
import Lessons from "../components/Lessons";

function Capstone() {
  let { title, date, lessons } = attributes;
  return (
    <div>
      <h1>{title}</h1>
      <h2>{date}</h2>
      <CapstoneContent />
      <Lessons lessons={lessons} />
    </div>
  );
}

export default Capstone;

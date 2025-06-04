
import React from 'react';
import { attributes, react as ScraperContent } from '../content/microsemi.md';
import Lessons from '../components/Lessons';

export default () => {
    let { title, date, lessons } = attributes;

    return (
        <div>
            <h1>{title}</h1>
            <h2>{date}</h2>
            <ScraperContent />
            <Lessons lessons={lessons} />
        </div>
    );
}

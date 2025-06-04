import React from 'react';
import { attributes, react as PopularMovies } from '../content/popular_movies.md';
import Lessons from '../components/Lessons';

export default () => {
    let { title, date, lessons } = attributes;

    return (
        <div>
            <h1>{title}</h1>
            <h2>{date}</h2>
            <PopularMovies />
            <Lessons lessons={lessons} />
        </div>
    );
}

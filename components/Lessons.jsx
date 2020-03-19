const Lessons = ({ lessons }) => {
    const shouldDisplay = lessons && lessons.length > 0;
    let lessonsTitle = shouldDisplay ? <h2>Lessons Learned:</h2> : '';

    return (
        <div className="lessons">
            {lessonsTitle}
            {
                shouldDisplay &&
                lessons.map((lesson, idx) => {
                    return (
                        <div key={lesson + idx} className="lesson">
                            <h3>{lesson.lesson}</h3>
                            <p>
                                {lesson.description}
                            </p>
                        </div>
                    );
                })
            }
        </div>
    );
}


export default Lessons;

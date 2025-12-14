import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ targetRef }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!targetRef.current) return;

            const element = targetRef.current;
            const scrollTop = element.scrollTop;
            const scrollHeight = element.scrollHeight - element.clientHeight;

            if (scrollHeight > 0) {
                const p = (scrollTop / scrollHeight) * 100;
                setProgress(p);
            } else {
                setProgress(0);
            }
        };

        const element = targetRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
        }

        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll);
            }
        };
    }, [targetRef]);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${progress}%`,
            height: '4px',
            backgroundColor: 'var(--highlight-color)',
            zIndex: 9999,
            transition: 'width 0.1s ease-out'
        }}
        />
    );
};

ProgressBar.propTypes = {
    targetRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Object) })
    ]).isRequired
};

export default ProgressBar;

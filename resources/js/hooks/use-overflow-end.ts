import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether a horizontally scrolling box still has content hidden past its right edge.
 */
export function useOverflowEnd<E extends HTMLElement>() {
    const ref = useRef<E>(null);
    const [hasOverflowEnd, setHasOverflowEnd] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const update = () =>
            setHasOverflowEnd(
                element.scrollLeft + element.clientWidth <
                    element.scrollWidth - 1,
            );

        update();
        element.addEventListener('scroll', update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(element);

        if (element.firstElementChild) {
            observer.observe(element.firstElementChild);
        }

        return () => {
            element.removeEventListener('scroll', update);
            observer.disconnect();
        };
    }, []);

    return { ref, hasOverflowEnd };
}

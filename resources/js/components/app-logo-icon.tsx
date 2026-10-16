import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="4" fill="#07305d" />
            <polyline
                points="10,19 26,32 10,45"
                fill="none"
                stroke="#f3f2f2"
                strokeWidth="5.5"
            />
            <path
                d="M35.5 14V41M35.5 16.5H42a6.5 6.5 0 010 13H35.5M43 30L51 41"
                fill="none"
                stroke="#f3f2f2"
                strokeWidth="5"
            />
            <rect x="33" y="46" width="21" height="5.5" fill="#eaa159" />
        </svg>
    );
}

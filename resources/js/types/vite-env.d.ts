/// <reference types="vite/client" />

declare module 'virtual:solar-icons' {
    import type { IconifyJSON } from '@iconify/react/offline';

    const collection: IconifyJSON;
    export default collection;
}

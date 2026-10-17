import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig, lazyPlugins } from 'vite-plus';

/**
 * Bundles only the Solar icons referenced in resources/js (as `solar:name`)
 * into `virtual:solar-icons`, so icons render offline without hitting the
 * Iconify API or shipping the full 11MB icon set.
 */
function solarIcons(): Plugin {
    const virtualId = 'virtual:solar-icons';
    const resolvedId = `\0${virtualId}`;
    const sourceDir = join(import.meta.dirname, 'resources/js');
    const iconSet = createRequire(import.meta.url)(
        '@iconify-json/solar/icons.json',
    ) as {
        prefix: string;
        width?: number;
        height?: number;
        icons: Record<string, unknown>;
        aliases?: Record<string, { parent: string }>;
    };

    const scanUsedIcons = (): string[] => {
        const names = new Set<string>();

        for (const file of readdirSync(sourceDir, { recursive: true })) {
            if (!/\.(tsx?|jsx?)$/.test(String(file))) {
                continue;
            }

            const contents = readFileSync(
                join(sourceDir, String(file)),
                'utf8',
            );

            for (const match of contents.matchAll(/solar:([a-z0-9-]+)/g)) {
                names.add(match[1]);
            }
        }

        return [...names].sort();
    };

    const buildCollection = (names: string[]): string => {
        const icons: Record<string, unknown> = {};
        const aliases: Record<string, { parent: string }> = {};

        for (let name of names) {
            while (iconSet.aliases?.[name] && !aliases[name]) {
                aliases[name] = iconSet.aliases[name];
                name = iconSet.aliases[name].parent;
            }

            if (iconSet.icons[name]) {
                icons[name] = iconSet.icons[name];
            }
        }

        return JSON.stringify({
            prefix: iconSet.prefix,
            width: iconSet.width,
            height: iconSet.height,
            icons,
            aliases,
        });
    };

    let usedIcons = scanUsedIcons();

    return {
        name: 'solar-icons',
        resolveId(id) {
            return id === virtualId ? resolvedId : undefined;
        },
        load(id) {
            if (id !== resolvedId) {
                return undefined;
            }

            usedIcons = scanUsedIcons();

            return `export default ${buildCollection(usedIcons)};`;
        },
        configureServer(server) {
            const refresh = (file: string): void => {
                if (!file.startsWith(sourceDir)) {
                    return;
                }

                const latest = scanUsedIcons();

                if (latest.join() === usedIcons.join()) {
                    return;
                }

                usedIcons = latest;
                const module = server.moduleGraph.getModuleById(resolvedId);

                if (module) {
                    server.moduleGraph.invalidateModule(module);
                }

                server.ws.send({ type: 'full-reload' });
            };

            server.watcher.on('change', refresh);
            server.watcher.on('add', refresh);
        },
    };
}

export default defineConfig({
    plugins: lazyPlugins(() => [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Inter', {
                    weights: [400, 500, 600, 700],
                    preload: [{ weight: 400 }, { weight: 500 }],
                }),
                bunny('Google Sans', {
                    weights: [400, 500, 600, 700],
                    preload: [{ weight: 600 }],
                }),
                bunny('IBM Plex Mono', {
                    weights: [400, 500, 600],
                    preload: false,
                }),
            ],
        }),
        inertia(),
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        solarIcons(),
    ]),
    server: {
        watch: {
            ignored: [
                '**/.agents/**',
                '**/.claude/**',
                '**/.cursor/**',
                '**/.junie/**',
                '**/vendor/**',
            ],
        },
    },
    lint: {
        ignorePatterns: [
            'vendor/**',
            'node_modules/**',
            'public/**',
            'bootstrap/ssr/**',
            'tailwind.config.js',
            'resources/js/actions/**',
            'resources/js/components/ui/*',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
        ],
        options: {
            denyWarnings: true,
            typeAware: true,
        },
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        semi: true,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        ignorePatterns: [
            '.github/**',
            'composer.json',
            'resources/js/components/ui/*',
            'resources/views/mail/*',
        ],
        sortTailwindcss: {
            functions: ['clsx', 'cn', 'cva'],
            stylesheet: 'resources/css/app.css',
        },
    },
});

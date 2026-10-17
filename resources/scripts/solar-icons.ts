/**
 * Writes only the Solar icons referenced in resources/js (as `solar:name`)
 * to resources/js/lib/solar-icons.json, so icons render offline without
 * hitting the Iconify API or shipping the full 11MB icon set.
 *
 * Run with `bun run icons` after adding a new `solar:` icon.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

type IconSet = {
    prefix: string;
    width?: number;
    height?: number;
    icons: Record<string, unknown>;
    aliases?: Record<string, { parent: string }>;
};

const sourceDir = join(import.meta.dirname, '../js');
const outputFile = join(sourceDir, 'lib/solar-icons.json');
const iconSet = createRequire(import.meta.url)(
    '@iconify-json/solar/icons.json',
) as IconSet;

const scanUsedIcons = (): string[] => {
    const names = new Set<string>();

    for (const file of readdirSync(sourceDir, { recursive: true })) {
        if (!/\.(tsx?|jsx?)$/.test(String(file))) {
            continue;
        }

        const contents = readFileSync(join(sourceDir, String(file)), 'utf8');

        for (const match of contents.matchAll(/solar:([a-z0-9-]+)/g)) {
            names.add(match[1]);
        }
    }

    return [...names].sort();
};

const buildCollection = (names: string[]): IconSet => {
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

    return {
        prefix: iconSet.prefix,
        width: iconSet.width,
        height: iconSet.height,
        icons,
        aliases,
    };
};

const collection = buildCollection(scanUsedIcons());

writeFileSync(outputFile, `${JSON.stringify(collection, null, 4)}\n`);

console.log(
    `Wrote ${Object.keys(collection.icons).length} Solar icons to ${outputFile}`,
);

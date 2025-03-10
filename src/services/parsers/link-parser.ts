import { warn, info, error as logError } from '../../support/logger';

interface ParsedLink {
    link: string;
    name: string;
}

export function parseLinks(output: string): ParsedLink[] | undefined {
    // Extract links from output
    const links = output.match(/https?:[^\s|]+/gm);
    if (!links) {
        warn('No links found in the output');
        return undefined;
    }
    info(`Found ${links.length} links`);

    // Parse each link to extract name
    const parsedLinks = links.map(link => {
        const nameMatch = link.match(/^https?:\/\/([^.]+)\./);
        if (!nameMatch) {
            const errorMessage = `Failed to parse name from link: ${link}`;
            logError(errorMessage);
            throw new Error(errorMessage);
        }

        return {
            link,
            name: nameMatch[1]
        };
    });

    return parsedLinks;
}

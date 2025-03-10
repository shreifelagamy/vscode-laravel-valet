import { info } from '../../support/logger';

export function parseVersions(output: string): string[] {
    // Try to match full php version format first
    const phpVersionRegex = /php@([0-9.0-9]+)/gm;
    let versions = [...output.matchAll(phpVersionRegex)];

    // If no matches, try basic version format
    if (versions.length === 0) {
        info('No php@ versions found, falling back to basic version pattern');
        const fallbackVersionRegex = /([0-9]+\.[0-9]+)/gm;
        versions = [...output.matchAll(fallbackVersionRegex)];
    }

    // Extract version strings from matches
    const versionStrings = versions.map(match => match[1]);
    info(`Found ${versionStrings.length} PHP versions`);

    return versionStrings;
}

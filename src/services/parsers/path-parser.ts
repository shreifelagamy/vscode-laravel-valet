import { warn, info } from '../../support/logger';
import type { PathMapping } from '../../types/valet';

export function parsePaths(output: string): PathMapping[] | undefined {
    // Parse paths using regex
    const result = output.match(/\/{1}[^\s|.]+/gm);
    if (!result) {
        warn('No valet links found in command output');
        return undefined;
    }
    info(`Found ${result.length / 2} path entries`);

    // Convert to PathMapping array
    const pathsArr: PathMapping[] = [];
    for (let index = 0; index < result.length; index += 2) {
        pathsArr.push({
            key: result[index],
            value: result[index + 1]
        });
    }

    // Clean up paths
    const cleanPaths = pathsArr.map(element => ({
        key: element.key.replace("//", ""),
        value: element.value
    }));

    info(`Processed ${cleanPaths.length} path mappings`);
    return cleanPaths;
}

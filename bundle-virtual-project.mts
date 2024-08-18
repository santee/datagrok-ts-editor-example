import { readdir, stat, readFile, rm, copyFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path'


async function* getDtsFiles(path: string, exceptions: string[]): AsyncGenerator<{content: string, path: string}> {
    try {
        const entries = await readdir(path);
        for (const entry of entries) {
            const entryPath = join(path, entry)

            if (exceptions.find(x => entryPath.endsWith(x))) {
                continue;
            }

            const entryStat = await stat(entryPath)
            if (entryStat.isFile() && (entry.endsWith(".d.ts") || entry == "package.json")) {
                const content = (await readFile(entryPath)).toString()
                yield { content: content, path: join(path, entry )}
            } else if (entryStat.isDirectory()) {
                for await (const child of getDtsFiles(entryPath, exceptions)) {
                    yield child
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function copyDefinitionFiles(packageName: string, exceptions: string[]) {
    const modulePath = join('node_modules', packageName)

    for await (const e of getDtsFiles(modulePath, exceptions)) {
        const outputPath = join("files", "virtual-project", e.path)

        await mkdir(dirname(outputPath), { recursive: true })

        await copyFile(e.path, outputPath)
    }
}

async function createExternalLibsFile() {
    await rm(join("files", "virtual-project", "node_modules"), { recursive: true, force: true })
    const packages = ['datagrok-api']
    await Promise.all(packages.map(x => copyDefinitionFiles(x, [join("node_modules","typescript")])))
}

createExternalLibsFile()

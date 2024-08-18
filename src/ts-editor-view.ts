import * as monaco from 'monaco-editor'
import {languages} from "monaco-editor";
import ScriptTarget = languages.typescript.ScriptTarget;
import ModuleKind = languages.typescript.ModuleKind;
import ModuleResolutionKind = languages.typescript.ModuleResolutionKind;
import JsxEmit = languages.typescript.JsxEmit;
import {FileInfo, Package} from "datagrok-api/dg";

self.MonacoEnvironment = {
    getWorker: (_, label) => {
        if (label === 'typescript' || label === 'javascript') return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url));
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
    }
}

async function loadFile(file: FileInfo) {
    const content = await file.readAsString()
    monaco.languages.typescript.typescriptDefaults.addExtraLib(content, file.path)
}

export async function initialiseDefaults(_package: Package) {

    const files = (await _package.files.list("virtual-project", true, null)).filter(x => x.isFile);
    const loaders = files.map(x => loadFile(x))
    await Promise.all(loaders)
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: ScriptTarget.ES2019,
        module: ModuleKind.ESNext,
        allowSyntheticDefaultImports: true,
        moduleResolution: ModuleResolutionKind.NodeJs,
        jsx: JsxEmit.ReactJSX
    });

    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
}

const modelUri = monaco.Uri.file("foo.ts")

const codeModel = monaco.editor.createModel(
    `
console.log('hello world')

    `,
    "typescript",
    modelUri // Pass the file name to the model here.
);

export function displayEditor(element: HTMLElement) {

    const editor = monaco.editor.create(element, {
        language: "typescript",
        automaticLayout: true,
    })

    editor.setModel(codeModel)
}
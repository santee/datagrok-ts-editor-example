/* Do not change these import lines to match external modules in webpack configuration */
import * as grok from 'datagrok-api/grok';
import * as ui from 'datagrok-api/ui';
import * as DG from 'datagrok-api/dg';
import {displayEditor, initialiseDefaults} from "./ts-editor-view";

export const _package = new DG.Package();

//name: info
export function info() {
  grok.shell.info(_package.webRoot);
}

//tags: init
export async function init() {
  await initialiseDefaults(_package)
}

//name: showTsEditor
export async function showTsEditor() {
  //const innerBox = ui.box()

  const html = ui.div([],{
    style: {
      height: "90%"
    }
  })
  displayEditor(html)

  grok.shell.newView("TS Editor", [html])
}



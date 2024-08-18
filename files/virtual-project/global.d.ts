import * as grokNamespace from 'datagrok-api/grok'
import * as uiNamespace from 'datagrok-api/ui'

declare global {
    const grok: typeof grokNamespace
    const ui: typeof uiNamespace
}
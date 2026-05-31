import Editor from '@monaco-editor/react'
import { Loader } from 'lucide-react'

/**
 * CodeEditor - Monaco editor component (same editor used in VS Code).
 *
 * Props:
 *   language - { monacoLang: 'python' } from LANGUAGES array
 *   value    - current code string
 *   onChange - called with new code string on every keystroke
 */
export default function CodeEditor({ language, value, onChange }) {
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-[#313244]">
      <Editor
        height="100%"
        language={language.monacoLang}
        value={value}
        onChange={(val) => onChange(val || '')}
        theme="vs-dark"

        /* Loading spinner while Monaco downloads */
        loading={
          <div className="flex items-center justify-center h-full bg-[#1e1e2e]">
            <Loader size={24} className="spin text-green-500" />
            <span className="ml-2 text-[#6c7086] text-sm">Loading editor...</span>
          </div>
        }

        options={{
          fontSize:             14,
          fontFamily:           "'JetBrains Mono', 'Courier New', monospace",
          fontLigatures:        true,
          minimap:              { enabled: false },   // hide minimap (not needed here)
          scrollBeyondLastLine: false,
          lineNumbers:          'on',
          renderLineHighlight:  'line',
          tabSize:              4,
          wordWrap:             'on',
          cursorBlinking:       'smooth',
          smoothScrolling:      true,
          automaticLayout:      true,                 // resizes with the container
          padding:              { top: 16 },
        }}
      />
    </div>
  )
}

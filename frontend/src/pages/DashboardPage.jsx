import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Play, Loader, ChevronDown, ChevronUp, Code2, History } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import LanguageSelector, { LANGUAGES } from '../components/editor/LanguageSelector'
import CodeEditor from '../components/editor/CodeEditor'
import OutputConsole from '../components/output/OutputConsole'
import ExecutionHistory from '../components/history/ExecutionHistory'
import { executionService } from '../services/api'

/**
 * DashboardPage - the main page of the application.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  Navbar                                             │
 *   ├──────────┬──────────────────────────┬───────────────┤
 *   │  Tab bar │  Toolbar (lang + run)    │               │
 *   │  Editor  │  Monaco Code Editor      │  Output Panel │
 *   │  History │  [stdin input]           │               │
 *   └──────────┴──────────────────────────┴───────────────┘
 *
 * State:
 *   activeTab   - 'editor' or 'history' (sidebar tabs)
 *   language    - currently selected language object
 *   code        - current code in the editor
 *   input       - optional stdin for the program
 *   result      - last execution result from backend
 *   executing   - true while waiting for backend response
 *   showInput   - toggles the stdin textarea
 */
export default function DashboardPage() {
  const [activeTab,  setActiveTab]  = useState('editor')
  const [language,   setLanguage]   = useState(LANGUAGES[0])      // Java by default
  const [code,       setCode]       = useState(LANGUAGES[0].template)
  const [input,      setInput]      = useState('')
  const [result,     setResult]     = useState(null)
  const [executing,  setExecuting]  = useState(false)
  const [showInput,  setShowInput]  = useState(false)

  // ── Switch language ─────────────────────────────────────────
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(lang.template)   // reset to starter code for that language
    setResult(null)           // clear previous output
  }

  // ── Run code ────────────────────────────────────────────────
  const handleRunCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setExecuting(true)
    setResult(null)

    try {
      const { data } = await executionService.execute({
        language: language.value,
        code:     code,
        input:    input,
      })

      setResult(data)

      if (data.status === 'SUCCESS') {
        toast.success(`Executed in ${data.executionTime}`)
      } else {
        toast.error(data.status.replace(/_/g, ' '))
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Execution failed. Is Docker running?'
      toast.error(msg)
      setResult({ status: 'SYSTEM_ERROR', output: '', error: msg, executionTime: '0s' })
    } finally {
      setExecuting(false)
    }
  }, [code, language, input])

  // ── Load code from history ──────────────────────────────────
  const handleLoadCode = (item) => {
    const lang = LANGUAGES.find(l => l.value === item.language) || LANGUAGES[0]
    setLanguage(lang)
    setCode(item.sourceCode)
    setResult({
      status:        item.status,
      output:        item.output,
      error:         item.error,
      executionTime: item.executionTime
    })
    setActiveTab('editor')
    toast.success('Code loaded from history')
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e2e] overflow-hidden">

      {/* ── Top navbar ─────────────────────────────────────── */}
      <Navbar />

      {/* ── Main layout ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar tabs ─────────────────────────────── */}
        <div className="w-14 bg-[#181825] border-r border-[#313244] flex flex-col items-center pt-3 gap-1 shrink-0">
          <SidebarTab
            icon={<Code2 size={18} />}
            label="Editor"
            active={activeTab === 'editor'}
            onClick={() => setActiveTab('editor')}
          />
          <SidebarTab
            icon={<History size={18} />}
            label="History"
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
        </div>

        {/* ── Main content area ─────────────────────────────── */}
        <div className="flex-1 overflow-hidden">

          {/* ── EDITOR TAB ──────────────────────────────────── */}
          {activeTab === 'editor' && (
            <div className="flex flex-col h-full">

              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825]
                              border-b border-[#313244] shrink-0 gap-3">
                {/* Language buttons */}
                <LanguageSelector selected={language} onChange={handleLanguageChange} />

                <div className="flex items-center gap-2">
                  {/* Stdin toggle */}
                  <button
                    onClick={() => setShowInput(!showInput)}
                    className={`btn-secondary text-xs py-1.5 px-3 ${showInput ? 'bg-[#45475a]' : ''}`}
                  >
                    <span>stdin</span>
                    {showInput ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {/* RUN button */}
                  <button
                    onClick={handleRunCode}
                    disabled={executing}
                    className="btn-primary"
                  >
                    {executing
                      ? <><Loader size={15} className="spin" />Running...</>
                      : <><Play size={15} fill="currentColor" />Run Code</>
                    }
                  </button>
                </div>
              </div>

              {/* Stdin input area (collapsible) */}
              {showInput && (
                <div className="px-4 py-2 bg-[#181825] border-b border-[#313244] shrink-0">
                  <label className="text-xs text-[#585b70] font-mono mb-1 block">
                    stdin — program input (optional)
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-16 bg-[#11111b] border border-[#313244] text-[#cdd6f4]
                               text-sm font-mono rounded-lg px-3 py-2 resize-none
                               focus:outline-none focus:ring-1 focus:ring-green-500
                               placeholder-[#45475a]"
                    placeholder="Enter input for your program here..."
                  />
                </div>
              )}

              {/* Editor + Output split */}
              <div className="flex flex-1 overflow-hidden">

                {/* Code editor (takes remaining width) */}
                <div className="flex-1 flex flex-col p-3 overflow-hidden min-w-0">
                  <CodeEditor
                    language={language}
                    value={code}
                    onChange={setCode}
                  />
                </div>

                {/* Output panel (fixed 380px wide) */}
                <div className="w-96 flex flex-col border-l border-[#313244] overflow-hidden shrink-0">
                  <OutputConsole result={result} loading={executing} />
                </div>
              </div>
            </div>
          )}

          {/* ── HISTORY TAB ─────────────────────────────────── */}
          {activeTab === 'history' && (
            <div className="h-full overflow-hidden">
              <ExecutionHistory onLoadCode={handleLoadCode} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Small sidebar tab button ─────────────────────────────────────
function SidebarTab({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg
                  transition-all duration-150 text-xs gap-1
                  ${active
                    ? 'bg-green-700/30 text-green-400'
                    : 'text-[#585b70] hover:text-[#cdd6f4] hover:bg-[#313244]'
                  }`}
    >
      {icon}
    </button>
  )
}

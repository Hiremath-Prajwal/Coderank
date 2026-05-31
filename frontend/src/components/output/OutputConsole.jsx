import { useState } from 'react'
import { Copy, CheckCheck, Terminal, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

/**
 * Status badge config - maps backend status to display styles.
 */
const STATUS = {
  SUCCESS:           { label: 'Success',           color: 'text-green-400 bg-green-900/30 border-green-600/40' },
  COMPILATION_ERROR: { label: 'Compilation Error', color: 'text-red-400 bg-red-900/30 border-red-600/40' },
  RUNTIME_ERROR:     { label: 'Runtime Error',     color: 'text-orange-400 bg-orange-900/30 border-orange-600/40' },
  TIMEOUT:           { label: 'Time Limit Exceeded', color: 'text-yellow-400 bg-yellow-900/30 border-yellow-600/40' },
  SYSTEM_ERROR:      { label: 'System Error',      color: 'text-red-500 bg-red-900/30 border-red-600/40' },
}

/**
 * OutputConsole - shows the result after code execution.
 *
 * Props:
 *   result  - { status, output, error, executionTime } from backend
 *   loading - true while waiting for Docker to finish
 */
export default function OutputConsole({ result, loading }) {
  const [copied, setCopied] = useState(false)

  // The text to copy (output if success, error otherwise)
  const copyText = result?.output || result?.error || ''

  const handleCopy = async () => {
    if (!copyText) return
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const statusCfg = result ? STATUS[result.status] : null

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-b border-[#313244] shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Terminal size={14} className="text-[#585b70]" />
            <span className="text-sm font-medium text-[#a6adc8]">Output</span>
          </div>

          {/* Status badge */}
          {statusCfg && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          )}

          {/* Execution time */}
          {result?.executionTime && (
            <span className="flex items-center gap-1 text-xs text-[#585b70] font-mono">
              <Clock size={10} />
              {result.executionTime}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          disabled={!copyText}
          className="p-1.5 rounded text-[#585b70] hover:text-[#cdd6f4] hover:bg-[#313244]
                     transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Copy output"
        >
          {copied
            ? <CheckCheck size={14} className="text-green-400" />
            : <Copy size={14} />
          }
        </button>
      </div>

      {/* ── Console body ─────────────────────────────── */}
      <div className="flex-1 bg-[#11111b] overflow-auto font-mono text-sm p-4">

        {/* Loading state - bouncing dots */}
        {loading && (
          <div className="flex items-center gap-3 text-[#585b70]">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full dot-1" />
              <span className="w-2 h-2 bg-green-500 rounded-full dot-2" />
              <span className="w-2 h-2 bg-green-500 rounded-full dot-3" />
            </div>
            <span className="text-xs">Running code inside Docker container...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !result && (
          <div className="text-[#45475a] text-xs select-none">
            <p>$ Run your code to see output here</p>
            <p className="mt-1 text-[#313244]">Execution happens in an isolated Docker container.</p>
          </div>
        )}

        {/* Output / Error */}
        {!loading && result && (
          <>
            {result.output && (
              <pre className="text-[#cdd6f4] whitespace-pre-wrap break-words leading-relaxed">
                {result.output}
              </pre>
            )}
            {result.error && (
              <pre className="text-red-400 whitespace-pre-wrap break-words leading-relaxed mt-2">
                {result.error}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  )
}

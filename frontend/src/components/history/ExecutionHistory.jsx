import { useEffect, useState } from 'react'
import { executionService } from '../../services/api'
import { History, RefreshCw, ChevronDown, ChevronUp, Loader, RotateCcw } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Badge color per status
const STATUS_BADGE = {
  SUCCESS:           'text-green-400 bg-green-900/30 border-green-600/40',
  COMPILATION_ERROR: 'text-red-400 bg-red-900/30 border-red-600/40',
  RUNTIME_ERROR:     'text-orange-400 bg-orange-900/30 border-orange-600/40',
  TIMEOUT:           'text-yellow-400 bg-yellow-900/30 border-yellow-600/40',
  SYSTEM_ERROR:      'text-red-500 bg-red-900/30 border-red-600/40',
}

const LANG_ICON = { java: '☕', python: '🐍', javascript: '🟨' }

// Format ISO date to readable string
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  } catch { return iso }
}

/**
 * HistoryItem - single expandable row in the history list.
 *
 * Click the row to expand and see code + output.
 * Click "Load Code" to restore that submission in the editor.
 */
function HistoryItem({ item, onLoad }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-[#313244] rounded-xl overflow-hidden bg-[#181825]
                    hover:border-[#45475a] transition-colors">

      {/* ── Summary row ────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xl">{LANG_ICON[item.language] || '📄'}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-[#cdd6f4] capitalize">{item.language}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${STATUS_BADGE[item.status] || 'text-[#6c7086]'}`}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#585b70]">
            <span>{formatDate(item.createdAt)}</span>
            {item.executionTime && <span className="font-mono">{item.executionTime}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Load code button */}
          <button
            onClick={(e) => { e.stopPropagation(); onLoad(item) }}
            className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300
                       px-2.5 py-1 rounded-lg border border-green-600/40 hover:bg-green-900/20
                       transition-all"
            title="Load this code in editor"
          >
            <RotateCcw size={11} />
            Load
          </button>
          {expanded ? <ChevronUp size={14} className="text-[#585b70]" /> : <ChevronDown size={14} className="text-[#585b70]" />}
        </div>
      </div>

      {/* ── Expanded details ────────────────────────── */}
      {expanded && (
        <div className="border-t border-[#313244] px-4 py-3 space-y-3 bg-[#11111b]">
          {/* Source code */}
          <div>
            <p className="text-xs text-[#585b70] font-mono uppercase tracking-wider mb-1.5">Source Code</p>
            <pre className="text-xs text-[#cdd6f4] font-mono bg-[#181825] rounded-lg p-3
                            overflow-auto max-h-36 border border-[#313244] whitespace-pre-wrap">
              {item.sourceCode}
            </pre>
          </div>

          {/* Output */}
          {item.output && (
            <div>
              <p className="text-xs text-[#585b70] font-mono uppercase tracking-wider mb-1.5">Output</p>
              <pre className="text-xs text-green-400 font-mono bg-[#181825] rounded-lg p-3
                              overflow-auto max-h-24 border border-[#313244] whitespace-pre-wrap">
                {item.output}
              </pre>
            </div>
          )}

          {/* Error */}
          {item.error && (
            <div>
              <p className="text-xs text-[#585b70] font-mono uppercase tracking-wider mb-1.5">Error</p>
              <pre className="text-xs text-red-400 font-mono bg-[#181825] rounded-lg p-3
                              overflow-auto max-h-24 border border-[#313244] whitespace-pre-wrap">
                {item.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * ExecutionHistory - shows all past executions for the logged-in user.
 *
 * Props:
 *   onLoadCode(item) - called when user clicks "Load" on a history item
 *                      DashboardPage handles this to restore code in editor
 */
export default function ExecutionHistory({ onLoadCode }) {
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch history on mount and on manual refresh
  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const { data } = await executionService.getHistory()
      setHistory(data)
    } catch {
      toast.error('Failed to load execution history')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#313244] shrink-0">
        <div className="flex items-center gap-2">
          <History size={16} className="text-green-500" />
          <span className="font-semibold text-[#cdd6f4]">Execution History</span>
          {history.length > 0 && (
            <span className="text-xs bg-[#313244] text-[#6c7086] px-2 py-0.5 rounded-full border border-[#45475a]">
              {history.length} runs
            </span>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchHistory(true)}
          disabled={refreshing}
          className="p-1.5 rounded text-[#585b70] hover:text-[#cdd6f4] hover:bg-[#313244] transition-all"
          title="Refresh history"
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
        </button>
      </div>

      {/* ── List ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center h-40 text-[#585b70]">
            <Loader size={20} className="spin mr-2" />
            <span className="text-sm">Loading history...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#45475a]">
            <History size={36} className="mb-3 opacity-40" />
            <p className="text-sm">No executions yet</p>
            <p className="text-xs mt-1 text-[#313244]">Run some code to see history here</p>
          </div>
        )}

        {/* History items */}
        {!loading && history.map((item) => (
          <HistoryItem key={item.id} item={item} onLoad={onLoadCode} />
        ))}
      </div>
    </div>
  )
}

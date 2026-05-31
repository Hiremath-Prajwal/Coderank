/**
 * LanguageSelector - buttons to switch between Java, Python, JavaScript.
 *
 * Each language has:
 *   value     - sent to backend in the API call
 *   label     - displayed in the button
 *   icon      - emoji icon
 *   monacoLang - used by Monaco editor for syntax highlighting
 *   template  - default starter code shown when switching language
 */

export const LANGUAGES = [
  {
    value: 'java',
    label: 'Java',
    icon: '☕',
    monacoLang: 'java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from CodeRank!");
    }
}`,
  },
  {
    value: 'python',
    label: 'Python',
    icon: '🐍',
    monacoLang: 'python',
    template: `# Python solution
def main():
    print("Hello from CodeRank!")

main()`,
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: '🟨',
    monacoLang: 'javascript',
    template: `// JavaScript solution
function main() {
    console.log("Hello from CodeRank!");
}

main();`,
  },
]

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {LANGUAGES.map((lang) => {
        const isSelected = selected.value === lang.value
        return (
          <button
            key={lang.value}
            onClick={() => onChange(lang)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                        border transition-all duration-150
                        ${isSelected
                          ? 'bg-green-700/30 border-green-600/60 text-green-400'
                          : 'bg-[#313244] border-[#45475a] text-[#a6adc8] hover:text-white hover:border-[#585b70]'
                        }`}
          >
            <span>{lang.icon}</span>
            <span>{lang.label}</span>
          </button>
        )
      })}
    </div>
  )
}

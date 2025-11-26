import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Github } from 'lucide-react';
import Whitepaper from './components/Whitepaper';
import TableOfContents from './components/TableOfContents';
import GlossaryPanel from './components/GlossaryPanel';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [highlightedTerm, setHighlightedTerm] = useState('');

  useEffect(() => {
    const whitepaperUrl = `${import.meta.env.BASE_URL}whitepaper0.1.md`;

    fetch(whitepaperUrl)
      .then((response) => response.text())
      .then((text) => {
        // 전처리: ** 패턴을 <strong> 태그로 변환 (특수문자가 있어도 작동하도록)
        const processed = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        setMarkdown(processed);
      })
      .catch((error) => console.error('Error loading whitepaper:', error));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <FileText className="h-8 w-8 text-orange-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Datinum Whitepaper v0.1</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <a
                href="https://github.com/datinum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16 max-w-8xl mx-auto flex">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-6">
          <TableOfContents markdown={markdown} />
        </aside>

        {/* Sidebar (Mobile) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white dark:bg-gray-900 shadow-xl z-50">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Contents</span>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <TableOfContents markdown={markdown} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pl-72 xl:pr-80 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {markdown ? (
              <Whitepaper content={markdown} onTermClick={setHighlightedTerm} />
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mt-12">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-base text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Datinum Project. All rights reserved.
              </p>
            </div>
          </footer>
        </main>

        {/* Glossary Panel (Desktop) */}
        <GlossaryPanel highlightedTerm={highlightedTerm} onClearHighlight={() => setHighlightedTerm('')} />
      </div>
    </div>
  );
}

export default App;

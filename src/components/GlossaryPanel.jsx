import React, { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { glossary } from '../utils/glossary';

const GlossaryPanel = ({ highlightedTerm, onClearHighlight }) => {
    const highlightedRef = useRef(null);

    useEffect(() => {
        if (highlightedTerm && highlightedRef.current) {
            // 하이라이트를 일정 시간 후에 제거
            const timer = setTimeout(() => {
                onClearHighlight();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [highlightedTerm, onClearHighlight]);

    return (
        <aside className="hidden xl:block w-80 fixed right-0 top-16 bottom-0 overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-6">
            <div className="sticky top-6">
                <div className="flex items-center mb-6">
                    <BookOpen className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                        용어 풀이
                    </h3>
                </div>
                <div className="space-y-0">
                    {Object.entries(glossary).map(([term, definition], index) => {
                        const isHighlighted = term === highlightedTerm;
                        return (
                            <React.Fragment key={term}>
                                <div
                                    id={`glossary-${term}`}
                                    ref={isHighlighted ? highlightedRef : null}
                                    className={`py-4 transition-all duration-300 ${isHighlighted
                                            ? 'bg-orange-200/90 dark:bg-orange-900/50 -mx-6 px-6 ring-2 ring-orange-300 dark:ring-orange-500 shadow-md'
                                            : 'px-0'
                                        }`}
                                >
                                    <dt className="font-semibold text-blue-950 dark:text-orange-400 mb-2 text-sm">
                                        {term}
                                    </dt>
                                    <dd className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                                        {definition}
                                    </dd>
                                </div>
                                {index < Object.entries(glossary).length - 1 && (
                                    <hr className="border-gray-300/30 dark:border-gray-600/30" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default GlossaryPanel;

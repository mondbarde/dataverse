import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TableOfContents = ({ markdown }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Extract headings from markdown content
        // This is a simple regex extraction. For more complex cases, we might parse the AST.
        const lines = markdown.split('\n');
        const extractedHeadings = [];

        lines.forEach((line) => {
            const match = line.match(/^(#{1,3})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                // Create a simple ID from text
                const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '') // Remove special chars
                    .replace(/\s+/g, '-');    // Replace spaces with hyphens

                extractedHeadings.push({ level, text, id });
            }
        });

        setHeadings(extractedHeadings);
    }, [markdown]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    return (
        <nav className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 pl-4">
                Contents
            </h3>
            <ul className="space-y-1 border-l border-gray-200 dark:border-gray-700">
                {headings.map(({ level, text, id }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            className={`block py-1 pr-4 text-sm transition-colors duration-200 ${activeId === id
                                ? 'text-orange-600 dark:text-orange-400 font-medium border-l-2 border-orange-600 dark:border-orange-400 -ml-[1px]'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-l-2 border-transparent -ml-[1px]'
                                }`}
                            style={{ paddingLeft: `${level * 0.75}rem` }}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                setActiveId(id);
                            }}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;

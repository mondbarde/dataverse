import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TableOfContents = ({ markdown }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    const slugify = (text) =>
        text
            .toLowerCase()
            .replace(/<[^>]+>/g, '') // strip inline HTML tags
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-'); // Replace spaces with hyphens

    useEffect(() => {
        // Extract headings from markdown content
        // This is a simple regex extraction. For more complex cases, we might parse the AST.
        const lines = markdown.split('\n');
        const extractedHeadings = [];

        lines.forEach((line) => {
            const match = line.match(/^(#{1,4})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                // Create a simple ID from text
                const id = slugify(text);

                extractedHeadings.push({ level, text, id });
            }
        });

        setHeadings(extractedHeadings);
    }, [markdown]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] });

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    useEffect(() => {
        const handleScroll = () => {
            let current = activeId;
            const scrollBuffer = 120; // account for fixed header

            for (let i = 0; i < headings.length; i++) {
                const { id } = headings[i];
                const el = document.getElementById(id);
                if (!el) continue;
                const top = el.getBoundingClientRect().top;
                if (top - scrollBuffer <= 0) {
                    current = id;
                } else {
                    break;
                }
            }

            if (current && current !== activeId) {
                setActiveId(current);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings, activeId]);

    const handleClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        const headerOffset = 96; // approximate fixed header height
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        setActiveId(id);
    };

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
                            onClick={(e) => handleClick(e, id)}
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

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { glossary } from '../utils/glossary';

const Whitepaper = ({ content, onTermClick }) => {
    const slugify = (text) =>
        text
            .toLowerCase()
            .replace(/<[^>]+>/g, '') // strip inline HTML tags
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-'); // Replace spaces with hyphens

    const extractText = (children) => {
        return React.Children.toArray(children)
            .map((child) => {
                if (typeof child === 'string' || typeof child === 'number') return child.toString();
                if (child?.props?.children) return extractText(child.props.children);
                return '';
            })
            .join(' ')
            .trim();
    };

    // 텍스트에서 용어를 찾아 클릭 가능한 컴포넌트로 감싸는 함수
    const wrapTermsWithClickable = (text) => {
        if (typeof text !== 'string') return text;

        const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
        const parts = [];
        let lastIndex = 0;
        let foundTerms = [];

        // 모든 용어의 위치를 찾기
        terms.forEach(term => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                foundTerms.push({
                    term: match[0],
                    index: match.index,
                    length: match[0].length,
                    originalTerm: term
                });
            }
        });

        // 위치순으로 정렬하고 겹치는 것 제거
        foundTerms.sort((a, b) => a.index - b.index);
        foundTerms = foundTerms.filter((term, i) => {
            if (i === 0) return true;
            return term.index >= foundTerms[i - 1].index + foundTerms[i - 1].length;
        });

        // 컴포넌트 배열 생성
        foundTerms.forEach((found, i) => {
            if (found.index > lastIndex) {
                parts.push(text.substring(lastIndex, found.index));
            }
            parts.push(
                <span
                    key={`term-${i}`}
                    className="term-link border-b-2 border-dotted border-orange-400 dark:border-orange-600 cursor-pointer no-underline hover:border-orange-600 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all rounded px-0.5"
                    onMouseEnter={() => {
                        onTermClick(found.originalTerm);
                        // 용어 풀이집으로 즉시 스크롤
                        const glossaryElement = document.getElementById(`glossary-${found.originalTerm}`);
                        if (glossaryElement) {
                            glossaryElement.scrollIntoView({ behavior: 'instant', block: 'center' });
                        }
                    }}
                >
                    {found.term}
                </span>
            );
            lastIndex = found.index + found.length;
        });

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    const components = {
        h1: ({ node, children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return <h1 id={id} className="scroll-mt-24 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-blue-950 bg-clip-text text-transparent sm:text-5xl mb-8" {...props}>{children}</h1>;
        },
        h2: ({ node, children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return <h2 id={id} className="scroll-mt-24 text-3xl font-bold tracking-tight text-blue-950 dark:text-gray-200 mt-12 mb-6 border-b-2 border-orange-200 dark:border-orange-800 pb-2" {...props}>{children}</h2>;
        },
        h3: ({ node, children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return <h3 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-200 mt-8 mb-4" {...props}>{children}</h3>;
        },
        h4: ({ node, children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return <h4 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight text-gray-700 dark:text-gray-300 mt-6 mb-3" {...props}>{children}</h4>;
        },
        p: ({ node, children, ...props }) => {
            const processedChildren = React.Children.map(children, child => {
                if (typeof child === 'string') {
                    return wrapTermsWithClickable(child);
                }
                return child;
            });
            return <p className="text-lg leading-7 md:leading-8 text-gray-900 dark:text-gray-100 mb-5" {...props}>{processedChildren}</p>;
        },
        ul: ({ node, ...props }) => <ul className="list-disc marker:text-orange-500 list-outside ml-6 mb-5 space-y-2 text-lg leading-7 md:leading-8 text-gray-900 dark:text-gray-100" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal marker:text-orange-500 list-outside ml-6 mb-5 space-y-2 text-lg leading-7 md:leading-8 text-gray-900 dark:text-gray-100" {...props} />,
        li: ({ node, children, ...props }) => {
            const processedChildren = React.Children.map(children, child => {
                if (typeof child === 'string') {
                    return wrapTermsWithClickable(child);
                }
                return child;
            });
            return (
                <li className="pl-1 leading-7 md:leading-8 text-gray-900 dark:text-gray-100" {...props}>
                    {processedChildren}
                </li>
            );
        },
        blockquote: ({ node, children, ...props }) => {
            const processedChildren = React.Children.map(children, child => {
                if (typeof child === 'string') {
                    return wrapTermsWithClickable(child);
                }
                return child;
            });
            return (
                <blockquote className="border-l-4 border-orange-500 dark:border-orange-600 pl-6 pr-4 italic text-gray-800 dark:text-gray-300 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 py-4 my-6 rounded-r-lg shadow-sm leading-7 md:leading-8" {...props}>
                    {processedChildren}
                </blockquote>
            );
        },
        code: ({ node, inline, className, children, ...props }) => {
            return inline ? (
                <code className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded px-2 py-0.5 text-sm font-mono font-semibold" {...props}>
                    {children}
                </code>
            ) : (
                <pre className="bg-gradient-to-br from-blue-950 to-blue-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6 shadow-lg">
                    <code className="text-sm font-mono" {...props}>
                        {children}
                    </code>
                </pre>
            );
        },
        a: ({ node, ...props }) => <a className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium underline decoration-orange-400 dark:decoration-orange-600 hover:decoration-orange-600 dark:hover:decoration-orange-400 decoration-2 transition-all" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-12 border-gray-200 dark:border-gray-700" {...props} />,
        strong: ({ node, children, ...props }) => <strong className="font-bold text-orange-600 dark:text-orange-400" {...props}>{children}</strong>,
        em: ({ node, ...props }) => <em className="italic text-orange-700 dark:text-orange-400" {...props} />,
    };

    return (
        <article className="max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
                skipHtml={false}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};

export default Whitepaper;

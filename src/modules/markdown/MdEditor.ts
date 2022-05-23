import MdEditor from 'md-editor-v3';
MdEditor.config({
    editorExtensions: {
        highlight: {
            js: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/highlight.min.js',
            css: {
                atom: {
                    light: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/atom-one-light.min.css',
                    dark: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/atom-one-dark.min.css'
                },
                github: {
                    light: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/github.min.css',
                    dark: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/github-dark.min.css'
                }
            }
        },
        screenfull: {
            js: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/screenfull.js/5.2.0/screenfull.min.js'
        },
        prettier: {
            standaloneJs: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prettier/2.5.1/standalone.min.js',
            parserMarkdownJs: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/prettier/2.5.1/parser-markdown.min.js'
        },
        katex: {
            js: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.js',
            css: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.css'
        }
    }
})

export default MdEditor;
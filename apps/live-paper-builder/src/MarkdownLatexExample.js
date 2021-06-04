export default function MarkdownLatexExample() {
  const example_markdown = `
## Some heading

### Some sub-heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit: 

* Option 1

    https://www.someurl1.com

* Option 2

    https://www.someurl2.com
    `;
  const example_latex = `
\`\`\`latex
\sum_{i=1}^n i^3 = \left( \frac{n(g(n)+1)} 2 \right) ^2
\`\`\`    
    `;

  const example_asciimath = `
\`\`\`asciimath
g(x) = 3x^4 + 2x^2
\`\`\`
    `;

  const example_inline = `
Lorem ipsum dolor sit amet, ~E=mc^2~ consectetur adipiscing elit.
    `;

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      Input data can consist of a combination of the following formats:
      <br />
      <br />
      <h6>
        <b>1) Markdown</b>
      </h6>
      <i>Example:</i>
      <pre style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <code>{example_markdown}</code>
      </pre>
      <h6>
        <b>2) Latex or asciimath</b>
      </h6>
      <i>Example 1 (latex):</i>
      <pre style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <code>{example_latex}</code>
      </pre>
      <i>Example 2 (asciimath):</i>
      <pre style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <code>{example_asciimath}</code>
      </pre>
      <i>Example 3 (inline):</i>
      <pre style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <code>{example_inline}</code>
      </pre>
      <br />
      <h6>
        <b>More info:</b>
      </h6>
      <div>
        <a
          href="https://appukuttan-shailesh.github.io/showdown-katex/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>Click here</b>
        </a>{" "}
        for more detailed info and access to a live visualizer. Check the
        sections titled 'Try the live demo' and 'Examples'.
      </div>
    </div>
  );
}

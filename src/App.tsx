import { useEffect, useState } from "react";
import clsx from "clsx";
import { Lexer, TokenType } from "./lib/Lexer";
import { Parser } from "./lib/Parser";
import { Interpreter } from "./lib/Interpreter";
import TokenList from "./components/TokenList";
import TreeNode from "./components/TreeNode";

const tokenColors: Record<TokenType, string> = {
  NUMBER: "blue",
  PLUS: "green",
  MINUS: "green",
  MULTIPLY: "green",
  DIVIDE: "green",
  POWER: "purple",
  FACTORIAL: "purple",
  LEFT_PAREN: "gray",
  RIGHT_PAREN: "gray",
  SIN: "red",
  COS: "red",
  EOF: "gray-400",
};

const randomExpressions = [
  "5 + 3 * 2",
  "sin(45) ^ 2",
  "(4 + 3)!",
  "cos(30) * 2",
  "2^3 + 4",
  "sin(45 + 45) * 2",
  "5**2",
  "3! + 2",
  "2 ^ (3 + 1)",
  "sin(30) + cos(60)",
];

function App() {
  const [expression, setExpression] = useState(
    "(3 + 2!)^2 * sin(30 + 60) - cos((4! / 2^3)) + 5! + (7 - 3)^2!"
  );
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{ type: TokenType; lexeme: string }[]>(
    []
  );
  const [ast, setAst] = useState<ReturnType<Parser["parse"]> | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExpression(e.target.value);
    try {
      const lexer = new Lexer(e.target.value);
      const newTokens = lexer.tokenize();
      setTokens(newTokens);
      const interpreter = new Interpreter();

      const parser = new Parser(newTokens);
      const newAst = parser.parse();
      setAst(newAst);
      setResult(interpreter.interpret(newAst));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTokens([]);
      setAst(null);
    }
  };

  const handleReset = () => {
    setExpression("");
    setError(null);
  };

  const handleRandomExpression = () => {
    const randomIndex = Math.floor(Math.random() * randomExpressions.length);
    setExpression(randomExpressions[randomIndex]);
    handleChange({
      target: { value: randomExpressions[randomIndex] },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  useEffect(() => {
    handleChange({
      target: { value: expression },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Math Expression Parser
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a mathematical expression to see its tokens, abstract syntax
            tree, and result. Supports basic arithmetic(+ - * /), factorial,
            trigonometric functions(sin, cos), and nested expressions.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Expression
            </h2>
            <textarea
              value={expression}
              onChange={handleChange}
              className={clsx(
                "font-mono w-full p-4 rounded-lg outline-none border",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "bg-gray-50 hover:bg-gray-100 transition-colors",
                "resize-none overflow-hidden"
              )}
              style={{ height: "auto" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              placeholder="Enter a mathematical expression..."
            />
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleReset}
                className="bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800 transition-all"
              >
                Reset
              </button>
              <button
                onClick={handleRandomExpression}
                className="bg-neutral-200 text-black px-4 py-2 rounded-xl hover:bg-neutral-300 transition-all"
              >
                Add Random Expression
              </button>
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Tokens
                  <small
                    className="
                    text-sm text-gray-500 block mt-1 font-normal
                  "
                  >
                    Click on a token to see its details
                  </small>
                </h2>
                <TokenList tokens={tokens} tokenColors={tokenColors} />
              </section>

              {ast && (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Result
                  </h2>
                  <div className="font-mono text-2xl text-center text-gray-700">
                    {result}
                  </div>
                </section>
              )}

              {ast && (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Abstract Syntax Tree
                  </h2>
                  <div className="overflow-auto">
                    <TreeNode node={ast} />
                  </div>
                </section>
              )}

              {ast && (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Raw AST Data
                  </h2>
                  <pre className="overflow-auto text-sm">
                    <code>{JSON.stringify(ast, null, 2)}</code>
                  </pre>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Copyleft (ɔ) 2024 Sırrı Demirtaş</p>
      </footer>
    </div>
  );
}

export default App;

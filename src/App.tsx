import { useEffect, useState } from "react";
import clsx from "clsx";
import { Lexer, TokenType } from "./lib/Lexer";
import { Parser } from "./lib/Parser";
import { Interpreter } from "./lib/Interpreter";
import TokenList from "./components/TokenList";
import TreeNode from "./components/TreeNode";
import { testCases } from "./lib/test";
import FunctionalNotation from "./components/FunctionalNotation";

const tokenColors: Record<TokenType, string> = {
  NUMBER: "blue",
  PLUS: "green",
  MINUS: "green",
  MULTIPLY: "green",
  DIVIDE: "green",
  POWER: "purple",
  FACTORIAL: "purple",
  LPAREN: "gray",
  RPAREN: "gray",
  SIN: "red",
  COS: "red",
  EOF: "gray-400",
};

const App: React.FC = () => {
  const [expression, setExpression] = useState(
    "(3 + 2!)^2 * sin(30 + 60) - cos((4! / 2^3)) + 5! + (7 - 3)^2!"
  );
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{ type: TokenType; lexeme: string }[]>(
    []
  );
  const [ast, setAst] = useState<ReturnType<Parser["parse"]> | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{
    expected: number;
    passed?: boolean;
  } | null>(null);
  const [showSupportedOperations, setShowSupportedOperations] = useState(false);
  const [showAst, setShowAst] = useState(false);

  const toggleSupportedOperations = () => {
    setShowSupportedOperations(!showSupportedOperations);
  };

  const toggleAstVisibility = () => {
    setShowAst(!showAst);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setExpression(inputValue);

    try {
      const lexer = new Lexer(inputValue);
      const newTokens = lexer.tokenize();
      setTokens(newTokens);
      const interpreter = new Interpreter();

      const parser = new Parser(newTokens);
      const newAst = parser.parse();
      const calculatedResult = interpreter.interpret(newAst);
      setAst(newAst);
      setResult(calculatedResult);

      // Find if the current expression matches any test case
      const matchingTestCase = testCases.find(
        (test) => test.expression === inputValue
      );
      if (matchingTestCase) {
        setTestResult({
          expected: matchingTestCase.expected,
          passed: Math.abs(calculatedResult - matchingTestCase.expected) < 1e-6,
        });
      } else {
        setTestResult(null);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTokens([]);
      setAst(null);
      setTestResult(null);
    }
  };

  const handleReset = () => {
    setExpression("");
    setError(null);

    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
    }
  };

  const handleRunRandomTest = () => {
    const randomIndex = Math.floor(Math.random() * testCases.length);
    const testCase = testCases[randomIndex];
    setExpression(testCase.expression);
    handleChange({
      target: { value: testCase.expression },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  useEffect(() => {
    handleChange({
      target: { value: expression },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  }, [expression]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Math Expression Parser
          </h1>
          <div className="text-gray-600 max-w-2xl mx-auto space-y-4">
            <p className="text-lg">
              Interactive tool for tokenizing, parsing, and interpreting
              mathematical expressions
            </p>

            <div className="text-center mx-auto max-w-xl text-sm ">
              <div>
                <h3
                  className="font-semibold mb-2 cursor-pointer"
                  onClick={toggleSupportedOperations}
                >
                  Click here to see supported operations
                </h3>
                {showSupportedOperations && (
                  <ul className="space-y-1 list-inside">
                    <li>Basic arithmetic operations (+, -, *, /)</li>
                    <li>Exponentiation (^)</li>
                    <li>Factorial operations (!)</li>
                    <li>Trigonometric functions (sin, cos)</li>
                    <li>Parentheses for grouping</li>
                    <li>Integer and decimal numbers</li>
                    <li>Negative numbers</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
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
                onClick={handleRunRandomTest}
                className="bg-neutral-200 text-black px-4 py-2 rounded-xl hover:bg-neutral-300 transition-all"
              >
                Run Random Test
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
                    {testResult && (
                      <div className="mt-4 text-base">
                        <div className="text-gray-600">
                          Expected: {testResult.expected}
                        </div>
                        {testResult.passed !== undefined && (
                          <div
                            className={
                              testResult.passed
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Test {testResult.passed ? "PASSED" : "FAILED"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {ast && (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Functional Notation
                  </h2>
                  <FunctionalNotation node={ast} />
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
                <section className="bg-white rounded-xl shadow-sm p-6 mt-4">
                  <h2
                    onClick={toggleAstVisibility}
                    className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer transition-colors flex items-center"
                  >
                    Raw AST Data {showAst ? "↓" : "→"}
                  </h2>
                  {showAst && (
                    <pre className="overflow-auto text-sm">
                      <code>{JSON.stringify(ast, null, 2)}</code>
                    </pre>
                  )}
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>
          2024 · Copyleft (ɔ) Sırrı Demirtaş ·{" "}
          <a
            className="underline decoration-dotted"
            href="https://github.com/sirridemirtas/MathExpressionParser"
            target="_blank"
          >
            View project on GitHub ↗
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;

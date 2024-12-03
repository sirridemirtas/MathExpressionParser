import { Lexer, Token } from './Lexer';
import { Parser, ASTNode } from './Parser';
import { Interpreter } from './Interpreter';

function parseAndEvaluate(expression: string): { tokens: Token[], ast: ASTNode, result: number } {
  const lexer = new Lexer(expression);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  return {
    tokens,
    ast,
    result: interpreter.interpret(ast)
  };
}

// Test the parser and interpreter
export function testParser() {
  const testCases = [
    "5 + 3 * 2",
    "sin(45) ^ 2",
    "(4 + 3)!",
    "cos(30) * 2",
    "2^3 + 4",
    "sin(45 + 45) * 2",
    "5**2",
    "3! + 2",
    "2 ^ (3 + 1)",
    "sin(30) + cos(60)"
  ];

  testCases.forEach((expr) => {
    try {
      console.log(`Expression: ${expr}`);
      console.log(`Result:`, parseAndEvaluate(expr));
    } catch (error) {
      console.error(`Error parsing ${expr}:`, error);
    }
  });
}

// Run the tests
testParser();
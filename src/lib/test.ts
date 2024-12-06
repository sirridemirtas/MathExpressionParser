import { Lexer, Token } from './Lexer';
import { Parser, ASTNode } from './Parser';
import { Interpreter } from './Interpreter';

// Types for test results
type TestResult = {
  expression: string;
  expected: number;
  actual?: number;
  passed?: boolean;
  error?: string;
};

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

export const testCases = [
  {
    expression: "(sin(0) + 2!) ^ 2 * (3 * 4!) + cos(0) * (5 ^ 2 - 3!)",
    expected: 
      Math.pow(Math.sin(0) + 2, 2) * (3 * 24) +
      Math.cos(0) * (Math.pow(5, 2) - 6)
  },
  { 
    expression: "(2 + 3!) ^ 2 * (4 - 1)", 
    expected: Math.pow(2 + 6, 2) * (4 - 1) 
  },
  { 
    expression: "2 ^ 3 ^ 2", 
    expected: Math.pow(2, Math.pow(3, 2)) // 512 (sağdan işleme)
  },
  { 
    expression: "3! + 4 * 2 ^ 3", 
    expected: 6 + 4 * Math.pow(2, 3) // 38
  },
  { 
    expression: "(5! / (3 * 2)) + 4 ^ 2", 
    expected: (120 / (3 * 2)) + Math.pow(4, 2)
  },
  { 
    expression: "2 ^ (3 + 4 * 2)", 
    expected: Math.pow(2, (3 + 4 * 2))
  },
  { 
    expression: "(3! * 2) ^ 2 + 5!", 
    expected: Math.pow(6 * 2, 2) + 120
  },
  { 
    expression: "sin(0) + cos(0) ^ 2", 
    expected: Math.sin(0) + Math.pow(Math.cos(0), 2)
  },
  { 
    expression: "(sin(0) + 1) * (3!)^2", 
    expected: (Math.sin(0) + 1) * Math.pow(6, 2)
  },

  { expression: "3!^2", expected: 36 },
  { expression: "4! + 5", expected: 24 + 5 },

  { expression: "(2 + 3) ^ 2", expected: 25 },

  { expression: "2 + 3 * 4", expected: 2 + 3 * 4 },
  { expression: "(2 + 3) * 4", expected: 5 * 4 },
  { expression: "2 ^ 3 ^ 2", expected: Math.pow(2, Math.pow(3, 2)) },
  { expression: "10 / 2 * 5", expected: (10 / 2) * 5 },
  { expression: "10 - 2 + 3", expected: 10 - 2 + 3 },


  { expression: "sin(0)", expected: Math.sin(0) },
  { expression: "cos(0)", expected: Math.cos(0) },
  { expression: "sin(cos(0))", expected: Math.sin(Math.cos(0)) },
  { expression: "2 * sin(30)", expected: 2 * Math.sin(30) },
  { expression: "sin(30) ^ 2", expected: Math.pow(Math.sin(30), 2) },

  { expression: "2 ^ 3!", expected: Math.pow(2, 6) },
  { expression: "(2 + 3!) * 4", expected: (2 + 6) * 4 },
  { expression: "4 / (2 + 2)", expected: 4 / (2 + 2) },
  { expression: "1 / (2 ^ -1)", expected: 1 / Math.pow(2, -1) },
  { expression: "3 + 4 * (2 - 1)", expected: 3 + 4 * (2 - 1) },

  { expression: "-1 + 2", expected: -1 + 2 },
  { expression: "-3 ^ 2", expected: Math.pow(-3, 2) },
  { expression: "(-3) ^ 2", expected: Math.pow(-3, 2) },

  { expression: "1 / 2", expected: 1 / 2 },
  { expression: "1 / (2 / 3)", expected: 1 / (2 / 3) },
  { expression: "1 / (3 ^ -1)", expected: 1 / Math.pow(3, -1) },

  { expression: "2 * (1 / 2)", expected: 2 * (1 / 2) },
  { expression: "3 / (1 / 3)", expected: 3 / (1 / 3) },
  { expression: "(2 + 3) / 5", expected: (2 + 3) / 5 }
];

export function runTests(): TestResult[] {

  const results: TestResult[] = [];

  testCases.forEach(({ expression, expected }) => {
    try {
      const { result } = parseAndEvaluate(expression);
      results.push({
        expression,
        expected,
        actual: result,
        passed: Math.abs(result - expected) < 1e-6
      });
    } catch (error) {
      results.push({
        expression,
        expected,
        error: (error as Error).message
      });
    }
  });

  return results;
}

export function printTestResults(results: TestResult[]): void {
  console.log('\nTest Results:');
  console.log('=============');
  
  results.forEach(result => {
    console.log(`\nExpression: ${result.expression}`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    } else {
      console.log(`Expected: ${result.expected}`);
      console.log(`Actual: ${result.actual}`);
      console.log(`Status: ${result.passed ? 'PASSED' : 'FAILED'}`);
    }
  });

  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => r.passed === false).length;
  const errorTests = results.filter(r => r.error).length;

  console.log('\nSummary:');
  console.log('========');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Errors: ${errorTests}`);
}

export const consoleTestResults = () => {
  const results = runTests();
  printTestResults(results);
}
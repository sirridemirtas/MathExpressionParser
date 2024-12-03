
import { ASTNode, NumberNode, BinaryNode, UnaryNode, FunctionNode } from './Parser';
import { TokenType } from './Lexer';

// Interpreter to evaluate the AST
class Interpreter {
  interpret(node: ASTNode): number {
    return this.evaluate(node);
  }

  private evaluate(node: ASTNode): number {
    switch (node.type) {
      case "NumberNode":
        return (node as NumberNode).value;
      case "BinaryNode":
        return this.evaluateBinary(node as BinaryNode);
      case "UnaryNode":
        return this.evaluateUnary(node as UnaryNode);
      case "FunctionNode":
        return this.evaluateFunction(node as FunctionNode);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private evaluateBinary(node: BinaryNode): number {
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);

    switch (node.operator) {
      case TokenType.PLUS:
        return left + right;
      case TokenType.MINUS:
        return left - right;
      case TokenType.MULTIPLY:
        return left * right;
      case TokenType.DIVIDE:
        if (right === 0) throw new Error("Division by zero");
        return left / right;
      case TokenType.POWER:
        return Math.pow(left, right);
      default:
        throw new Error(`Unknown binary operator: ${node.operator}`);
    }
  }

  private evaluateUnary(node: UnaryNode): number {
    const operand = this.evaluate(node.operand);

    if (node.operator === TokenType.FACTORIAL) {
      if (operand < 0)
        throw new Error("Factorial is not defined for negative numbers");
      if (!Number.isInteger(operand))
        throw new Error("Factorial is only defined for integers");

      let result = 1;
      for (let i = 2; i <= operand; i++) {
        result *= i;
      }
      return result;
    }

    throw new Error(`Unknown unary operator: ${node.operator}`);
  }

  private evaluateFunction(node: FunctionNode): number {
    const arg = this.evaluate(node.argument);

    switch (node.name) {
      case TokenType.SIN:
        return Math.sin(arg);
      case TokenType.COS:
        return Math.cos(arg);
      default:
        throw new Error(`Unknown function: ${node.name}`);
    }
  }
}

export { Interpreter };
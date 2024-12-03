import { TokenType, Token, Lexer } from './Lexer';

// AST Node types
interface ASTNode {
  type: string;
}

interface NumberNode extends ASTNode {
  type: "NumberNode";
  value: number;
}

interface BinaryNode extends ASTNode {
  type: "BinaryNode";
  left: ASTNode;
  operator: TokenType;
  right: ASTNode;
}

interface UnaryNode extends ASTNode {
  type: "UnaryNode";
  operator: TokenType;
  operand: ASTNode;
}

interface FunctionNode extends ASTNode {
  type: "FunctionNode";
  name: TokenType.SIN | TokenType.COS;
  argument: ASTNode;
}

// Parser class to convert tokens to Abstract Syntax Tree
class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // Add static create method
  static create(input: string): Parser {
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();
    return new Parser(tokens);
  }

  // Main parsing method
  parse(): ASTNode {
    return this.expression();
  }

  // expression → term ((PLUS | MINUS) term)*
  private expression(): ASTNode {
    let expr = this.term();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().type;
      const right = this.term();
      expr = {
        type: "BinaryNode",
        left: expr,
        operator,
        right,
      } as BinaryNode;
    }

    return expr;
  }

  // term → factor ((MULTIPLY | DIVIDE) factor)*
  private term(): ASTNode {
    let expr = this.factor();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous().type;
      const right = this.factor();
      expr = {
        type: "BinaryNode",
        left: expr,
        operator,
        right,
      } as BinaryNode;
    }

    return expr;
  }

  // factor → power
  private factor(): ASTNode {
    return this.power();
  }

  // power → factorial ("^" power)*
  private power(): ASTNode {
    let expr = this.factorial();

    while (this.match(TokenType.POWER)) {
      const right = this.power();
      expr = {
        type: "BinaryNode",
        left: expr,
        operator: TokenType.POWER,
        right,
      } as BinaryNode;
    }

    return expr;
  }

  // factorial → base "!"*
  private factorial(): ASTNode {
    let expr = this.base();

    while (this.match(TokenType.FACTORIAL)) {
      expr = {
        type: "UnaryNode",
        operator: TokenType.FACTORIAL,
        operand: expr,
      } as UnaryNode;
    }

    return expr;
  }

  // base → unary_function | number | "(" expression ")"
  private base(): ASTNode {
    if (this.match(TokenType.SIN, TokenType.COS)) {
      return this.unaryFunction();
    }

    if (this.match(TokenType.NUMBER)) {
      return {
        type: "NumberNode",
        value: this.previous().literal!,
      } as NumberNode;
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return expr;
    }

    throw new Error("Unexpected token in base expression");
  }


  // unary_function → "sin" "(" expression ")" | "cos" "(" expression ")"
  private unaryFunction(): ASTNode {
    const funcType = this.previous().type;
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after function name.");
    const argument = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after function argument.");
    return {
      type: "FunctionNode",
      name: funcType,
      argument,
    } as FunctionNode;
  }

  // Helper methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}

export { Parser };
export type { ASTNode, NumberNode, BinaryNode, UnaryNode, FunctionNode };
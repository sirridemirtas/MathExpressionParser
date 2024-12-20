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
    this.validateParentheses();
  }

  private validateParentheses(): void {
    let parenCount = 0;
    
    for (const token of this.tokens) {
      if (token.type === TokenType.LPAREN) {
        parenCount++;
      } else if (token.type === TokenType.RPAREN) {
        parenCount--;
        if (parenCount < 0) {
          throw new Error("Unexpected closing parenthesis");
        }
      }
    }
    
    if (parenCount > 0) {
      throw new Error("Unclosed parenthesis");
    }
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

  // <expression> ::= <term> (("+" | "-") <term>)*
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

  // <term> ::= <power> (("*" | "/" | ε) <power>)*
  // where ε represents implicit multiplication (2(3), 2sin(45), (2)(3), etc.)
  private term(): ASTNode {
    let expr = this.power();

    while (true) {
      if (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
        const operator = this.previous().type;
        const right = this.power();
        expr = {
          type: "BinaryNode",
          left: expr,
          operator,
          right,
        } as BinaryNode;
      } else if (this.isImplicitMultiplication()) {
        const right = this.power();
        expr = {
          type: "BinaryNode",
          left: expr,
          operator: TokenType.MULTIPLY,
          right,
        } as BinaryNode;
      } else {
        break;
      }
    }

    return expr;
  }

  private isImplicitMultiplication(): boolean {
    return this.check(TokenType.LPAREN) || this.check(TokenType.NUMBER) || 
           this.check(TokenType.SIN) || this.check(TokenType.COS);
  }

  // <power> ::= <factorial> ("^" <power>)*
  private power(): ASTNode {
    let expr = this.factorial();

    if (this.match(TokenType.POWER)) {
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

  // <factorial> ::= <function> ("!")*
  private factorial(): ASTNode {
    let expr = this.function();

    while (this.match(TokenType.FACTORIAL)) {
      expr = {
        type: "UnaryNode",
        operator: TokenType.FACTORIAL,
        operand: expr,
      } as UnaryNode;
    }

    return expr;
  }

  // <function> ::= "sin" "(" <expression> ")" | "cos" "(" <expression> ")" | <primary>
  private function(): ASTNode {
    if (this.match(TokenType.SIN, TokenType.COS)) {
      const funcType = this.previous().type;
      this.consume(TokenType.LPAREN, "Expect '(' after function name.");
      const argument = this.expression();
      this.consume(TokenType.RPAREN, "Expect ')' after function argument.");
      return {
        type: "FunctionNode",
        name: funcType,
        argument,
      } as FunctionNode;
    }

    return this.primary();
  }

  // <primary> ::= <number> | "(" <expression> ")"
  private primary(): ASTNode {
    if (this.match(TokenType.NUMBER)) {
      return {
        type: "NumberNode",
        value: this.previous().literal!,
      } as NumberNode;
    }

    if (this.match(TokenType.RPAREN)) {
      throw new Error("Unexpected closing parenthesis");
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "Expect ')' after expression");
      return expr;
    }

    throw new Error("Unexpected token in primary expression");
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
// Token types based on our BNF grammar
enum TokenType {
  NUMBER = "NUMBER",
  PLUS = "PLUS", 
  MINUS = "MINUS",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  POWER = "POWER",
  FACTORIAL = "FACTORIAL",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  SIN = "SIN",
  COS = "COS",
  EOF = "EOF"
}

// Token interface
interface Token {
  type: TokenType;
  lexeme: string;
  literal?: number;
}

// Lexer class to tokenize input
class Lexer {
  private source: string;
  private tokens: Token[] = [];

  // Start position of the current token
  private start: number = 0;
  
  // Current position in the input string
  private current: number = 0;

  constructor(source: string) {
    this.source = source;
  }

  // Main tokenization method
  tokenize(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push({
      type: TokenType.EOF,
      lexeme: "",
    });

    return this.tokens;
  }

  private scanToken() {
    const c = this.advance();
    switch (c) {
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case "-":
        // Check if this might be a negative number
        if (this.isDigit(this.peek())) {
          // If we're at the start of input or the previous token was an operator or left paren
          if (this.tokens.length === 0 || 
              [TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, 
               TokenType.DIVIDE, TokenType.POWER, TokenType.LPAREN
              ].includes(this.tokens[this.tokens.length - 1].type)) {
            this.current--; // Move back to include the minus sign
            this.number();
            break;
          }
        }
        this.addToken(TokenType.MINUS);
        break;
      case "*":
        this.addToken(TokenType.MULTIPLY);
        break;
      case "/":
        this.addToken(TokenType.DIVIDE);
        break;
      case "^":
        this.addToken(TokenType.POWER);
        break;
      case "!":
        this.addToken(TokenType.FACTORIAL);
        break;
      case "(":
        this.addToken(TokenType.LPAREN);
        break;
      case ")":
        this.addToken(TokenType.RPAREN);
        break;
      case " ":
      case "\r":
      case "\t":
      case "\n":
        // Ignore whitespace
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error(`Unexpected character: ${c}`);
        }
    }
  }

  // Handle numeric tokens
  private number() {
    // Handle negative sign if present
    if (this.peek() === '-') {
      this.advance();
    }
    
    while (this.isDigit(this.peek())) this.advance();

    // Look for fractional part
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      // Consume the '.'
      this.advance();

      // Consume the decimal digits
      while (this.isDigit(this.peek())) this.advance();
    }

    const value = parseFloat(this.source.substring(this.start, this.current));
    this.addToken(TokenType.NUMBER, value);
  }

  // Handle identifier tokens (sin, cos)
  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    switch (text) {
      case "sin":
        this.addToken(TokenType.SIN);
        break;
      case "cos":
        this.addToken(TokenType.COS);
        break;
      default:
        throw new Error(`Unexpected identifier: ${text}`);
    }
  }

  private addToken(type: TokenType, literal?: number) {
    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push({
      type,
      lexeme,
      literal,
    });
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }
}

export { Lexer, TokenType };
export type { Token };
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { TokenType, Token } from "../lib/Lexer";

interface TokenListProps {
  tokens: { type: TokenType; lexeme: string }[];
  tokenColors: Record<string, string>;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, tokenColors }) => {
  const [selectedToken, setSelectedToken] = useState<{
    type: TokenType;
    lexeme: string;
  } | null>(null);

  useEffect(() => {
    setSelectedToken(null);
  }, [tokens]);

  return (
    <div>
      <div className={clsx("font-mono", "flex flex-row flex-wrap")}>
        {tokens.map((token, index) => (
          <span
            key={index}
            onClick={() => setSelectedToken(token)}
            className={clsx(
              String("text-" + tokenColors[token.type] + "-600"),
              "hover:bg-gray-200 transition-all",
              "px-1 cursor-pointer rounded-sm"
            )}
          >
            {token.lexeme}
          </span>
        ))}
      </div>
      {selectedToken && <TokenDetails token={selectedToken} />}
    </div>
  );
};

const TokenDetails: React.FC<{ token: Token }> = ({ token }) => {
  return (
    <div className="bg-neutral-50 p-4 rounded-lg mt-2 space-y-2">
      {token.type && (
        <div>
          <span>Type: </span>
          <span>{token.type}</span>
        </div>
      )}
      {token.lexeme && (
        <div>
          <span>Lexeme: </span>
          <span>{token.lexeme}</span>
        </div>
      )}
      {token.literal && (
        <div>
          <span>Literal: </span>
          <span>{token.literal}</span>
        </div>
      )}
    </div>
  );
};

export default TokenList;

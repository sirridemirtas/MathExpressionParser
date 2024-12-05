import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { TokenType } from "../lib/Lexer";

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
      {selectedToken && (
        <div className="w-full">
          <pre className="text-sm p-4 rounded-lg bg-neutral-50 mt-2">
            {JSON.stringify(selectedToken, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TokenList;

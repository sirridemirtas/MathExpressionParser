import { useState } from "react";
import clsx from "clsx";
import { TokenType } from "../lib/Lexer";

const TokenList = ({
  tokens,
  tokenColors,
}: {
  tokens: { type: TokenType; lexeme: string }[];
  tokenColors: Record<TokenType, string>;
}) => {
  const [selectedToken, setSelectedToken] = useState<{
    type: TokenType;
    lexeme: string;
  } | null>(null);

  const handleTokenClick = (token: { type: TokenType; lexeme: string }) => {
    setSelectedToken(token);
  };

  return (
    <div className={clsx("font-mono", "flex flex-row flex-wrap")}>
      {tokens.map((token, index) => (
        <span
          key={index}
          className={clsx(
            String("text-" + tokenColors[token.type] + "-600"),
            "cursor:pointer hover:bg-gray-200 transition-all",
            "px-1 cursor-pointer rounded-sm"
          )}
          title={token.type}
          onClick={() => handleTokenClick(token)}
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
      {/* Legend */}
      {/* <div className="flex flex-row gap-2 flex-wrap">
        {Object.entries(tokenColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span
              className={clsx(
                "text-xs rounded-full w-4 h-4 border",
                String("bg-" + color)
              )}
            ></span>
            <span className="text-xs">{type}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TokenList;

import clsx from "clsx";
import { TokenType } from "../lib/Lexer";

const TokenList = ({
  tokens,
  tokenColors,
}: {
  tokens: { type: TokenType; lexeme: string }[];
  tokenColors: Record<TokenType, string>;
}) => {
  return (
    <div
      className={clsx(
        "font-mono bg-neutral-50 rounded-xl p-6 max-w-5xl w-full",
        "flex flex-row flex-wrap"
      )}
    >
      {tokens.map((token, index) => (
        <span
          key={index}
          className={clsx(
            String("bg-" + tokenColors[token.type] + "-200"),
            "px-1 cursor-pointer"
          )}
          title={token.type}
        >
          {token.lexeme}
        </span>
      ))}
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

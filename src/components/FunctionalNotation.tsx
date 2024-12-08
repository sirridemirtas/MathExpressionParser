import React from "react";
import {
  ASTNode,
  NumberNode,
  BinaryNode,
  UnaryNode,
  FunctionNode,
} from "../lib/Parser";

interface FunctionalNotationProps {
  node: ASTNode;
}

const operatorToFunctionName: Record<string, string> = {
  PLUS: "SUM",
  MINUS: "SUBTRACT",
  MULTIPLY: "MULTIPLY",
  DIVIDE: "DIVIDE",
  POWER: "POWER",
  FACTORIAL: "FACTORIAL",
};

const FunctionalNotation: React.FC<FunctionalNotationProps> = ({ node }) => {
  const renderNode = (node: ASTNode): React.ReactNode => {
    if (!node) return null;

    switch (node.type) {
      case "NumberNode":
        return <span>{(node as NumberNode).value}</span>;

      case "BinaryNode": {
        const bNode = node as BinaryNode;
        const funcName = operatorToFunctionName[bNode.operator];
        return (
          <span>
            {funcName}({renderNode(bNode.left)}, {renderNode(bNode.right)})
          </span>
        );
      }

      case "UnaryNode": {
        const uNode = node as UnaryNode;
        const funcName = operatorToFunctionName[uNode.operator];
        return (
          <span>
            {funcName}({renderNode(uNode.operand)})
          </span>
        );
      }

      case "FunctionNode": {
        const fNode = node as FunctionNode;
        return (
          <span>
            {fNode.name}({renderNode(fNode.argument)})
          </span>
        );
      }

      default:
        return null;
    }
  };

  return <div className="font-mono">{renderNode(node)}</div>;
};

export default FunctionalNotation;

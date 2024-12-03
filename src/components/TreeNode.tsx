import { useState } from "react";

type ASTNode = {
  type: string;
  value?: number;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
  operand?: ASTNode;
  name?: string;
  argument?: ASTNode;
};

const TreeNode = ({ node, level = 0 }: { node: ASTNode; level?: number }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderValue = () => {
    switch (node.type) {
      case "NumberNode":
        return `Number: ${node.value}`;
      case "BinaryNode":
        return `Binary: ${node.operator}`;
      case "UnaryNode":
        return `Unary: ${node.operator}`;
      case "FunctionNode":
        return `Function: ${node.name}`;
      default:
        return node.type;
    }
  };

  const hasChildren = node.left || node.right || node.operand || node.argument;

  return (
    <div className="ml-6 border-l-2 border-gray-300 pl-4">
      <div className="flex items-center gap-2">
        {hasChildren && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-4 h-4 flex items-center justify-center text-xs border rounded"
          >
            {isCollapsed ? "+" : "-"}
          </button>
        )}
        <span className="font-mono bg-neutral-100 px-2 py-1 rounded">
          {renderValue()}
        </span>
      </div>

      {!isCollapsed && (
        <div className="mt-2">
          {node.left && <TreeNode node={node.left} level={level + 1} />}
          {node.right && <TreeNode node={node.right} level={level + 1} />}
          {node.operand && <TreeNode node={node.operand} level={level + 1} />}
          {node.argument && <TreeNode node={node.argument} level={level + 1} />}
        </div>
      )}
    </div>
  );
};

export default TreeNode;

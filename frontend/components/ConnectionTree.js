import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function ConnectionTree({ userId }) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    loadConnectionTree();
  }, [userId]);

  const loadConnectionTree = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/connections/network/${userId}`);
      setTree(response.data.data);
    } catch (error) {
      console.error('Failed to load connection tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="text-center p-8 text-gray-500">
        No connection network available
      </div>
    );
  }

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.connections && node.connections.length > 0;

    return (
      <div key={node.id} className="ml-4">
        <div className="flex items-center py-2">
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="mr-2 p-1 hover:bg-gray-100 rounded"
            >
              <svg
                className={`w-4 h-4 text-primary transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
              {node.first_name?.[0]}
              {node.last_name?.[0]}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {node.first_name} {node.last_name}
              </p>
              {level === 0 && <p className="text-xs text-gray-500">You</p>}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-primary-light ml-4">
            {node.connections.map((childNode) =>
              renderNode(childNode, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Connection Network
      </h3>
      <div className="font-mono text-sm">
        {renderNode(tree)}
      </div>
    </div>
  );
}

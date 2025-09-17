import React, { useState, useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { storyboardsAPI } from '../../services/api';
import { encryptData, decryptData } from '../../services/encryption';

const StoryboardCanvas = () => {
  const [elements, setElements] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ label: '', type: 'source', notes: '' });
  const [cy, setCy] = useState(null);
  const [saved, setSaved] = useState(true);

  // Load storyboard data
  useEffect(() => {
    loadStoryboard();
  }, []);

  // Auto-save when elements change
  useEffect(() => {
    if (elements.length > 0) {
      const timer = setTimeout(() => {
        saveStoryboard();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [elements]);

  const loadStoryboard = async () => {
    try {
      const response = await storyboardsAPI.getAll();
      if (response.data.length > 0) {
        const storyboard = response.data[0];
        const decryptedData = decryptData(storyboard.data);
        setElements(decryptedData.elements || []);
      }
    } catch (error) {
      console.error('Error loading storyboard:', error);
    }
  };

  const saveStoryboard = async () => {
    try {
      const encryptedData = encryptData({ elements });
      await storyboardsAPI.create({ data: encryptedData });
      setSaved(true);
      console.log('Storyboard saved!');
    } catch (error) {
      console.error('Error saving storyboard:', error);
      setSaved(false);
    }
  };

  // Add new node
  const addNode = () => {
    if (!newNodeData.label.trim()) return;

    const newNode = {
      data: {
        id: `node_${Date.now()}`,
        label: newNodeData.label,
        type: newNodeData.type,
        notes: newNodeData.notes,
        timestamp: new Date().toISOString()
      }
    };

    setElements(prev => [...prev, newNode]);
    setNewNodeData({ label: '', type: 'source', notes: '' });
    setIsEditing(false);
    setSaved(false);
  };

  // Add connection between nodes
  const addEdge = (sourceId, targetId) => {
    const newEdge = {
      data: {
        id: `edge_${Date.now()}`,
        source: sourceId,
        target: targetId,
        label: 'connects to'
      }
    };

    setElements(prev => [...prev, newEdge]);
    setSaved(false);
  };

  // Handle node selection
  const handleNodeClick = (event) => {
    const node = event.target;
    setSelectedNode(node.data());
  };

  // Handle canvas click
  const handleCanvasClick = (event) => {
    if (event.target === cy) {
      setSelectedNode(null);
    }
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (selectedNode) {
      setElements(prev => prev.filter(el => 
        el.data.id !== selectedNode.id && 
        el.data.source !== selectedNode.id && 
        el.data.target !== selectedNode.id
      ));
      setSelectedNode(null);
      setSaved(false);
    }
  };

  // Export storyboard
  const exportStoryboard = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `storyboard_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Cytoscape layout options
  const layout = {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 30
  };

  // Node styles
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#3498db',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': 'white',
        'font-size': '12px',
        'width': '60px',
        'height': '60px',
        'border-width': 2,
        'border-color': '#2980b9'
      }
    },
    {
      selector: 'node[type="source"]',
      style: {
        'background-color': '#e74c3c'
      }
    },
    {
      selector: 'node[type="lead"]',
      style: {
        'background-color': '#f39c12'
      }
    },
    {
      selector: 'node[type="evidence"]',
      style: {
        'background-color': '#27ae60'
      }
    },
    {
      selector: 'node[type="theory"]',
      style: {
        'background-color': '#9b59b6'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#7f8c8d',
        'target-arrow-color': '#7f8c8d',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    }
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Connect the Dots
          </h2>
          <div className="flex items-center space-x-2">
            {!saved && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                Unsaved changes
              </span>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Node
            </button>
            <button
              onClick={saveStoryboard}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={exportStoryboard}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          layout={layout}
          stylesheet={stylesheet}
          cy={(cy) => setCy(cy)}
          minZoom={0.1}
          maxZoom={3}
        />
      </div>

      {/* Node Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Node
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Label
                </label>
                <input
                  type="text"
                  value={newNodeData.label}
                  onChange={(e) => setNewNodeData({...newNodeData, label: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter node label"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  value={newNodeData.type}
                  onChange={(e) => setNewNodeData({...newNodeData, type: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="source">Source</option>
                  <option value="lead">Lead</option>
                  <option value="evidence">Evidence</option>
                  <option value="theory">Theory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={newNodeData.notes}
                  onChange={(e) => setNewNodeData({...newNodeData, notes: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="Add notes about this node"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addNode}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-64">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedNode.label}
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Type: {selectedNode.type}
          </p>
          {selectedNode.notes && (
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
              {selectedNode.notes}
            </p>
          )}
          <button
            onClick={deleteSelectedNode}
            className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
          >
            Delete Node
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300">
        <p>• Click and drag to move nodes</p>
        <p>• Click a node to view details</p>
        <p>• Drag from one node to another to connect them</p>
      </div>
    </div>
  );
};

export default StoryboardCanvas;

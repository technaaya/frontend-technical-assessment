import { useEffect, useState, useRef } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

export const BaseNode = ({ data }) => {
  const { id, nodeType } = data;
  const [promptOne, setPromptOne] = useState('');
  const [promptTwo, setPromptTwo] = useState('');
  const [variables, setVariables] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [promptOne]);

  useEffect(() => {
    
    const extractVars = (text) =>
      [...text.matchAll(/\{\{\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\}\}/g)].map((m) => m[1].trim());
    const varsOne = extractVars(promptOne);
    const varsTwo = extractVars(promptTwo);
    const allVars = [...new Set([...varsOne, ...varsTwo])];
    setVariables(allVars);
    updateNodeInternals(id);
  }, [promptOne, promptTwo]);


  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="relative w-fit min-w-[250px] max-w-[500px] p-4 rounded-[16px] bg-white drop-shadow flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-[18px] capitalize">{nodeType.replace(/([A-Z])/g, ' $1')}</p>
        <hr className="w-full h-[1px] border-[0.5px] border-gray-300" />
      </div>

      {nodeType === 'text' && (
        <label className="flex flex-col gap-2">
          <p className="font-semibold">Text:</p>
          <textarea
            ref={textareaRef}
            value={promptOne}
            onChange={(e) => setPromptOne(e.target.value)}
            className="bg-white w-full min-h-[150px] overflow-hidden border border-gray-300 rounded-[8px] p-2"
            placeholder="Enter Prompt"
          />
        </label>
      )}

      {nodeType === 'customInput' && (
        <label className="flex flex-col gap-2">
          <p className="font-semibold">Text:</p>
          <textarea
            value={promptTwo}
            onChange={(e) => setPromptTwo(e.target.value)}
            className="bg-white w-full min-h-[150px] border border-gray-300 rounded-[8px] p-2"
            placeholder="Enter Prompt"
          />
          <p className="w-full text-center">or</p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-center font-semibold w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            {selectedFileName || 'Choose File'}
          </label>
        </label>
      )}

      {nodeType === 'llm' && (
        <label className="flex flex-col gap-2">
          <p className="font-semibold">Choose LLM:</p>
          <select className="bg-white w-full border border-gray-300 rounded-[8px] p-2">
            <option>LLM 1</option>
            <option>LLM 2</option>
            <option>LLM 3</option>
          </select>
        </label>
      )}

      {nodeType === 'customOutput' && (
        <label className="flex flex-col gap-2">
          <p className="font-semibold">Output:</p>
          <textarea className="bg-white w-full min-h-[150px] border border-gray-300 rounded-[8px] p-2" readOnly />
        </label>
      )}

      {/* Fixed Handles */}
      {nodeType === 'customInput' && (
        <Handle type="source" position={Position.Right} id={`${id}-value`} />
      )}
      {nodeType === 'text' && (
        <Handle type="source" position={Position.Right} id={`${id}-output`} />
      )}
      {nodeType === 'llm' && (
        <>
          <Handle type="target" position={Position.Left} id={`${id}-system`} style={{ top: `33%` }} />
          <Handle type="target" position={Position.Left} id={`${id}-prompt`} style={{ top: `66%` }} />
          <Handle type="source" position={Position.Right} id={`${id}-response`} />
        </>
      )}
      {nodeType === 'customOutput' && (
        <Handle type="target" position={Position.Left} id={`${id}-value`} />
      )}

      {/* Dynamic Variable Handles */}
      {(nodeType === 'text' || nodeType === 'customInput') &&
        variables.map((variable, index) => (
          <Handle
            key={variable}
            type="target"
            position={Position.Left}
            id={`${variable}-${index}`}
            style={{ top: `${(index + 1) * 25}px` }}
          />
        ))}
    </div>
  );
};

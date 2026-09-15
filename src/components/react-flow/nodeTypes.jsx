import CustomNode1 from "./custom-nodes/CustomNode1";
import PromptNode from "./custom-nodes/PromptNode";
import LLMNode from "./custom-nodes/LLMNode";
import ToolNode from "./custom-nodes/ToolNode";
import ResultNode from "./custom-nodes/ResultNode";

export const nodeTypes = {
    CustomNode1: CustomNode1,
    prompt: PromptNode,
    llm: LLMNode,
    tool: ToolNode,
    result: ResultNode,
};

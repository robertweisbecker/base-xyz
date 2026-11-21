import { agentTools, createAgent, registerTools } from "@ui-sdk/react/agent";

export const agent = createAgent();
export { agentTools };

const unregister = registerTools(agent, { allow: () => true });
if (import.meta.hot) import.meta.hot.dispose(unregister);

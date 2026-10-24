import openRouter from "../config/openRouter.js";

// Send Message to AI and gives reply 
export const generateAIResponse = async ({ model, messages }) => {
  const completion = await openRouter.chat.send({
    chatRequest: {
      model,
      messages,
    },
  });

  const aiReply = completion.choices[0]?.message?.content;

  if (!aiReply) {
    throw new Error("AI response is empty");
  }

  // Input Token  == Prompt Token
  // Output Token == Completion Token
  const promptTokens = completion.usage?.promptTokens || 0;
  const completionTokens = completion.usage?.completionTokens || 0;

  return {
    aiReply,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    },
  };
};
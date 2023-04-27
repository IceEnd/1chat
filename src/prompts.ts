// 为对话命名
export const namePrompts = (message: ChatSession.IMessage[]) => {
  const format = (message: string[]) => message.map(msg => msg).join('\n\n---------\n\n');
  return [
    {
      id: '1',
      role: 'system',
      content: `Name the conversation based on the chat records.
Please provide a concise name, within 10 characters and without quotation marks.
Please use the speak language in the conversation.
You only need to answer with the name.
The following is the conversation:

\`\`\`
${format(message.map(msg => msg.content))}
\`\`\`

Please provide a concise name, within 10 characters and without quotation marks.
Please use the speak language in the conversation.
You only need to answer with the name.
The conversation is named:`,
    },
  ];
};

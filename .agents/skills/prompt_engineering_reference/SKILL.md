---
name: prompt-engineering-reference
description: Guide and reference for prompt engineering, modeling specifications, and prompt libraries from major AI providers (OpenAI, Anthropic, Google, Microsoft, LangChain).
---

# Prompt Engineering & Model Spec Reference

This skill acts as a developer-facing guide and reference hub containing prompt engineering guidelines, system instructions, and resources from major AI providers and popular community databases.

---

## 📚 Key Reference Repositories & Guides

- **Awesome ChatGPT Prompts**: [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- **Awesome Claude Prompts**: [langgptai/awesome-claude-prompts](https://github.com/langgptai/awesome-claude-prompts)
- **Anthropic Prompt Library**: [anthropic.com/prompt-library](https://docs.anthropic.com/en/prompt-library)
- **OpenAI Model Spec**: [model-spec.openai.com](https://model-spec.openai.com/)
- **OpenAI Prompting Guide**: [platform.openai.com/docs/guides/prompt-engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- **Microsoft Prompt Engineering Guide**: [learn.microsoft.com/.../prompt-engineering](https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering)
- **Google Prompting Guide**: [ai.google.dev/gemini-api/docs/prompting-intro](https://ai.google.dev/gemini-api/docs/prompting-intro)
- **LangChain Documentation**: [python.langchain.com/docs/](https://python.langchain.com/docs/)
- **DeepLearning.AI Course**: [ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)

---

## 🛠️ Prompting Best Practices by Provider

### 1. OpenAI Model Spec & Engineering
- **Clear Instructions**: Put instructions at the beginning of the prompt and use `###` or `"""` to separate instructions and context.
- **Specify Output Format**: Explicitly request JSON, Markdown, XML, or specific lists.
- **Chain of Thought (CoT)**: Ask the model to "explain its reasoning step-by-step before arriving at the final answer."
- **Few-Shot Prompting**: Provide 2-3 examples of desired inputs and outputs.

### 2. Anthropic (Claude-Specific)
- **Use XML Tags**: Structure instructions, input data, and examples inside tags like `<instructions>`, `<example>`, or `<input>` to prevent content dilution.
- **Pre-fill Response**: Start the assistant's response with desired characters (e.g., `{` or `[NEW]`) to enforce specific formats.
- **Detailed System Prompts**: Utilize deep context and behavioral guardrails in the system message.

### 3. Google Gemini
- **System Instructions**: Use the system instruction parameter for global rules, distinct from conversational context.
- **Multimodal Prompts**: Keep image, audio, or video inputs close to the relevant text prompts.
- **Task Priming**: Provide context, followed by input data, and then the action directive.

---

## ⚡ Quick Prompt Templates

### JSON Output Priming
```markdown
Translate the following input text into a JSON object with keys "sentiment" (positive/negative/neutral) and "summary".
Input: {text}
Output format: Only return a valid JSON object.
```

### Complex Reasoning (XML Structured)
```markdown
<instructions>
Evaluate the customer's query and provide a structured response. First, analyze the sentiment in <thinking> tags. Then, write a warm, empathetic reply in <response> tags.
</instructions>
<query>
{user_query}
</query>
```

# PopLingo AI Dictionary | AI 流行词典

**PopLingo** is a vibrant, Gen Z-friendly AI dictionary web application designed to make language learning fun and engaging. It leverages Google's Gemini API to provide definitions, visual mnemonics, natural pronunciations, and interactive tutoring.

**PopLingo** 是一款专为 Z 世代设计的充满活力、有趣且智能的 AI 词典 Web 应用。它利用 Google Gemini API 提供定义、视觉记忆辅助、自然发音和互动辅导，让语言学习变得不再枯燥。

---

## 🇬🇧 English Section

### Introduction
PopLingo moves away from boring textbook definitions. It provides a bright, "Pop" aesthetic interface where users can learn languages (defaulting to English for Chinese speakers) through visuals, stories, and conversation.

### Features
*   **Smart Search**: Translate and define words, phrases, or sentences between native and target languages.
*   **AI Definitions**: Natural, easy-to-understand definitions without complex jargon.
*   **Visual Learning**: Generates cool, trendy 3D illustrations/stickers for every term using `gemini-2.5-flash-image`.
*   **Contextual Examples**: Provides 3 example sentences where the specific term is highlighted.
*   **Natural Pronunciation**: Features high-quality, non-robotic audio for terms and sentences using `gemini-2.5-flash-preview-tts`.
*   **Usage Notes (The Vibe)**: Explains cultural nuances, slang, and tone in a casual way.
*   **Chat with Tutor**: A built-in AI tutor ("Pop") ready to answer follow-up questions about grammar or usage using Markdown support.
*   **Notebook**: Save words to your personal collection.
*   **AI Storytelling**: Generates funny stories using the words in your notebook to help with memorization.
*   **Study Mode**: Review your vocabulary with interactive flashcards (Question/Answer format).

### Tech Stack
*   **Frontend**: React 19, Tailwind CSS
*   **AI Models**:
    *   `gemini-2.5-flash` (Logic, Definitions, Chat, Stories)
    *   `gemini-2.5-flash-image` (Visual generation)
    *   `gemini-2.5-flash-preview-tts` (Text-to-Speech)
*   **Icons**: Lucide React

### Getting Started
1.  Clone the repository.
2.  Ensure you have a valid Google Gemini API Key.
3.  Set the `API_KEY` in your environment variables.
4.  Run the application.

---

## 🇨🇳 中文说明

### 简介
PopLingo 摒弃了枯燥的教科书式定义。它提供了一个明亮、流行的 "Pop" 风格界面，用户可以通过视觉、故事和对话来学习语言（默认设置为母语中文学习英语）。

### 功能特性
*   **智能搜索**: 在母语和目标语言之间翻译和定义单词、短语或句子。
*   **AI 定义**: 提供通俗易懂的自然语言解释，拒绝晦涩难懂的专业术语。
*   **视觉学习**: 使用 `gemini-2.5-flash-image` 为每个词条自动生成酷炫、潮流的 3D 插图/贴纸。
*   **语境例句**: 提供 3 个包含该词条的高亮例句，帮助理解实际用法。
*   **自然发音**: 使用 `gemini-2.5-flash-preview-tts` 为单词和例句提供高质量、非机械感的真人级语音朗读。
*   **用法提示 (氛围感)**: 以轻松的方式解释文化细微差别、俚语和语气。
*   **AI 导师对话**: 内置 AI 导师 "Pop"，支持 Markdown 格式，可随时回答关于语法或用法的后续问题。
*   **生词本**: 将单词保存到您的个人收藏集中。
*   **AI 故事生成**:利用生词本中的单词生成有趣的小故事，辅助记忆。
*   **学习模式**: 通过互动的“翻转闪卡”复习词汇（问题/答案模式）。

### 技术栈
*   **前端**: React 19, Tailwind CSS
*   **AI 模型**:
    *   `gemini-2.5-flash` (逻辑处理, 定义生成, 聊天, 故事创作)
    *   `gemini-2.5-flash-image` (图像生成)
    *   `gemini-2.5-flash-preview-tts` (语音合成)
*   **图标库**: Lucide React

### 安装与运行
1.  克隆代码仓库。
2.  确保您拥有有效的 Google Gemini API Key。
3.  在环境变量中设置 `API_KEY`。
4.  运行应用程序。

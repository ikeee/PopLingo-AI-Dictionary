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

### User Guide
1.  **Setup Languages**: Use the top bar selectors to choose your Native Language (e.g., Chinese) and Target Language (e.g., English).
2.  **Search**: Enter a word or phrase in the search bar and press Enter.
    *   *Tip*: You can input text in either language; the AI will figure it out.
3.  **Explore the Card**:
    *   **Listen**: Click the Speaker icon to hear the pronunciation.
    *   **Visual**: View the AI-generated 3D illustration.
    *   **Read**: Check the highlighted definition and "The Vibe" usage note.
    *   **Examples**: Read the example sentences; click the small speaker icons to hear them.
4.  **Chat with Tutor**: Use the chat box on the right (desktop) or bottom (mobile) to ask specific questions like "Is this word formal?" or "Give me a synonym."
5.  **Save to Notebook**: Click the **Save** (Heart/Floppy Disk) icon in the top right of the card.
6.  **Notebook & Stories**:
    *   Go to the **Notebook** tab to see your collection.
    *   Click **"Make a Story"** to have AI weave your saved words into a funny short story to help you memorize them.
7.  **Study Mode**:
    *   Go to the **Study** tab.
    *   You will see a Flashcard with the word and phonetic script.
    *   Tap "Reveal Answer" to flip the card and see the definition and example.

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

### 使用教程
1.  **设置语言**: 使用顶部栏的选择器选择您的**母语**（例如：中文）和**目标语言**（例如：英语）。
2.  **搜索单词**: 在搜索框中输入单词或短语，然后按回车键。
    *   *提示*: 支持输入中英文，AI 会自动识别并翻译/定义。
3.  **学习卡片**:
    *   **听音**: 点击喇叭图标收听真人级发音。
    *   **看图**: 查看 AI 生成的潮流 3D 记忆插图。
    *   **阅读**: 查看带有高亮显示的定义和“氛围感”用法提示。
    *   **例句**: 阅读例句，并点击旁边的喇叭图标收听例句朗读。
4.  **导师对话 (Chat)**:
    *   使用右侧（桌面端）或下方（移动端）的聊天框向 AI 导师提问。
    *   例如：“这个词是褒义还是贬义？”、“用这个词造个句”。
5.  **保存生词**: 点击卡片右上角的 **保存** 图标，将其加入生词本。
6.  **生词本与故事**:
    *   切换到 **Notebook** 标签页查看您收藏的单词。
    *   点击 **"Make a Story"** 按钮，AI 会将您生词本里的词串成一个有趣的小故事，帮助您记忆。
7.  **学习模式 (Study)**:
    *   切换到 **Study** 标签页。
    *   您将看到一张显示单词和音标的闪卡（正面）。
    *   点击 **"Reveal Answer"**（揭晓答案）翻转卡片，查看中文释义和例句。


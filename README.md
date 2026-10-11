# 🌐 VaaniX — Real-Time Multilingual Conversational Bot

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/Multilingual-Communication-00A86B?style=for-the-badge" alt="Multilingual Communication"/>
  <img src="https://img.shields.io/badge/React-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="React and TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Database-Neon_PostgreSQL-0080FF?style=for-the-badge" alt="PostgreSQL"/>
</p>

<p align="center">
  <b>Breaking language barriers. Connecting voices. Empowering communication.</b>
</p>

---

## 📌 About VaaniX

**VaaniX** is an AI-powered multilingual conversational platform designed to make digital communication more accessible, natural, and inclusive.

By combining modern web technologies with generative AI, VaaniX aims to enable users to interact with an intelligent conversational assistant across supported languages.

The platform integrates a React and TypeScript frontend, a Node.js backend, Google's Gemini API, and Neon Serverless PostgreSQL to support AI-powered conversations, contextual interaction, and message persistence.

VaaniX also incorporates benchmarking functionality to evaluate aspects of multilingual AI performance and provide a foundation for further research and improvement.

🎯 **Our Mission:** To reduce language barriers through intelligent, accessible, and context-aware AI communication.

---

## ✨ Key Features

- 🌍 **Multilingual AI Conversations** — Designed to support conversations across multiple languages.
- 🤖 **Generative AI Integration** — Uses Google's Gemini API to generate conversational responses.
- 💬 **Context-Aware Conversations** — Builds context from recent conversation history to support continuity.
- 🧠 **Conversation Memory** — Supports conversation-context handling and database-backed message storage.
- 📊 **AI Benchmarking** — Provides functionality for evaluating multilingual conversational performance.
- ⚡ **Modern User Interface** — Built with React, TypeScript, and Vite.
- 🔗 **REST API Architecture** — Connects the frontend and backend through HTTP APIs.
- 💾 **Persistent Data Storage** — Integrates Neon Serverless PostgreSQL for supported database operations.
- 🔐 **Secure Configuration** — Uses environment variables for API keys and database credentials.
- 🧩 **Modular Architecture** — Separates frontend components, backend routes, and services for maintainability.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, TypeScript, Vite |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Artificial Intelligence | Google Gemini API |
| Database | Neon Serverless PostgreSQL |
| Database Connectivity | @neondatabase/serverless |
| API Communication | REST APIs |
| Package Management | npm |
| Version Control | Git and GitHub |

---

## 🏗️ System Architecture

```text
                    👤 USER
                       |
                       ▼
              🌐 REACT FRONTEND
             (React + TypeScript)
                       |
                       ▼
                  🔗 REST API
                       |
                       ▼
              🟢 NODE.JS BACKEND
                (Express.js)
                       |
              ┌────────┴────────┐
              |                 |
              ▼                 ▼
        🤖 GEMINI AI      🗄️ NEON DATABASE
       Response Generation  PostgreSQL
              |                 |
              └────────┬────────┘
                       |
                       ▼
              💬 CONVERSATIONAL
                   RESPONSE
                       |
                       ▼
                    👤 USER
```

### 🔄 How It Works

1. 👤 The user interacts with the VaaniX frontend.
2. 🌐 The React application sends requests to the backend.
3. 🟢 The backend processes incoming requests and prepares relevant conversation context.
4. 🤖 The Gemini API generates an AI response when required.
5. 🗄️ Database-backed features can store and retrieve conversation messages.
6. 💬 The backend returns the response to the frontend.
7. ⚡ The interface displays the response to the user.

---

## 📁 Project Structure

```text
Realtime-Multilingual-Conversational-Bot/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── .gitignore
└── README.md
```

> 📌 This is a representative structure. Actual filenames and directories may differ depending on the current implementation.

---

## ⚙️ Prerequisites

Before running VaaniX, ensure you have the following installed:

- 🟢 **Node.js** — LTS version recommended.
- 📦 **npm** — Included with Node.js.
- 🐙 **Git** — For cloning and managing the repository.
- 🔑 **Google Gemini API key** — For Gemini-powered features.
- 🗄️ **Neon PostgreSQL database** — For database-dependent functionality.

### 📥 Download the Prerequisites

- Node.js: https://nodejs.org/
- Git: https://git-scm.com/
- Google AI Studio: https://aistudio.google.com/
- Neon Database: https://neon.tech/

---

## 🚀 Getting Started

Follow these steps to clone, configure, and run VaaniX locally.

### 1️⃣ Clone the Repository

Open your terminal or Git Bash and run:

```bash
git clone https://github.com/adithyask7002/Realtime-Multilingual-Conversational-Bot.git
```

### 2️⃣ Navigate to the Project Directory

```bash
cd Realtime-Multilingual-Conversational-Bot
```

### 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4️⃣ Install Backend Dependencies

Open a second terminal in the project root and run:

```bash
cd backend
npm install
```

---

## 🔐 Environment Configuration

VaaniX uses environment variables to configure its AI integration and database connectivity.

### 🟢 Backend Environment Variables

Create a `.env` file inside the `backend/` directory.

Add the following configuration, adjusting the variable names to match those used by your backend code:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_neon_postgresql_connection_string
```

Replace the placeholder values with your actual credentials.

**Important:** The backend must use the same environment variable names configured here. Check your backend source code before starting the application.

### 🌐 Frontend Environment Variables

If your frontend uses `VITE_API_BASE_URL`, create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Only add this variable if your frontend is configured to use it.

⚠️ **Security Notice**

- Never upload `.env` files containing secrets to GitHub.
- Never expose your Gemini API key in frontend code.
- Never place database credentials in variables prefixed with `VITE_`.
- Keep your `.gitignore` configured to exclude secret files.
- Rotate credentials immediately if they are accidentally exposed.

---

## ▶️ Running VaaniX Locally

The frontend and backend run separately during development. Keep both terminals open.

### 🖥️ Terminal 1 — Start the Backend

Open a terminal in VS Code and execute:

```bash
cd backend
npm install
npm run dev
```

If `npm run dev` is not defined in your backend's `package.json`, use the start command configured by your project.

For example, if your backend uses a `start` script:

```bash
npm start
```

When the backend starts successfully, it should display a message indicating that the server is running.

Example:

```text
================================
       VAANIX BACKEND
================================
Server: http://localhost:5000
Health: http://localhost:5000/api/health
================================
```

### 🌐 Terminal 2 — Start the Frontend

Open another terminal in VS Code.

Execute:

```bash
cd frontend
npm install
npm run dev
```

Vite will display a local development address.

Example:

```text
VITE ready

Local: http://localhost:5173/
```

Open the displayed URL in your browser.

🎉 **Congratulations! VaaniX is now running locally.**

> 💡 If Vite displays a different port, use the URL shown in your terminal.

---

## 🔍 Backend Health Check

Once the backend is running, open the following endpoint in your browser:

http://localhost:5000/api/health

A successful response indicates that the backend health endpoint is accessible.

If the endpoint fails, check the following:

- Is the backend running?
- Is the server using port `5000`?
- Does the backend define the `/api/health` route?
- Are the required environment variables configured?
- Are there any errors in the backend terminal?

---

## 📊 Benchmarking and Evaluation

VaaniX includes benchmarking functionality intended to support the evaluation of multilingual conversational AI.

Potential evaluation metrics include:

| Metric | Description |
|---|---|
| 🎙️ Speech Recognition Accuracy | Measures the accuracy of speech-to-text conversion when ASR is implemented. |
| 🌍 Language Identification | Evaluates the ability to identify the language of an input. |
| 🔄 Code-Switching Performance | Examines handling of inputs that mix multiple languages. |
| ⚡ Response Latency | Measures the time required to generate a response. |
| 🔊 Text-to-Speech Quality | Evaluates speech naturalness when TTS is implemented. |
| 📈 Language-Wise Performance | Compares evaluation results across supported languages. |

📌 **Research Integrity:** Report only metrics that have been measured using actual tests. Include the evaluation dataset, sample size, methodology, and baseline system when presenting benchmark results.

---

## 🔒 Security Best Practices

Security is an important part of developing reliable AI applications.

- 🔑 Store API keys in environment variables.
- 🚫 Never commit credentials to version control.
- 🛡️ Validate incoming API requests.
- 🌐 Configure CORS for trusted frontend origins.
- 🔐 Use HTTPS in production.
- 📉 Implement appropriate rate limiting.
- 🧹 Avoid logging sensitive user information.
- 🔄 Rotate credentials if they are exposed.
- 📦 Keep project dependencies updated.

---

## 🌱 Future Scope

Potential improvements and future development directions include:

- 📱 Mobile-friendly conversational experiences.
- 🎤 Enhanced speech recognition and synthesis.
- 🌍 Expanded language support.
- 📡 Offline and on-device AI inference.
- 🧪 Larger multilingual evaluation datasets.
- 📊 Advanced benchmarking dashboards.
- 🔄 Improved conversational memory.
- ☁️ Cloud deployment and scalable infrastructure.
- ♿ More accessible and inclusive interaction design.

These are potential enhancements and should not be interpreted as implemented features unless they are available in the current version.

---

## 👨‍💻 Developer

### Adithya Sampath Kumar

🎓 Computer Science and Engineering  
🏛️ Alliance University, Bengaluru, India

🔗 GitHub Profile: https://github.com/adithyask7002

📂 Project Repository: https://github.com/adithyask7002/Realtime-Multilingual-Conversational-Bot

---

## 🤝 Contributions

Contributions, suggestions, and constructive feedback are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your implementation.
5. Submit a pull request describing your improvements.

Please ensure that your changes do not expose credentials or sensitive information.

---

## 📜 License

No license has been specified yet.

Before distributing or reusing this project, consider selecting an appropriate open-source license and adding a `LICENSE` file.

---

<p align="center">
  <h3 align="center">🌐 VaaniX</h3>
  <p align="center">
    <b>Breaking Barriers. Connecting Voices. Empowering Communication.</b>
  </p>
  <p align="center">
    Built with ❤️ using modern web technologies and AI.
  </p>
</p>

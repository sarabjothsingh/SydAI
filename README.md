# SYD: Summarise Your Documents 📄✨

SYD (Summarise Your Documents) is an AI-powered assistant designed to help students, professionals, and researchers efficiently extract key insights from large volumes of text. This project combines a **retrieval-augmented generation (RAG)** pipeline with a user-friendly, chatbot-style interface, making it a powerful tool for quick and effective document analysis.

## Key Features

* **Intelligent Summarization**: Upload your PDFs and other documents, and SYD will generate context-aware summaries.
* **Semantic Search**: Ask questions about your documents using natural language. The system's **vector database** understands the meaning behind your query, retrieving the most relevant sections for an accurate answer.
* **Modern Chatbot Interface**: The user interface is designed to be intuitive and simple. It includes a collapsible sidebar for managing your uploaded files and options to switch between different AI models.
* **Personalized Experience**: The system offers personalized greetings to create a more engaging and user-friendly interaction.

SYD is built to be fast, simple, and effective, eliminating the need to manually sift through lengthy documents to find the information you need.

***

## Tech Stack 🛠️

SYD is a full-stack application leveraging a modern combination of technologies to create a seamless and powerful AI experience.

### Frontend
The user interface is built with TypeScript, HTML, and CSS, delivering a responsive and interactive experience. It powers the clean chatbot-style design, file management features, authentication flows, and model selection functionality.

### Backend & AI Pipeline
The server-side logic and the core AI functionalities are powered by **Python**. This is the primary language for the RAG pipeline. The backend is responsible for:
* **Document Processing**: Handling the uploaded PDFs and other files.
* **Vector Embeddings**: Converting text from the documents into numerical vectors. This process captures the semantic meaning of the text.
* **Vector Database**: Storing the vector embeddings in a specialized database, such as **ChromaDB** or a similar open-source solution, which is optimized for fast and efficient semantic search.
* **LLM Integration**: Interfacing with large language models to generate summaries and answers based on the retrieved information. This ensures the output is contextually relevant and accurate.
* **APIs**: Providing APIs that allow the frontend to communicate with the backend services.

### Core Concepts Explained
The project relies on two main AI concepts:

* **Retrieval-Augmented Generation (RAG)**: This framework enhances a large language model by giving it access to external, up-to-date information. Instead of relying only on its pre-trained data, the model first *retrieves* relevant information from your uploaded documents and then uses that information to *generate* a more informed and accurate response. This is crucial for grounding the AI's answers in the specific content of your files and preventing hallucinations.
* **Vector Database**: Unlike traditional databases that search for exact keywords, a vector database stores data as numerical vectors (embeddings) in a high-dimensional space.  When you ask a question, your query is also converted into a vector. The database then performs a **semantic search** to find the document sections whose vectors are "closest" to your query's vector, representing the most relevant information based on meaning, not just keywords.

***

## Project Team

This project was developed by a team of NIIT University students.

* Agnishwar Raychaudhuri - agnishwar.raychaudhuri22@st.niituniversity.in
* Yuvraj Chawla - yuvraj.chawla22@st.niituniversity.in
* Sarab Bhatia - sarabjoth.bhatia22@st.niituniversity.in
* Samarth Tanay - samarth.tanay22@st.niituniversity.in
* Gautam Sharma - gautam.sharma22@st.niituniversity.in
* Mannat Ashish Nayak - mannat.nayak22@st.niituniversity.in

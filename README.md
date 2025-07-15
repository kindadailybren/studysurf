<p align="center">
  <img src="https://img.shields.io/badge/built%20with-AWS-orange?style=for-the-badge&logo=amazonaws" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <br />
  <img src="https://img.shields.io/badge/S3-Storage-orange?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/DynamoDB-Database-4053D6?style=for-the-badge&logo=amazon-dynamodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Cognito-Auth-ED6C30?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/CloudFront-CDN-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white" />
</p>

---

# 🎬 StudySurf

**Turn your study documents into visually inducing videos.**

This project allows users to convert their study materials (text, notes, or slides) into engaging video formats using a seamless stack of modern web and cloud technologies.

---

## 🔥 Features

- 📄 Upload study documents (PDFs, text, or markdown)
- 🧠 AI-enhanced visual & text segmentation
- 🎨 Generate dynamic video scenes with narration

---

## 🛠️ Tech Stack

| Technology     | Purpose                    |
|----------------|----------------------------|
| **React**      | Frontend UI                |
| **FastAPI**    | Backend APIs               |
| **AWS S3**     | File Storage               |
| **AWS Cognito**| User Authentication        |
| **DynamoDB**   | NoSQL Database             |
| **CloudFront** | CDN for video delivery     |

---

## 📦 Project Structure

/frontend         → React App  
/infra              → Infrastructure (CDK), Backend  

---

## 🚀 Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---
## Frontend Testing

1. Go to the frontend directory and use vite to run the React app

```bash
cd frontend
npm run dev
```

## Backend Testing

1. Create a virtual environment and activate it:

```bash
python -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
```

2. Use uvicorn to run the FastAPI server:

```bash
cd infra/lambdaFunctions/backend
pip install -r requirements.txt
uvicorn app:app --reload
```

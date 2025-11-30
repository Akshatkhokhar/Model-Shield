# Model-Shield


Model Shield — AI Firewall for LLM Applications

Model Shield is a security layer for LLM-based applications that detects and blocks malicious prompts, unsafe content, and abnormal responses before they reach end users. It acts as an AI firewall that sits between the user and the model to enforce safety policies and provide visibility into threats.

The system includes a React-based frontend, a FastAPI backend, and a real-time admin dashboard for monitoring prompt activity and threat events.

Overview

LLMs are vulnerable to prompt injection, jailbreak techniques, data leakage, and misuse. Model Shield mitigates these risks by applying rule-based validation and structured threat detection on every input before it is processed.

It provides:

Input validation

Threat categorization

Logging and audit trail

Admin monitoring interface

Configurable rule engine

Key Features

Prompt Injection Detection
Detects policy override attempts such as "ignore all previous instructions" and other jailbreak patterns.

Unsafe Content Filtering
Blocks disallowed or suspicious input based on keywords and rules.

Admin Dashboard
Displays blocked prompts, injection attempts, and suspicious activity in real time.

Rule Engine (Mock Implementation)
Keyword-based detection and configurable block rules.

Audit Logging
Logs every security-relevant request with reason and user source.

Frontend Health Indicator
Confirms backend connectivity from the UI.

Technology Stack
Frontend

React

Vite

JavaScript

CSS / UI Framework

Backend

FastAPI

Python

REST API

System Features

In-memory logging (mock mode)

Rule processing

Prompt filtering logic

Project Structure
Model-Shield/
│
├── frontend/          # React frontend
│
├── backend/           # FastAPI backend
│   ├── rules/         # Rule engine logic
│   ├── logs/          # Logging module
│   ├── routes/        # API routes
│   └── main.py        # Application entry
│
└── README.md

Setup Instructions
Backend (FastAPI)
cd backend

python -m venv venv
venv\Scripts\activate         # Windows
source venv/bin/activate     # Linux / Mac

pip install -r requirements.txt
uvicorn main:app --reload


Backend will run on:

http://127.0.0.1:8000

Frontend (React)
cd frontend
npm install
npm run dev


Frontend will run on:

http://localhost:5173

How It Works
User Prompt → Model Shield → Rule Engine → Decision → Response / Block → Log Entry


Each request is:

Intercepted

Validated against known threat patterns

Classified

Logged

Allowed or rejected

Admin Dashboard

The dashboard provides:

Blocked prompt count

Injection attempt count

Hallucination flags (future)

Threat classification

Request source tracking

Rule configuration view

Accessible from:

/dashboard

Example Behavior
Malicious Input
Ignore all previous instructions


Result:

Blocked

Reason: Prompt Injection Detected

Safe Input
List beginner-friendly datasets


Result:

Allowed

Processed normally

System Status

Current limitations:

No authentication system

In-memory log storage

Static rule configuration

No database integration

Mock hallucination detection

Planned Enhancements

Database-backed logging

Authentication & roles

AI-powered detection model

Webhook alerts

Dashboard filtering

Rule editor persistence

Cloud deployment

Multi-user support

Author

Developed by Akshat

License

MIT License (or specify appropriate license)

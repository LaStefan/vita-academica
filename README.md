# 📚 Vita Academica  
<p align="center">
  <img src="https://img.shields.io/github/last-commit/github/docs" alt="Last Commit">
  <img src="https://img.shields.io/github/issues/github/docs" alt="Issues">
  <img src="https://img.shields.io/github/issues-pr/github/docs" alt="Pull Requests">
  <img src="https://img.shields.io/github/license/github/docs" alt="License">
  <img src="https://img.shields.io/github/contributors/github/docs" alt="Contributors">
  <img src="https://img.shields.io/github/repo-size/github/docs" alt="Repo Size">
</p>


> **A seamless digital platform for academic portfolio management.**  
> Easily upload and manage CVs, generate academic websites, export in multiple formats (PDF, LaTeX, Word), and share achievements. AI-powered automation saves time, while university integrations simplify faculty management. 🚀🎓  

---

## 🌟 Features  
✅ **AI-powered CV Parsing** – Extracts and organizes academic data automatically  
✅ **Multi-format Export** – Export CVs in PDF, Word, LaTeX  
✅ **Website Generation** – Create academic websites from templates  
✅ **University Integration** – Bulk licensing for institutions  
✅ **Easy Authentication** – Google, ORCID, and email sign-up  

---

## 🛠️ Tech Stack  

| **Category**  | **Technology**  |
|--------------|---------------|
| **Frontend** | Next.js (React), Tailwind CSS |
| **Backend**  | Node.js (Express) |
| **Database** | Firebase Firestore |
| **AI & Parsing** | OpenAI API, Natural Language Processing (NLP) |
| **Authentication** | Firebase Auth (Google, ORCID, Email) |
| **Storage** | Firebase Storage (CVs, Documents) |
| **Hosting** | Vercel (Frontend), Firebase Hosting (Static Websites) |
| **Deployment** | Docker, GitHub Actions (CI/CD) |

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/yourusername/vita-academica.git
cd vita-academica
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Set Up Environment Variables
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```
### 4️⃣ Run the Development Server
```bash
npm run dev
```
App will be available at: http://localhost:3000

## 📦 Deployment
### Frontend (Next.js) - Vercel
  1. Push code to GitHub
  2. Connect the GitHub repository to **Vercel**
  3. Deploy via **Vercel Dashboard**
### Backend (Firebase Functions & Firestore)
  1. Install Firebase CLI
```bash
npm install -g firebase-tools
```
  2. Login to Firebase
```bash
firebase login
```
  3. Deploy Backend
```bash
firebase deploy
```

## 🤝 Contributing
For contributions follow these steps:
1. 
```bash
git checkout master
git pull
```
2. Create a new branch
```bash
git checkout -b feature-name
```
3. Make changes & commit
```bash
git add . (adding all changed files for commiting)
git commit -m "Added new feature"
```
4. Push changes
```bash
git push origin feature-name
```
5. Open a Pull Request 🎉

## 📄 License
This project is licensed under the MIT License.

## 💬 Contact & Community
📧 Email: support@vitaacademica.com
🌍 Website: www.vitaacademica.com
🐦 Twitter: @VitaAcademica
📘 LinkedIn: Vita Academica


# 5-Minute Presentation & Demo Script

**Project**: AI-Powered Crop Advisory System for Uttarakhand Farmers  
**Speaker**: Project Developer  

---

## ⏱️ Timeline & Presentation Structure

| Section | Duration | Key Talking Points |
|---|---|---|
| 1. Introduction | 0:30 | Greeting, TBI project context, problem statement in Uttarakhand hill farming |
| 2. Project Overview | 0:45 | Decoupled full-stack architecture, key features (auth, crop registry, AI, analytics) |
| 3. Technology Stack | 0:45 | Next.js 16, Express.js, Supabase PostgreSQL, Google Gemini AI, Vercel & Render |
| 4. Live Demo Walkthrough | 2:00 | Login/Signup, Crop Management, AI Chatbot query, Chat History & Analytics |
| 5. Deployment & Security | 0:30 | Vercel & Render production hosting, OAuth 2.0 security, zero localhost hardcoding |
| 6. Conclusion & Q&A | 0:30 | Impact summary, future scope (Hindi/dialect support, disease image recognition) |

---

## 📜 Complete Presentation Script

### Section 1: Introduction (0:00 - 0:30)
> *"Good day everyone! Today, I am proud to present the **AI-Powered Crop Advisory System**, developed specifically to address the unique agricultural challenges faced by farmers in Uttarakhand's hill regions.*
> 
> *Mountain agriculture in Uttarakhand involves sloped terrace farming, acidic soils, rainfed irrigation, and regional crops like Mandua finger millet, Jhangora, and Munsiyari Rajma. General agricultural apps often provide advice tailored for plains agriculture. Our platform delivers localized, real-time, AI-driven guidance tailored to hill farming."*

### Section 2: Project Overview & Features (0:30 - 1:15)
> *"The platform is a comprehensive full-stack solution featuring:
> 1. **Authentication**: JWT-based sign-in and single-click Google OAuth 2.0 login.
> 2. **Crop Registry**: A persistent database of crop characteristics, seasonal recommendations, and fertilizer guidance.
> 3. **AI Advisory Chatbot**: Powered by Google Gemini 3.1 Flash, providing markdown-rendered answers, auto title generation, and copy-response tools.
> 4. **Session History**: Full conversation persistence with pinned chats, favorite stars, title renaming, and JSON export/import.
> 5. **Analytics Dashboard**: Interactive Chart.js analytics tracking conversation metrics."*

### Section 3: Technology Stack (1:15 - 2:00)
> *"Our technology stack is built for performance, security, and scalability:
> - **Frontend**: Next.js 16 App Router, React 19, and Tailwind CSS.
> - **Backend**: Express.js REST API with rate limiting, trust proxy headers, and central error handling.
> - **Database**: Supabase PostgreSQL utilizing transaction connection pooling on port 6543.
> - **AI Engine**: Google Generative AI SDK (`@google/generative-ai`) customized with localized prompt boundaries.
> - **Hosting**: Deployed live on Vercel for the frontend and Render for the backend API."*

### Section 4: Live Demo Walkthrough (2:00 - 4:00)
> *"Let us step through a live demonstration of the deployed production application:
> 
> 1. **Landing Page & Theme Toggle**: We start at `https://crop-advisory-tau.vercel.app`. Notice the clean header, dark/light theme switcher, and responsive layout.
> 2. **Authentication**: Navigating to `/login`, users can sign in with credentials or click 'Continue with Google'. Our backend handles the OAuth flow seamlessly.
> 3. **Crop Registry (`/crops`)**: Here we see crop cards fetched live from Supabase. We can search crops in real-time, view detailed soil and water requirements, or manage crop records.
> 4. **AI Chatbot (`/chatbot`)**: Let's type a query: *'How to manage Apple Scab disease in Uttarkashi?'*. Notice the rapid response powered by Gemini AI, rendered with rich headers and bullet points, along with options to pin, star, export, or rename the chat.
> 5. **Analytics Dashboard (`/dashboard`)**: The dashboard aggregates user interaction metrics, visual chart breakdowns, and account statistics."*

### Section 5: Deployment & Security (4:00 - 4:30)
> *"From a deployment and security perspective:
> - The backend health check at `/api/health` returns `{"status":"healthy"}`.
> - All frontend requests dynamically use `NEXT_PUBLIC_API_URL`.
> - All connection strings and error logs sanitize secrets to prevent data leakage.
> - Stack traces are strictly suppressed in production."*

### Section 6: Conclusion & Future Scope (4:30 - 5:00)
> *"In conclusion, the AI Crop Advisory System provides a reliable, scalable platform for Uttarakhand agriculture. Looking forward, we plan to introduce voice input, Hindi and Kumaoni/Garhwali dialect support, and AI leaf disease image diagnosis.
> 
> Thank you for your time, and I am now happy to answer any questions!"*

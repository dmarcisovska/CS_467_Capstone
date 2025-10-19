# Hosting Setup (Render and Supabase)

### 1. Render Setup

1. Go to https://render.com/
2. Sign up for an account (any method)
3. Select "Create new project"
4. Select "New Web Service"
5. Connect to your GitHub account
    * Note: you can select just the Capstone project repo 
6. Fill out the application details:
    - **Name**: CS 467 Capstone
    - **Language/runtime environment**: Node
    - **Branch**: main
    - **Region**: Oregon (US West)
    - **Root Directory**: backend
    - **Build Command**: npm install
    - **Start Command**: node server.js
    - **Instance Type**: Free
    - **Environment Variables**: Add `DATABASE_URL` from `.env`
    - **Auto-Deploy**: After CI Checks Pass

7. Deploy the application
8. Make note of the `Service ID` (used later in GitHub CI/CD)
9. Go to your Account (top right corner)
10. Scroll down to "API Keys" and select "Create API Key"
    * Name it whatever, I did `staging`
11. Make note of the `API Key` (also for GitHub CI/CD)

### 2. GitHub CI/CD Setup
1. Go to "Settings"
2. Under "Security" on the left navbar, open "Secrets and variables" then select "Actions"
3. Under "Repository secrets" select "New repository secret"
4. Add the following secrets:
    1. Name=`RENDER_SERVICE_ID`, Secret=Value from step 8 of Render Setup
    1. Name=`RENDER_API_KEY`, Secret=Value from step 11 of Render Setup


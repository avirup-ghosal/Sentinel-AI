# Sentinel-AI: Automated Vulnerability Remediation Platform

![Status](https://img.shields.io/badge/Status-Operational-success) ![Tech](https://img.shields.io/badge/Tech-Kestra%20%7C%20Docker%20%7C%20Gemini%20AI-blue) ![Security](https://img.shields.io/badge/Security-Trivy%20%7C%20Gitleaks-red)

**Sentinel-AI** is an autonomous DevSecOps agent that detects security vulnerabilities in GitHub repositories and *automatically writes the code to fix them*.



## 🚀 The Problem
In modern software development, **"Alert Fatigue"** is a critical issue. Security scanners (SAST/DAST) generate massive reports of vulnerabilities, but developers often ignore them because manual remediation is tedious.
* **High MTTR:** Patching dependencies takes days or weeks.
* **Toil:** Developers waste hours context-switching to fix minor version conflicts.
* **Risk:** Critical CVEs remain exposed due to backlog prioritization.

## 🛠 The Solution
I built an **Agentic Workflow** that acts as a "Virtual Security Engineer." It doesn't just find bugs; it fixes them.

**Sentinel-AI** orchestrates a pipeline that:
1.  **Scans** untrusted code in an ephemeral Docker sandbox using Trivy and Gitleaks.
2.  **Analyzes** vulnerabilities using **Google Gemini 2.5** (LLM).
3.  **Patches** the `package.json` file intelligently (checking for breaking changes).
4.  **Delivers** the fix by automatically opening a **Pull Request** on GitHub.

## 🏗 Architecture
<img width="1245" height="592" alt="Screenshot from 2026-01-19 20-54-35" src="https://github.com/user-attachments/assets/4caed073-e65b-4262-942b-697a777552d6" />



## Set up the project locally
Follow these steps to deploy the entire DevSecOps pipeline on your local machine using Docker.
### Prerequisites
Ensure you have the following installed:
* [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) (Running)
* [Git](https://git-scm.com/install/windows)
## Clone the repository
```bash
git clone https://github.com/avirup-ghosal/Sentinel-AI.git
cd Sentinel-AI
```
## Configure Secrets
```bash
cd kestra
touch .env
```
Add these variables to your env file
```ini
POSTGRES_DB="postgres-db-name"
POSTGRES_USER="postgres-user-name"
POSTGRES_PASSWORD="postgres-password"
KESTRA_USERNAME="kestra-username"
KESTRA_PASSWORD="kestra-password"
GOOGLE_API_KEY_64=
GITHUB_TOKEN_64=

```
**Encode your keys:**
    Run the following commands in your terminal to get the Base64 strings:

* **Mac/Linux:**
```bash
echo -n "YOUR_RAW_API_KEY" | base64
```
* **Windows (PowerShell):**
  ```powershell
  [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("YOUR_RAW_API_KEY"))
  ```
  **Update the `.env` file:**
* Paste the *encoded* output strings into your `.env` file:
  ```ini
    GOOGLE_API_KEY_64="AIzaSyD..."  <-- Paste Base64 string here
    GITHUB_TOKEN_64="Z2hwXz..."     <-- Paste Base64 string here
  ```
## Start the Docker Containers with Docker Compose
```bash
docker compose up -d
```
## Import & Execute the Flow

### 1. Import the Workflow
The logic for the pipeline is defined in `flows/scan-repo.yaml`. You need to load this into Kestra.

1.  Open your browser and go to the **Kestra UI**: [http://localhost:8080](http://localhost:8080).
2.  On the left sidebar, click **Flows** -> **Create**.
3.  Open the file `flows/scan-repo.yaml` from this repository in your code editor.
4.  **Copy** the entire YAML content and **Paste** it into the Kestra Source editor.
5.  Click **Save**.

### 2. Run the Pipeline
1.  Click the purple **New Execution** button.
2.  Enter the required inputs:
    * `repoUrl`: The HTTPS URL of the target repository (e.g., `https://github.com/your-username/vulnerable-repo`).
    * `baseBranch`: The branch to scan (e.g., `master` or `main`).
3.  Click **Execute**.
4.  Watch the **Gantt View** or **Logs** to see the tasks turn green as the AI fixes your code! 







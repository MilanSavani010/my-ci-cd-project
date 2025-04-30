# Step 1 : Project Preparation

### 1. Create Project folder:
---
**Open Command Prompt, PowerShell or Git Bash, and run**:
```Bash
mkdir my-ci-cd-project
cd my-ci-cd-project
```

### 2. Initialize your porject:
---
- For **Node.js**:
```Bash
npm init -y
```
- For **.NET**:
```Bash
dotnet new console -n MyCiCdApp
cd MyCiCdApp
```

### 3. Create `.gitignore` file:
---
- For **Node.js**:
```Bash
echo node_modules/ > .gitignore
```

- For **.NET**:
```Bash
echo bin/ > .gitignore
echo obj/ >> .gitignore
```

### 4. Write a basic application file:
---
- Example for **Node.js**(`index.js`):
```javascript
console.log("Hello CI/CD World!");
```

- Example for **.NET**(`program.cs`):
```javascript
Console.WriteLine("Hello CI/CD World!");
```

---
# Step 2: Set Up Git Repository 
### 1. Initialize Git locally :
---
**In your project folder (where your `index.js` or `program.cs` is):**
```Bash
git init
```

### 2. Make Your First Commit :
---
```Bash
git add .
git commit -m "Initial commit -Hello World"
```

### 3. Create a Remote Repository
---
- Go to GitHub (or GitLab, Bitbucket).
- Click "**New Repository**"
- **Repository name** : (example `my-ci-cd-project`)
- Keep it **public** or **private** -- your choice.
- **DO NOT** initialize with README (because your local project already exist).

**When done, GitHub will show you some commands.
you'll see something like:**

```Bash
git remote add origin https://github.com/yout-username/my-ci-cd-project.git
```
### 4. Push Code to Remote
---
Now push your local code to GitHub:
```Bash
git branch -M main
git push -u origin main
```
---
# Step 3: Setup Docker Integration
### 1. Create a Dockerfile
**Inside your project root folder(`my-ci-cd-project`), create a file named exactly:**
```nginx
Dockerfile
```
**No extention, just `Dockerfile`**

### Example Dockerfile for Node.js
```Dockerfile
# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy Package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the application code
COPY .  .

# Build the project
RUN npm run build

# Expose a port (if needed)
EXPOSE 3000

# Start the app
CMD ["npm","start"]

```
### 2. Test Docker Build Locally 
**Open your terminal (Powershell, Git Bash) inside your project folder and run:**

```Bash
docker build -t my-ci-cd-app . 
```

- `my-ci-cd-app` is the name you are giving to your image.
- Docker will read the `Dockerfile` and create an image.

**After building, run the container:**
```Bash
docker run -p 3000:3000 my-ci-cd-app
```
- This maps your local port `3000` to the container's port `3000`.

Visit `http://localhost:3000` to see your app running(if your app has a server).

# Step 4: Configure Github Actions for CI/CD
### 1. Create Workflow Folder&File
in your project folder:
```Bash
mkdir -p .github/workflows
```

Then inside that folder, create a file named:
```
ci.yml
```

### 2. Content of `ci.yml`
```yaml
name: CI Pipeline - Node.js with Docker

on:
    push:
        branches: ["main"]
    pull_request:
        branches: ["main"]

jobs:
    build: 
        runs-on: ubuntu-latest
    
        steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Set up Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '18'
        
        - name: Install dependencies
          run: npm install

        - name: Run build step
          run: npm run build
        
        - name: Build Docker image
          run: docker build -t my-ci-cd-app .
```

 **Notes:**
 - `actions/checkout` - Pulls your GitHub repo's code.
 - `setup-node` - Install Node.js 18.x.
 - `npm install` - Installs packages from your `package.json`.
 - `docker build` - Uses the Dockerfile to build your image.
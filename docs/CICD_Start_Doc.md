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
---
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
---
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

---
# Step 4: Configure Github Actions for CI/CD
### 1. Create Workflow Folder&File
---
in your project folder:
```Bash
mkdir -p .github/workflows
```

Then inside that folder, create a file named:
```
ci.yml
```

### 2. Content of `ci.yml`
---
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

---
# Step 5: Push Docker Images to Docker Hub (CI/CD Integration)
  
### 1. Prerequisites
---
Create a Docker Hub account if you haven't already. 
Create a Docker Hub repository.

### 2. Store Docker Hub Credentials in GitHub Secrets
---
1. Go to your GitHub repo -> Settings -> Secrets and variables -> Actions -> new repository secret 
2. Add these secrets:

|Name|Value
|-----|-----|
|DOCKER_USERNAME| Your Docker Hub username|
|DOCKER_PASSWORD| Your Docker Hub password|

### 3. Update GitHub Actions Workflow(`ci.yml`)
---

```yml
name: CI/CD Pipeline - Node.js with Docker Push

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-push:
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

      - name: Run build
        run: npm run build

      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest .

      - name: Push Docker image
        run: docker push ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest

```

---
# Step 6: Add Automated Test Stage to CI

### 1. Install Jest (or your preffered testing framework)
---
**Run this locally in your Node.js project:**
```Bash
npm install --save-dev jest
```

**Then, add this to your `package.json`**:
```json
"scripts": {
  "start": "node index.js",
  "build": "echo \"No build step necessary\"",
  "test": "jest"
}
```

### 2. Add a Basic Test File 
---
**Create a folder called `tests/`, and inside it a file called `app.test.js`**:

```javascript
// tests/app.test.js

test('Sample test: 2 + 2 = 4', () => {
  expect(2 + 2).toBe(4);
});
```
**You can later write tests for your actual business logic here.**

### 3. update GitHub Actions Workflow to Include Tests
---
**Update your `.github/workflows/ci.yml` to include the test step:**

```yml
name: CI/CD Pipeline - Node.js with Docker Push

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-push:
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

      - name: Run build
        run: npm run build
      
      - name: Run tests
        run: npm test

      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest .

      - name: Push Docker image
        run: docker push ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest

```

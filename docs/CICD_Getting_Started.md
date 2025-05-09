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
---
# Step 7. Deployment Stage
**Assumprtion:**
You have access to remote **VM/Server** (can be DigitalOcean, AWS EC2, your own server) with:
- Docker installed
- SSH access enabled

### 1. GitHub Secrets Needed
---
**Add these secrets to your GitHub repo(under Setting > Secrets and variables > Actions):**

|Name|Value|
|-----|----|
| `HOST` | Server IP or domain (e.g. `192.168.1.50`)|
|`USERNAME`| SSH username(e.g., `ubuntu`)|
|`SSH_PRIVATE_KEY`| Paste your private SSH key (no password prompts)|

**Generate SSH Key (if you don't have one yet)**

Run this locally (and do not enter a passphrase):
```Bash
ssh-keygen -t rsa -b 4096 -c "deploy@ci-cd"
```

Then:
- Add the public key(`~/.ssh/id_rsa.pub`) to the `~/.ssh/autorized_keys` of your server.
- Paste the private key (`~/ssh/id_rsa`) into GitHub secret as `SSH_PRIVATE_KEY`.
---
### 2. Add Deploy job to `ci.yml`
---
**Extend your GitHub Actions workflow like this:**
```yml
name: CI/CD Pipeline - Node.js with Docker Push

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
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

      - name: Deploy to remote server via SSH
        uses: appleboy/ssh-actions@v1.0.0
        with: 
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: | 
        docker pull ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest
        docker stop my-ci-cd-app || true
        docker rm my-ci-cd-app || true
        docker run -d --name my-ci-cd-app -p 80:3000 ${{secrets.DOCKER_USERNAME}} //my-ci-cd-app:latest
```

**What this does:**
- SSHs into your server
- Pulls the latest Docker image from Docker Hub
- Stops and removes old container
- Runs the new container on port 80(which maps to port 3000 in app)

---
# Step 7 (optional): Deployment stage with Azure Cloud VM
## 1 Set Up Azure VM (Linux) for Deployment
**Prerequisites**
- Azure for Students account
- Azure CLI installed
- SSH key pair (you can generate one below if not already)

### 1.1: Login to Azure
```Bash
az login
```

### 1.2: Create SSH Key Pair (If not Already)
```Bash
ssh-keygen -t rsa -b 4096 -C "milan-azure-vm" -f ~/.ssh/milan_azure_vm
```
It will create:
- `~/.ssh/milan_azure_vm` -> private key
- `~/.ssh/milan_azure_vm.pub` -> public key
We will use the public key when creating the VM.

### 1.3: Create Resource Group
```Bash
az group create --name my-vm-rg --location westeurope
```

### 1.4: Create Virtual Machine 
```Bash
az vm create \
 --resource-group my-vm-rg \
 --name milan-node-vm \
 --image Ubuntu2204 \
 --admin-username azureuser \
 --size Standard_B1s \
 --authentication-type ssh \
 --ssh-key-values ~/.ssh/milan_azure_vm.pub \
 --public-ip-sku Standard
```

## 1.5: Open Required Ports (HTTP and SSH)
```
az vm -resource-group my-vm-rg --name milan-node-vm --port 22 --priority 100
az vm -resource-group my-vm-rg --name milan-node-vm --port 80 --priority 200
```

<pre>--priority         : Rule priority, between 100 (highest priority) and 4096 (lowest priority).
                     Must be unique for each rule in the collection.  Default: 900.</pre>

## 1.6: Connect to the VM via SSH
```Bash
ssh -i ~/.ssh/milan_azure_vm azureuser@<public-ip>
```

**You can find the public IP using:**
```Bash
az vm show --resource-group my-vm-rg --name milan-node-vm -d --query publicIps -o tsv
```

### 1.7: Install Docker on the VM
**Once SSH'ed into the VM:**
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow current user to use Docker without sudo
sudo usermod -aG docker $USER

# Logout and reconnect to activate group change
exit
```

Then reconnect:
```Bash
ssh -i ~/.ssh/milan_azure_vm azureuser@<public-ip>
```

Verify Docker:
```Bash
docker --version
```

## 2. CI/CD Setup to Deploy Dockerized Node.js App to Azure VM

### 2.1: Add Secrets to GitHub
Go to your GitHub repo -> Settings -> Secrets -> Actions -> New repository secret, and add the following:

| Secret Name       | Value (example)                                                                      |
| ----------------- | ------------------------------------------------------------------------------------ |
| `HOST`            | The public IP of your Azure VM (get it via Azure CLI)                                |
| `USERNAME`        | `azureuser` (or whatever you used during VM creation)                                |
| `SSH_PRIVATE_KEY` | Contents of `~/.ssh/milan_azure_vm` (your private key, **not** `.pub`)               |
| `DOCKER_USERNAME` | Your Docker Hub username                                                             |
| `DOCKER_PASSWORD` | Your Docker Hub password or [access token](https://hub.docker.com/settings/security) |

### 2.2: Add GitHub Actions Workflow 
Create or update `.github/workflows/ci.yml`
```yml
name: CI/CD to Azure VM

on:
  push:
    branches: [ "main" ]

jobs:
  build-test-deploy:
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

      - name: Run tests
        run: npm test

      - name: Login to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest .

      - name: Push Docker image
        run: docker push ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest

      - name: Deploy on Azure VM using SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
            docker pull ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest
            docker stop my-ci-cd-app || true
            docker rm my-ci-cd-app || true
            docker run -d --name my-ci-cd-app -p 80:3000 ${{ secrets.DOCKER_USERNAME }}/my-ci-cd-app:latest

```

### 2.3: Push to GitHub and Watch the Workflow
When you push changes to `main` branch:
- The app is built and tested
- Docker image is pushed to Docker Hub
- Your Azure VM pulls the image and restarts the container

### 2.4: Visit Your App
Once the container is running, visit your Azure VM IP:
```
http://<your-vm-ip>
```
Make sure your Node.js app listens on port `3000`, and Docker exposes is as `-p 80:3000`.

# Step 7(Optional): Deployment Stage with Azure WebApp service
## 1. Prepare Your Azure Web App

**A. Create the Web App(if not done yet):**
You can do this in the Azure Portal or CLI

**Azure CLI:**
```Bash
az login 

az group create --name milan-node-rg --location westeurope

az provider register --namespace Microsoft.Web

az appservice plan create --name milan-appservice-plan --resource-group milan-node-rg --sku FREE

 az webapp list-runtimes --os-type windows

az webapp create --name milan-node-webapp --resource-group milan-node-rg --plan milan-appservice-plan --runtime "NODE:18LTS"
```

## 2. Add Deployment Credentials to GitHub Secrets

Go to GitHub → Your Repo → Settings → Secrets → Actions → Add the following:

| Secret Name             | Description                   |
| ----------------------- | ----------------------------- |
| `AZURE_WEBAPP_NAME`     | e.g., `milan-node-webapp`     |
| `AZURE_PUBLISH_PROFILE` | From Azure Portal (see below) |

**To get the publish profile:**
1. Go to your Azure Web App -> Overview
2. Click "Get publish profile" -> Download it.
3. Open it and copy the XML content. 
4. Paste the whole content into GitHub Secret `AZURE_PUBLISH_PROFILE`.

## 3. GitHub Actions Workflow for Azure Web App
Add this to `.github/workflows/deploy.yml`:

```yml
name: Deploy Node.js to Azure Web App

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build app
        run: npm run build || echo "no build script, skipping"

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: .

```

**After deployment**
- your app will be live at:
```
https://<your-webapp-name>.azurewebsites.net
```
- make sure your app listens on `process.env.PORT`:
```js
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}`));
```
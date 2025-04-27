# Step 1 : Project Preparation
## 1. Create Project folder:
**Open Command Prompt, PowerShell or Git Bash, and run**:
```Bash
mkdir my-ci-cd-project
cd my-ci-cd-project
```

## 2. Initialize your porject:
- For **Node.js**:
```Bash
npm init -y
```
- For **.NET**:
```Bash
dotnet new console -n MyCiCdApp
cd MyCiCdApp
```

## 3. Create `.gitignore` file:
- For **Node.js**:
```Bash
echo node_modules/ > .gitignore
```

- For **.NET**:
```Bash
echo bin/ > .gitignore
echo obj/ >> .gitignore
```

## 4. Write a basic application file:
- Example for **Node.js**(`index.js`):
```javascript
console.log("Hello CI/CD World!");
```

- Example for **.NET**(`program.cs`):
```javascript
Console.WriteLine("Hello CI/CD World!");
```


# Step 2: Set Up Git Repository 
## 1. Initialize Git locally :
In your project folder (where your `index.js` or `program.cs` is):
```Bash
git init
```

## 2. Make Your First Commit :
```Bash
git add .
git commit -m "Initial commit -Hello World"
```

# 3. Create a Remote Repository
- Go to GitHub (or GitLab, Bitbucket).
- Click "**New Repository**"
- **Repository name** : (example `my-ci-cd-project`)
- Keep it **public** or **private** -- your choice.
- **DO NOT** initialize with README (because your local project already exist).

When done, GitHub will show you some commands.
you'll see something like:

```Bash
git remote add origin https://github.com/yout-username/my-ci-cd-project.git
```

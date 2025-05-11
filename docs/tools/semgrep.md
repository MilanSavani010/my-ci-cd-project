# TOOL 1: Gitleaks

**Gitleaks is a tool designed to detect secrets like passwords, API keys, and tokens in Git repositories. When used in CI/CD pipelines, it helps prevent sensitive information from being exposed. Here are some common commands and options for using Gitleaks in CI/CD:**

### Basic Commands
- `gitleacks detect` - Scans a repository for secrets.
- `gitleaks protect` - Runs in pre-commit mode to prevent secrets from being commited.
- `gitleaks report` - Generates a report of detected secrets.

### Command Options 
- `--repo-path=<path>` - Specifies the repository path to scan.
- `--config=<file>` - Uses a custom configuration file (`gitleaks.toml`).
- `--verbose` - Enables verbose output for debugging.
- `--redact` - Redacts secrets in the output.
- `--exclude=<pattern>` - Excludes specific files or directories from scanning.
- `--report=<format>` - specifies the report format(e.g., JSON,CSV).
- `--exit-code=<code>` - Sets the exit code behavior for CI/CD integration.

## Use Cases

### **1. `gitleaks detect` – Scan a repository for secrets**
This command scans the current Git repository for sensitive data.
```sh
gitleaks detect --repo-path=. --verbose
```
**Example output:**
```sh
[INFO] Scanning repository...
[FINDING] Hardcoded AWS secret found in src/config.json
[FINDING] API token detected in main.py
[INFO] Scan completed. 2 secrets found.
```
---
### **2. `gitleaks protect` – Prevent committing secrets**
Runs Gitleaks in a pre-commit hook to block any commits with secrets.
```sh
gitleaks protect --repo-path=.
```
**Example output when trying to commit a secret:**
```sh
[ERROR] Commit blocked! Hardcoded password detected in app/config.yaml
```
---
### **3. `gitleaks report` – Generate a report**
Creates a report of detected secrets in a specified format (e.g., JSON).
```sh
gitleaks report --repo-path=. --report=json > report.json
```
**Example output (JSON format):**
```json
{
  "findings": [
    {
      "file": "config.json",
      "line": 15,
      "match": "aws_secret_key=AKIA...",
    },
    {
      "file": "main.py",
      "line": 42,
      "match": "api_token=eyJhbGciOi...",
    }
  ]
}
```
---
### **4. Using a custom config file**
```sh
gitleaks detect --config=gitleaks.toml --repo-path=.
```
**Example config snippet (`gitleaks.toml`):**
```toml
title = "Custom Gitleaks Config"
[[rules]]
id = "generic-api-key"
regex = '''(?i)(api[_-]?key):[\s]*[a-z0-9]{32,40}'''
```
---
### **5. Excluding specific paths**
```sh
gitleaks detect --repo-path=. --exclude="test/*"
```
This excludes files inside the `test/` directory from scanning.

---
### **6. Controlling CI/CD exit codes**
```sh
gitleaks detect --repo-path=. --exit-code=1
```
If secrets are found, the command exits with status `1`, making CI/CD pipelines fail.




# TOOL 2: Semgrep

**CLI Refference** : https://semgrep.dev/docs/cli-reference

**Semgrep** is a powerful static analysis tool that helps detect security vulnerabilities and enforce coding standards. It's widely used in **CI/CD pipelines** to scan code automatically.

### **Basic Semgrep Commands**
- `semgrep scan` – Runs Semgrep rules on local files or folders.
- `semgrep ci` – Runs Semgrep on a **git diff** (ideal for CI/CD).
- `semgrep login` – Authenticates with **semgrep.dev** for cloud-based scanning.
- `semgrep publish` – Uploads custom rules to **semgrep.dev**.
- `semgrep validate` – Validates Semgrep rules before running them.

### **Common Options**
- `--config=<source>` – Specifies the rules to use (e.g., `--config=auto`).
- `--exclude=<pattern>` – Excludes specific files or directories.
- `--json` – Outputs results in **JSON format**.
- `--metrics=off` – Disables telemetry data collection.
- `--autofix` – Automatically applies fixes for detected issues (experimental).
- `--exit-code=<code>` – Controls exit behavior for CI/CD integration.

## Use Cases


## **1. `semgrep scan` – Scan local code for vulnerabilities**
### **Use Case: Security Audit**
When reviewing a repository for **common security flaws** like SQL injections or hardcoded credentials.
```sh
semgrep scan --config=auto --json
```
✅ Automatically detects security issues using built-in rule sets.

---

## **2. `semgrep ci` – Scan changes in a CI/CD pipeline**
### **Use Case: Enforce secure coding in pull requests**
Runs Semgrep **only on modified files** in a PR to avoid unnecessary scanning.
```sh
semgrep ci --config=auto
```
✅ Ensures developers don’t introduce security bugs in new code.

---

## **3. `semgrep login` – Authenticate with Semgrep cloud**
### **Use Case: Centralized rule management**
Allows teams to manage **custom security rules** across repositories via **semgrep.dev**.
```sh
semgrep login
```
✅ Syncs with Semgrep cloud to apply **organization-wide security policies**.

---

## **4. `semgrep publish` – Share custom rules**
### **Use Case: Internal compliance enforcement**
Teams can publish custom rules that reflect their **secure coding standards**.
```sh
semgrep publish --config=myrules.yml
```
✅ Ensures all developers follow internal security best practices.

---

## **5. `semgrep validate` – Check rule correctness**
### **Use Case: Debugging rule errors**
Verifies that newly written Semgrep rules **function correctly** before use.
```sh
semgrep validate --config=custom-rules.yml
```
✅ Prevents false positives and ensures **reliable rule execution**.

---

## **Common Options**
### **1. `--config=<source>` – Select a rule set**
#### **Use Case: Apply OWASP security rules**
Scans code for **OWASP Top 10 vulnerabilities**.
```sh
semgrep scan --config=owasp-top-ten
```
✅ Helps developers avoid common **security pitfalls**.

---

### **2. `--exclude=<pattern>` – Ignore files**
#### **Use Case: Skip third-party libraries**
Excludes the `node_modules` directory from scanning.
```sh
semgrep scan --config=auto --exclude=node_modules
```
✅ Speeds up scans by **skipping irrelevant files**.

---

### **3. `--json` – Output structured results**
#### **Use Case: Automated alerts**
Formats scan results in **JSON for integrations** (e.g., Slack or Jira alerts).
```sh
semgrep scan --config=auto --json > results.json
```
✅ Enables **automated security reporting**.

---

### **4. `--metrics=off` – Disable telemetry**
#### **Use Case: Privacy-sensitive environments**
Prevents Semgrep from sending usage data.
```sh
semgrep scan --config=auto --metrics=off
```
✅ Ensures compliance with **data protection policies**.

---

### **5. `--autofix` – Apply automatic fixes**
#### **Use Case: Fix coding style violations**
Auto-corrects formatting issues based on rules.
```sh
semgrep scan --config=style-guide --autofix
```
✅ Helps maintain **consistent code quality**.

---

### **6. `--exit-code=<code>` – Control pipeline failures**
#### **Use Case: Fail CI/CD if high-risk issues are found**
Ensures the pipeline fails if critical issues are detected.
```sh
semgrep scan --config=auto --exit-code=1
```
✅ Prevents insecure code from being deployed.

---

# Gitleaks

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


```mermaid
graph TD
    A0[Start] --> A
    A[Developer Commit] -->|Pre-Commit Hook| B{Gitleaks Secret Scan}
    B -->|Secrets Found| C[Block Commit<br>Show Report]
    B -->|No Secrets| D[Commit to Repository]

    D -->|Push/Pull Request| E[CI/CD Pipeline Start]

    E --> F[Secret Scanning Job<br>Gitleaks Scan]
    F -->|Secrets Found| G[Fail Pipeline<br>Upload Report<br>Notify Slack<br>Create GitHub Issue]
    F -->|No Secrets| H[Parallel Jobs]

    subgraph Parallel Jobs
        H --> I[Backend Job]
        H --> J[Frontend Job]

        I --> I1[Checkout Code]
        I1 --> I2[Setup Node.js]
        I2 --> I3[Install Dependencies]
        I3 --> I4[Lint Code]
        I4 --> I5[Run Tests]
        I5 --> I6[Build]
        I6 --> I7[SAST: Semgrep<br>Generate Report]
        I7 --> I8[SCA: Dependency-Check<br>Generate Report]
        I8 --> I9[SBOM: Syft<br>Generate Report]
        I9 --> I10[Fuzz Testing: go-fuzz<br>Generate Report]
        I10 --> I11[Upload Reports]

        J --> J1[Checkout Code]
        J1 --> J2[Setup Node.js]
        J2 --> J3[Install Dependencies]
        J3 --> J4[Lint Code]
        J4 --> J5[Run Tests]
        J5 --> J6[Build]
        J6 --> J7[SAST: Semgrep<br>Generate Report]
        J7 --> J8[SCA: Dependency-Check<br>Generate Report]
        J8 --> J9[SBOM: Syft<br>Generate Report]
        J9 --> J10[Upload Reports]
    end

    H -->|After Parallel Jobs| K[Security Scans Job]
    K --> K1[Build Docker Image]
    K1 --> K2[Image Scanning: Trivy<br>Generate Report]
    K2 --> K3[DAST: OWASP ZAP<br>Generate Report]
    K3 --> K4[Check Reports<br>Secrets or Critical/High Vulns?]
    K4 -->|Yes| L[Fail Pipeline<br>Upload Reports<br>Notify Slack<br>Create GitHub Issue]
    K4 -->|No| M[Generate Dashboard Job]

    M --> M1[Download Artifacts]
    M1 --> M2[Generate Dashboard Data<br>vulnerability-data.json]
    M2 --> M3[Deploy to GitHub Pages<br>dashboard.html]

    M -->|If main branch| N[Deploy Job]
    N --> N1[Configure AWS CLI]
    N1 --> N2[Build & Push Backend Docker Image]
    N2 --> N3[Deploy Backend to AWS ECS]
    N3 --> N4[Deploy Frontend to S3]
    N4 --> N5[Invalidate CloudFront Cache]

    C -->|Fix Secrets| A
    G -->|Fix Secrets| A
    L -->|Fix Vulnerabilities| A
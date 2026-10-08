# 🚀 StudySurf CI/CD Workflows

Modern trunk-based multi-environment deployment pipelines using GitHub Actions, AWS CDK, and CloudFront.

---

## 📁 Active Workflows

| Workflow | File | Trigger | Environments | Description |
| :--- | :--- | :--- | :--- | :--- |
| **CI Validation** | `ci.yaml` | Pull Request to `main` | N/A | Lints & compiles TypeScript (frontend + infra), validates Python compilation, and runs `cdk synth` for dev, staging, and prod. Zero deployments on PR. |
| **Deploy to Dev** | `deploy-dev.yaml` | Push / Merge to `main` | `development` | Continuous automated deployment: deploys `dev-StatefulStack` + `dev-StatelessStack`, dynamically parses outputs, builds frontend, syncs to S3, and invalidates CloudFront. |
| **Deploy to Staging** | `deploy-staging.yaml` | Manual `workflow_dispatch` | `staging` | One-click manual promotion to Staging: deploys stateful & stateless stacks, syncs frontend, and invalidates Staging CloudFront. |
| **Deploy to Prod** | `deploy-prod.yaml` | Manual `workflow_dispatch` | `production` | One-click production release: deploys `prod-StatefulStack` + `prod-StatelessStack`, syncs production frontend build to S3, and invalidates Prod CloudFront. |

---

## 🔐 AWS Authentication & Credentials

Workflows support both **AWS IAM OIDC** (recommended, zero static keys) and GitHub repository secrets:

### Option A: AWS IAM OIDC (Recommended)
Configure GitHub OIDC in AWS IAM and set the role ARN secrets:
* `AWS_ROLE_TO_ASSUME` (or per-environment `AWS_ROLE_TO_ASSUME_DEV`, `AWS_ROLE_TO_ASSUME_STAGING`, `AWS_ROLE_TO_ASSUME_PROD`)
* `AWS_REGION` (e.g. `ap-southeast-1`)

### Option B: Static IAM Secrets (Fallback)
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_REGION`

---

## 🛠️ Local Development & Testing

### Frontend
```bash
cd frontend
npm ci
npm run build
```

### Infrastructure (CDK)
```bash
cd infra
npm ci
npm run build
npx cdk synth dev-StatefulStack dev-StatelessStack
```

### Backend (Python FastAPI)
```bash
cd infra/lambdaFunctions/backend
python -m pip install -r requirements.txt
python -m compileall -q .
```

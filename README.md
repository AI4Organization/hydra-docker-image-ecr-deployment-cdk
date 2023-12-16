# Hydra Docker Image ECR Deployment CDK

This repository contains the AWS CDK (Cloud Development Kit) application for deploying a Docker image to Amazon Elastic Container Registry (ECR) using TypeScript.

## 💪 Benchmarks - fastest Postgres aggregates on earth

Benchmarks were run on a c6a.4xlarge (16 vCPU, 32 GB RAM) with 500 GB of GP2 storage. Results in seconds, smaller is better.

![Hydra - the open source data warehouse](https://github.com/hydradatabase/hydra/blob/main/.images/ReadmeBenchmarks.png)

This benchmark represents typical workload in the following areas: clickstream and traffic analysis, web analytics, machine-generated data, structured logs, and events data.

![Hydra - the open source data warehouse](https://github.com/hydradatabase/hydra/blob/main/.images/FasterthanPG.png)

## Features

- Defines an ECR repository.
- Implements lifecycle rules for the ECR repository.
- Builds and pushes a Docker image to the created ECR repository.
- Uses environment variables for configuration.

## Usage

To use the CDK application, you need to have AWS credentials configured. Then you can deploy the stack to your AWS account using the AWS CDK CLI.

### Prerequisites

- AWS Account
- AWS CLI configured
- Node.js
- AWS CDK

### Installation

1. Install dependencies:

```bash
npm install
```

2. Compile TypeScript to JavaScript:

```bash
npm run build
```

3. Deploy the stack to your AWS account:

```bash
npx cdk deploy
```

### Configuration

Configuration is done via environment variables. You can set them directly or use a `.env` file.

#### Environment Variables

- `POSTGRES_PORT`: The port for the PostgreSQL database (default: `5432`).
- `POSTGRES_USER`: The user for the PostgreSQL database (default: `postgres`).
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database (default: `postgres`).
- `POSTGRES_DB`: The database name for the PostgreSQL database (default: `hydra`).
- `POSTGRES_BASE_VERSION`: The base version of PostgreSQL (default: `16.1`).
- `CDK_DEPLOY_REGIONS`: Comma-separated list of AWS regions for deployment (default: `us-east-1`).
- `ENVIRONMENTS`: Comma-separated list of deployment environments (default: `dev,stg,prod`).
- `ECR_REPOSITORY_NAME`: The name of the ECR repository (default: `hydradatabase-docker-image-erc-repository`).
- `APP_NAME`: The name of the application (default: `hydradatabase`).
- `IMAGE_VERSION`: The version tag for the Docker image (default: `latest`).

## Structure

- `bin/`: The CDK application entry point.
- `lib/`: CDK constructs and stacks.
- `test/`: Unit tests for the CDK application.
- `package.json`: Project metadata and dependencies.
- `package-lock.json`: Locked versions of dependencies.
- `tsconfig.json`: TypeScript configuration.
- `.env.example`: Example environment variables file.
- `.gitignore`: Specifies intentionally untracked files to ignore.
- `.npmignore`: Specifies files to be ignored when publishing to npm.
- `jest.config.js`: Configuration for Jest testing framework.
- `README.md`: The README file.

## License

This project is licensed under the MIT License.

## Contributors

- [KennyDizi](https://github.com/KennyDizi)

Feel free to contribute to this project by submitting a pull request.

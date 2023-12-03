#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { HydraDockerImageEcrDeploymentCdkStack } from '../lib/hydra-docker-image-ecr-deployment-cdk-stack';

dotenv.config(); // Load environment variables from .env file
const app = new cdk.App();

const { CDK_DEFAULT_ACCOUNT: account, CDK_DEFAULT_REGION: region } = process.env;

const cdkRegions = process.env.CDK_DEPLOY_REGIONS?.split(',') ?? [region]; // Parsing comma separated list of regions
const environments = process.env.ENVIRONMENTS?.split(',') ?? ['dev']; // Parsing comma separated list of environments

const DEFAULT_IMAGE_VERSION = 'latest';

const envTyped = {
  POSTGRES_PORT: process.env.POSTGRES_PORT ?? '5432',
  POSTGRES_USER: process.env.POSTGRES_USER ?? 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'postgres',
  POSTGRES_BASE_VERSION: process.env.POSTGRES_BASE_VERSION ?? '16.1',
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME ?? 'hydra',
}

for (const cdkRegion of cdkRegions) {
  for (const environment of environments) {
    new HydraDockerImageEcrDeploymentCdkStack(app, `HydraDockerImageEcrDeploymentCdkStack-${cdkRegion}-${environment}`, {
      env: {
        account,
        region: cdkRegion,
      },
      tags: {
        environment,
      },
      repositoryName: `${process.env.ECR_REPOSITORY_NAME}-${environment}` ?? 'hydradatabase-docker-image-ecr-deployment-cdk',
      appName: process.env.APP_NAME ?? 'hydradatabase',
      imageVersion: process.env.IMAGE_VERSION ?? DEFAULT_IMAGE_VERSION,
      environment: environment,
      envTyped: envTyped,
    });
  }
}

app.synth();

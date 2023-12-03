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
      environment: environment
    });
  }
}

app.synth();
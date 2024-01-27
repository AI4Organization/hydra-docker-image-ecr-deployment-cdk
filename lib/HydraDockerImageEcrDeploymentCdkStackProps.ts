import * as cdk from 'aws-cdk-lib';
import { IEnvTyped } from '../process-env-typed';

/**
 * Interface representing the properties required for the Hydra Docker Image ECR Deployment CDK Stack.
 *
 * @param repositoryName - The name of the ECR repository.
 * @param appName - The name of the application.
 * @param imageVersion - (Optional) The version of the Docker image to deploy. Defaults to the latest version.
 * @param environment - (Optional) The deployment environment (e.g., development, staging, production).
 * @param envTyped - An object containing typed environment variables.
 */
export interface HydraDockerImageEcrDeploymentCdkStackProps extends cdk.StackProps {
    readonly repositoryName: string;
    readonly appName: string;
    imageVersion?: string;
    environment?: string;
    envTyped: IEnvTyped;
}

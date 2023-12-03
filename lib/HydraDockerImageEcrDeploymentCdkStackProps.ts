import * as cdk from 'aws-cdk-lib';

export interface HydraDockerImageEcrDeploymentCdkStackProps extends cdk.StackProps {
    readonly repositoryName: string;
    readonly appName: string;
    imageVersion?: string;
    environment?: string;
}

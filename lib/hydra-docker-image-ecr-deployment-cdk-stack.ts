import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecrDeploy from 'cdk-ecr-deployment';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { HydraDockerImageEcrDeploymentCdkStackProps } from './HydraDockerImageEcrDeploymentCdkStackProps';

export class HydraDockerImageEcrDeploymentCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HydraDockerImageEcrDeploymentCdkStackProps) {
    super(scope, id, props);

    const ecrRepository = new ecr.Repository(this, `${props.appName}-${props.environment}-DockerImageEcrRepository`, {
      repositoryName: props.repositoryName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: ecr.RepositoryEncryption.AES_256
    });

    ecrRepository.addLifecycleRule({ maxImageAge: cdk.Duration.days(7), rulePriority: 1, tagStatus: ecr.TagStatus.UNTAGGED }); // delete images older than 7 days
    ecrRepository.addLifecycleRule({ maxImageCount: 4, rulePriority: 2, tagStatus: ecr.TagStatus.ANY }); // keep last 4 images

    const image = new DockerImageAsset(this, `${props.appName}-${props.environment}-DockerImageAsset`, {
      directory: path.join(__dirname, '../coreservices'),
    });

    new ecrDeploy.ECRDeployment(this, `${props.appName}-${props.environment}-DockerImageECRDeployment`, {
      src: new ecrDeploy.DockerImageName(image.imageUri),
      dest: new ecrDeploy.DockerImageName(`${ecrRepository.repositoryUri}:${props.imageVersion}`),
    });
  }
}
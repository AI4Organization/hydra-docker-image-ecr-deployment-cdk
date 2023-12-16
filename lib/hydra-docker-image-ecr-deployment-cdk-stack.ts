import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecrDeploy from 'cdk-ecr-deployment';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { HydraDockerImageEcrDeploymentCdkStackProps } from './HydraDockerImageEcrDeploymentCdkStackProps';
import { LATEST_IMAGE_VERSION } from '../bin/hydra-docker-image-ecr-deployment-cdk';

export class HydraDockerImageEcrDeploymentCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HydraDockerImageEcrDeploymentCdkStackProps) {
    super(scope, id, props);

    const ecrRepository = new ecr.Repository(this, `${props.appName}-${props.environment}-DockerImageEcrRepository`, {
      repositoryName: props.repositoryName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
      encryption: ecr.RepositoryEncryption.AES_256,
    });

    ecrRepository.addLifecycleRule({ maxImageAge: cdk.Duration.days(7), rulePriority: 1, tagStatus: ecr.TagStatus.UNTAGGED }); // delete images older than 7 days
    ecrRepository.addLifecycleRule({ maxImageCount: 4, rulePriority: 2, tagStatus: ecr.TagStatus.ANY }); // keep last 4 images

    const dockerImageAsset = new DockerImageAsset(this, `${props.appName}-${props.environment}-DockerImageAsset`, {
      directory: path.join(__dirname, '../coreservices'),
      buildArgs: {
        POSTGRES_PORT: props.envTyped.POSTGRES_PORT,
        POSTGRES_USER: props.envTyped.POSTGRES_USER,
        POSTGRES_PASSWORD: props.envTyped.POSTGRES_PASSWORD,
        POSTGRES_BASE_VERSION: props.envTyped.POSTGRES_BASE_VERSION,
        POSTGRES_DB: props.envTyped.POSTGRES_DB,
      },
      platform: Platform.LINUX_ARM64,
      assetName: `hydra`,
    });

    /*
      Run commands:
      docker build -t hydra .
      docker run -d --name hydra \
        -p <HostPort>:5432 \
        -e POSTGRES_USER=<YourPostgresUser> \
        -e POSTGRES_PASSWORD=<YourPostgresPassword> \
        -v /path/to/host/db:/var/lib/postgresql/data \
        -v /path/to/host/postgresql.conf:/etc/postgresql/postgresql.conf \
        hydra
    */

    const deployImageVersions = props.imageVersion === LATEST_IMAGE_VERSION ? props.imageVersion : [props.imageVersion, LATEST_IMAGE_VERSION];
    for (const deployImageVersion of deployImageVersions) {
      new ecrDeploy.ECRDeployment(this, `${props.appName}-${props.environment}-${deployImageVersion}-DockerImageECRDeployment`, {
        src: new ecrDeploy.DockerImageName(dockerImageAsset.imageUri),
        dest: new ecrDeploy.DockerImageName(`${ecrRepository.repositoryUri}:${props.imageVersion}`),
      });
    }

    // print out ecrRepository arn
    const outputName = `${props.appName}-${props.environment}-ECRRepositoryArn`;
    new cdk.CfnOutput(this, outputName, {
      value: ecrRepository.repositoryArn,
      exportName: outputName,
    });
  }
}
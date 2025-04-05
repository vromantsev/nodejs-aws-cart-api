import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Effect } from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CartServiceLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // import existing VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
      vpcId: 'vpc-0d8dcfd265e30886d',
    });

    // import existing security group
    const rdsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'RDSSecurityGroup',
      'sg-002ee558c9e70b023',
    );

    // import db instance
    const dbInstance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(
      this,
      'rds-instance',
      {
        instanceIdentifier: 'rs-app-rds-instance',
        instanceEndpointAddress:
          'rs-app-rds-instance.cfrrhg7oeu3i.eu-north-1.rds.amazonaws.com',
        port: 5432,
        securityGroups: [rdsSecurityGroup],
      },
    );

    // create security group, so lambda can access rds instance
    const lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      'LambdaSecurityGroup',
      {
        vpc: vpc,
        description: 'Security group for Lambda accessing RDS',
        allowAllOutbound: true,
      },
    );

    // add ingress rule to RDS security group
    rdsSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow lambda to access RDS',
    );

    // create a lambda function
    const cartServiceLambda = new lambda.Function(
      this,
      'CartServiceLambdaFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambda.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../src/')),
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [lambdaSecurityGroup],
        environment: {
          DB_ENDPOINT:
            'rs-app-rds-instance.cfrrhg7oeu3i.eu-north-1.rds.amazonaws.com',
          DB_NAME: 'rsAppDb',
          DB_USERNAME: '',
          DB_PASSWORD: '',
        },
      },
    );

    // allow lambda to talk to RDS
    dbInstance.connections.allowDefaultPortFrom(cartServiceLambda);

    // grant permissions to lambda to interact with RDS
    cartServiceLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['rds:*'],
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:rds-db:${this.region}:${this.account}:dbUser:${dbInstance.instanceResourceId}/rsAppUserVr`,
        ],
      }),
    );

    new cdk.CfnOutput(this, 'CartServiceLambdaArn', {
      value: cartServiceLambda.functionArn,
      exportName: 'CartServiceLambdaArn',
    });
  }
}

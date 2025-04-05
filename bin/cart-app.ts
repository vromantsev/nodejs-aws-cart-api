#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CartServiceLambdaStack } from '../lib/cart-service-lambda-stack';

const app = new cdk.App();
new CartServiceLambdaStack(app, 'CartServiceLambdaStack', {
  env: {
    region: 'eu-north-1',
    account: '',
  },
});

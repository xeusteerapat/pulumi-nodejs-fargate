import * as awsx from '@pulumi/awsx';

// 1. Create an ECS Fargate cluster
const cluster = new awsx.ecs.Cluster('cluster');

// 2. Define the networking
const alb = new awsx.lb.ApplicationLoadBalancer('net-lb', {
  external: true,
  securityGroups: cluster.securityGroups,
});

const api = alb.createListener('api', {
  port: 80,
  external: true,
});

// 3. Build and publish Docker image to ECR
const img = awsx.ecs.Image.fromPath('app-img', './app');

// 4. Create a Fargate service task definition
const appService = new awsx.ecs.FargateService('app-svc', {
  cluster,
  taskDefinitionArgs: {
    container: {
      image: img,
      cpu: 128,
      memory: 64,
      portMappings: [api],
    },
  },
  desiredCount: 5,
});

export const url = api.endpoint.hostname;

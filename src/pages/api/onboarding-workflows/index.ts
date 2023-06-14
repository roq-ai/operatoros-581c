import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { onboardingWorkflowValidationSchema } from 'validationSchema/onboarding-workflows';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getOnboardingWorkflows();
    case 'POST':
      return createOnboardingWorkflow();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOnboardingWorkflows() {
    const data = await prisma.onboarding_workflow
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'onboarding_workflow'));
    return res.status(200).json(data);
  }

  async function createOnboardingWorkflow() {
    await onboardingWorkflowValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.saas_account?.length > 0) {
      const create_saas_account = body.saas_account;
      body.saas_account = {
        create: create_saas_account,
      };
    } else {
      delete body.saas_account;
    }
    const data = await prisma.onboarding_workflow.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

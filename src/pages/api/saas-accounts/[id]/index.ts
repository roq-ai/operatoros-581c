import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { saasAccountValidationSchema } from 'validationSchema/saas-accounts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.saas_account
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSaasAccountById();
    case 'PUT':
      return updateSaasAccountById();
    case 'DELETE':
      return deleteSaasAccountById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSaasAccountById() {
    const data = await prisma.saas_account.findFirst(convertQueryToPrismaUtil(req.query, 'saas_account'));
    return res.status(200).json(data);
  }

  async function updateSaasAccountById() {
    await saasAccountValidationSchema.validate(req.body);
    const data = await prisma.saas_account.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSaasAccountById() {
    const data = await prisma.saas_account.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

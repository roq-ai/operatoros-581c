import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { hrisIntegrationValidationSchema } from 'validationSchema/hris-integrations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.hris_integration
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHrisIntegrationById();
    case 'PUT':
      return updateHrisIntegrationById();
    case 'DELETE':
      return deleteHrisIntegrationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHrisIntegrationById() {
    const data = await prisma.hris_integration.findFirst(convertQueryToPrismaUtil(req.query, 'hris_integration'));
    return res.status(200).json(data);
  }

  async function updateHrisIntegrationById() {
    await hrisIntegrationValidationSchema.validate(req.body);
    const data = await prisma.hris_integration.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteHrisIntegrationById() {
    const data = await prisma.hris_integration.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

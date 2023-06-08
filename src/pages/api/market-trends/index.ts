import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { marketTrendValidationSchema } from 'validationSchema/market-trends';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMarketTrends();
    case 'POST':
      return createMarketTrend();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMarketTrends() {
    const data = await prisma.market_trend
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'market_trend'));
    return res.status(200).json(data);
  }

  async function createMarketTrend() {
    await marketTrendValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.market_trend.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

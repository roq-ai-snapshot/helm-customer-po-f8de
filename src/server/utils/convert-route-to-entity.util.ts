const mapping: Record<string, string> = {
  companies: 'company',
  contracts: 'contract',
  deliveries: 'delivery',
  'market-trends': 'market_trend',
  orders: 'order',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

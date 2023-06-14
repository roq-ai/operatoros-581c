const mapping: Record<string, string> = {
  'hris-integrations': 'hris_integration',
  'onboarding-workflows': 'onboarding_workflow',
  organizations: 'organization',
  'saas-accounts': 'saas_account',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

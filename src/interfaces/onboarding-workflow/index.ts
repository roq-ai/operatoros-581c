import { SaasAccountInterface } from 'interfaces/saas-account';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface OnboardingWorkflowInterface {
  id?: string;
  name: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  saas_account?: SaasAccountInterface[];
  organization?: OrganizationInterface;
  _count?: {
    saas_account?: number;
  };
}

export interface OnboardingWorkflowGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}

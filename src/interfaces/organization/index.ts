import { HrisIntegrationInterface } from 'interfaces/hris-integration';
import { OnboardingWorkflowInterface } from 'interfaces/onboarding-workflow';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OrganizationInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  hris_integration?: HrisIntegrationInterface[];
  onboarding_workflow?: OnboardingWorkflowInterface[];
  user?: UserInterface;
  _count?: {
    hris_integration?: number;
    onboarding_workflow?: number;
  };
}

export interface OrganizationGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}

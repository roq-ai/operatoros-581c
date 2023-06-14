import { UserInterface } from 'interfaces/user';
import { OnboardingWorkflowInterface } from 'interfaces/onboarding-workflow';
import { GetQueryInterface } from 'interfaces';

export interface SaasAccountInterface {
  id?: string;
  name: string;
  user_id: string;
  onboarding_workflow_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  onboarding_workflow?: OnboardingWorkflowInterface;
  _count?: {};
}

export interface SaasAccountGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
  onboarding_workflow_id?: string;
}

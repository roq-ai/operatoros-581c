import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface HrisIntegrationInterface {
  id?: string;
  integration_type: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface HrisIntegrationGetQueryInterface extends GetQueryInterface {
  id?: string;
  integration_type?: string;
  organization_id?: string;
}

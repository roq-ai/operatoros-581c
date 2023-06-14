import * as yup from 'yup';
import { saasAccountValidationSchema } from 'validationSchema/saas-accounts';

export const onboardingWorkflowValidationSchema = yup.object().shape({
  name: yup.string().required(),
  organization_id: yup.string().nullable().required(),
  saas_account: yup.array().of(saasAccountValidationSchema),
});

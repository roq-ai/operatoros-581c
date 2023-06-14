import * as yup from 'yup';
import { hrisIntegrationValidationSchema } from 'validationSchema/hris-integrations';
import { onboardingWorkflowValidationSchema } from 'validationSchema/onboarding-workflows';

export const organizationValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  hris_integration: yup.array().of(hrisIntegrationValidationSchema),
  onboarding_workflow: yup.array().of(onboardingWorkflowValidationSchema),
});

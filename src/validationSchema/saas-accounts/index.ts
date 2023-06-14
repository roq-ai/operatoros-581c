import * as yup from 'yup';

export const saasAccountValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  onboarding_workflow_id: yup.string().nullable().required(),
});

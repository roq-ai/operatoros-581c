import * as yup from 'yup';

export const hrisIntegrationValidationSchema = yup.object().shape({
  integration_type: yup.string().required(),
  organization_id: yup.string().nullable().required(),
});

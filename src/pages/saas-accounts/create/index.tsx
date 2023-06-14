import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSaasAccount } from 'apiSdk/saas-accounts';
import { Error } from 'components/error';
import { saasAccountValidationSchema } from 'validationSchema/saas-accounts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OnboardingWorkflowInterface } from 'interfaces/onboarding-workflow';
import { getUsers } from 'apiSdk/users';
import { getOnboardingWorkflows } from 'apiSdk/onboarding-workflows';
import { SaasAccountInterface } from 'interfaces/saas-account';

function SaasAccountCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SaasAccountInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSaasAccount(values);
      resetForm();
      router.push('/saas-accounts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SaasAccountInterface>({
    initialValues: {
      name: '',
      user_id: (router.query.user_id as string) ?? null,
      onboarding_workflow_id: (router.query.onboarding_workflow_id as string) ?? null,
    },
    validationSchema: saasAccountValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Saas Account
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<OnboardingWorkflowInterface>
            formik={formik}
            name={'onboarding_workflow_id'}
            label={'Select Onboarding Workflow'}
            placeholder={'Select Onboarding Workflow'}
            fetcher={getOnboardingWorkflows}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'saas_account',
  operation: AccessOperationEnum.CREATE,
})(SaasAccountCreatePage);

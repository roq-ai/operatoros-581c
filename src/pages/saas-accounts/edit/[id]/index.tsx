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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSaasAccountById, updateSaasAccountById } from 'apiSdk/saas-accounts';
import { Error } from 'components/error';
import { saasAccountValidationSchema } from 'validationSchema/saas-accounts';
import { SaasAccountInterface } from 'interfaces/saas-account';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OnboardingWorkflowInterface } from 'interfaces/onboarding-workflow';
import { getUsers } from 'apiSdk/users';
import { getOnboardingWorkflows } from 'apiSdk/onboarding-workflows';

function SaasAccountEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SaasAccountInterface>(
    () => (id ? `/saas-accounts/${id}` : null),
    () => getSaasAccountById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SaasAccountInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSaasAccountById(id, values);
      mutate(updated);
      resetForm();
      router.push('/saas-accounts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SaasAccountInterface>({
    initialValues: data,
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
            Edit Saas Account
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'saas_account',
  operation: AccessOperationEnum.UPDATE,
})(SaasAccountEditPage);

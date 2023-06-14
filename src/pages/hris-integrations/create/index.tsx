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
import { createHrisIntegration } from 'apiSdk/hris-integrations';
import { Error } from 'components/error';
import { hrisIntegrationValidationSchema } from 'validationSchema/hris-integrations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { HrisIntegrationInterface } from 'interfaces/hris-integration';

function HrisIntegrationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HrisIntegrationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHrisIntegration(values);
      resetForm();
      router.push('/hris-integrations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HrisIntegrationInterface>({
    initialValues: {
      integration_type: '',
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: hrisIntegrationValidationSchema,
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
            Create Hris Integration
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="integration_type" mb="4" isInvalid={!!formik.errors?.integration_type}>
            <FormLabel>Integration Type</FormLabel>
            <Input
              type="text"
              name="integration_type"
              value={formik.values?.integration_type}
              onChange={formik.handleChange}
            />
            {formik.errors.integration_type && <FormErrorMessage>{formik.errors?.integration_type}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
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
  entity: 'hris_integration',
  operation: AccessOperationEnum.CREATE,
})(HrisIntegrationCreatePage);

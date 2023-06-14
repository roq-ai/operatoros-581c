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
import { getHrisIntegrationById, updateHrisIntegrationById } from 'apiSdk/hris-integrations';
import { Error } from 'components/error';
import { hrisIntegrationValidationSchema } from 'validationSchema/hris-integrations';
import { HrisIntegrationInterface } from 'interfaces/hris-integration';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function HrisIntegrationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HrisIntegrationInterface>(
    () => (id ? `/hris-integrations/${id}` : null),
    () => getHrisIntegrationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HrisIntegrationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHrisIntegrationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/hris-integrations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<HrisIntegrationInterface>({
    initialValues: data,
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
            Edit Hris Integration
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'hris_integration',
  operation: AccessOperationEnum.UPDATE,
})(HrisIntegrationEditPage);

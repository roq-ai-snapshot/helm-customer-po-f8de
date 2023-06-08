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
import { useRouter } from 'next/router';
import { createContract } from 'apiSdk/contracts';
import { Error } from 'components/error';
import { contractValidationSchema } from 'validationSchema/contracts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { ContractInterface } from 'interfaces/contract';

function ContractCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ContractInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createContract(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ContractInterface>({
    initialValues: {
      company_id: '',
      start_date: new Date(new Date().toDateString()),
      end_date: new Date(new Date().toDateString()),
      user_id: (router.query.user_id as string) ?? null,
      order: [],
    },
    validationSchema: contractValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Contract
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="company_id" mb="4" isInvalid={!!formik.errors?.company_id}>
            <FormLabel>Company Id</FormLabel>
            <Input type="text" name="company_id" value={formik.values?.company_id} onChange={formik.handleChange} />
            {formik.errors.company_id && <FormErrorMessage>{formik.errors?.company_id}</FormErrorMessage>}
          </FormControl>
          <FormControl id="start_date" mb="4">
            <FormLabel>Start Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.start_date}
              onChange={(value: Date) => formik.setFieldValue('start_date', value)}
            />
          </FormControl>
          <FormControl id="end_date" mb="4">
            <FormLabel>End Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.end_date}
              onChange={(value: Date) => formik.setFieldValue('end_date', value)}
            />
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
  entity: 'contract',
  operation: AccessOperationEnum.CREATE,
})(ContractCreatePage);

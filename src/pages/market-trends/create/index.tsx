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
import { createMarketTrend } from 'apiSdk/market-trends';
import { Error } from 'components/error';
import { marketTrendValidationSchema } from 'validationSchema/market-trends';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { MarketTrendInterface } from 'interfaces/market-trend';

function MarketTrendCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MarketTrendInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMarketTrend(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MarketTrendInterface>({
    initialValues: {
      company_id: '',
      trend_date: new Date(new Date().toDateString()),
      trend_data: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: marketTrendValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Market Trend
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="company_id" mb="4" isInvalid={!!formik.errors?.company_id}>
            <FormLabel>Company Id</FormLabel>
            <Input type="text" name="company_id" value={formik.values?.company_id} onChange={formik.handleChange} />
            {formik.errors.company_id && <FormErrorMessage>{formik.errors?.company_id}</FormErrorMessage>}
          </FormControl>
          <FormControl id="trend_date" mb="4">
            <FormLabel>Trend Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.trend_date}
              onChange={(value: Date) => formik.setFieldValue('trend_date', value)}
            />
          </FormControl>
          <FormControl id="trend_data" mb="4" isInvalid={!!formik.errors?.trend_data}>
            <FormLabel>Trend Data</FormLabel>
            <Input type="text" name="trend_data" value={formik.values?.trend_data} onChange={formik.handleChange} />
            {formik.errors.trend_data && <FormErrorMessage>{formik.errors?.trend_data}</FormErrorMessage>}
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
  entity: 'market_trend',
  operation: AccessOperationEnum.CREATE,
})(MarketTrendCreatePage);

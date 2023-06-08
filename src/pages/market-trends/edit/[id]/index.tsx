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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getMarketTrendById, updateMarketTrendById } from 'apiSdk/market-trends';
import { Error } from 'components/error';
import { marketTrendValidationSchema } from 'validationSchema/market-trends';
import { MarketTrendInterface } from 'interfaces/market-trend';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function MarketTrendEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MarketTrendInterface>(
    () => (id ? `/market-trends/${id}` : null),
    () => getMarketTrendById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MarketTrendInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMarketTrendById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MarketTrendInterface>({
    initialValues: data,
    validationSchema: marketTrendValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Market Trend
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'market_trend',
  operation: AccessOperationEnum.UPDATE,
})(MarketTrendEditPage);

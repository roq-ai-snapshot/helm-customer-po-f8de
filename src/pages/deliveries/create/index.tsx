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
import { createDelivery } from 'apiSdk/deliveries';
import { Error } from 'components/error';
import { deliveryValidationSchema } from 'validationSchema/deliveries';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';
import { getOrders } from 'apiSdk/orders';
import { getUsers } from 'apiSdk/users';
import { DeliveryInterface } from 'interfaces/delivery';

function DeliveryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DeliveryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDelivery(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DeliveryInterface>({
    initialValues: {
      delivery_date: new Date(new Date().toDateString()),
      status: '',
      order_id: (router.query.order_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: deliveryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Delivery
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="delivery_date" mb="4">
            <FormLabel>Delivery Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.delivery_date}
              onChange={(value: Date) => formik.setFieldValue('delivery_date', value)}
            />
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrderInterface>
            formik={formik}
            name={'order_id'}
            label={'Select Order'}
            placeholder={'Select Order'}
            fetcher={getOrders}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.contract_id}
              </option>
            )}
          />
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
  entity: 'delivery',
  operation: AccessOperationEnum.CREATE,
})(DeliveryCreatePage);

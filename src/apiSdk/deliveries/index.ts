import axios from 'axios';
import queryString from 'query-string';
import { DeliveryInterface } from 'interfaces/delivery';
import { GetQueryInterface } from '../../interfaces';

export const getDeliveries = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/deliveries${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDelivery = async (delivery: DeliveryInterface) => {
  const response = await axios.post('/api/deliveries', delivery);
  return response.data;
};

export const updateDeliveryById = async (id: string, delivery: DeliveryInterface) => {
  const response = await axios.put(`/api/deliveries/${id}`, delivery);
  return response.data;
};

export const getDeliveryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/deliveries/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryById = async (id: string) => {
  const response = await axios.delete(`/api/deliveries/${id}`);
  return response.data;
};

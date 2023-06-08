import axios from 'axios';
import queryString from 'query-string';
import { MarketTrendInterface } from 'interfaces/market-trend';
import { GetQueryInterface } from '../../interfaces';

export const getMarketTrends = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/market-trends${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMarketTrend = async (marketTrend: MarketTrendInterface) => {
  const response = await axios.post('/api/market-trends', marketTrend);
  return response.data;
};

export const updateMarketTrendById = async (id: string, marketTrend: MarketTrendInterface) => {
  const response = await axios.put(`/api/market-trends/${id}`, marketTrend);
  return response.data;
};

export const getMarketTrendById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/market-trends/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMarketTrendById = async (id: string) => {
  const response = await axios.delete(`/api/market-trends/${id}`);
  return response.data;
};

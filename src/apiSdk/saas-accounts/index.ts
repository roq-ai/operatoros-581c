import axios from 'axios';
import queryString from 'query-string';
import { SaasAccountInterface, SaasAccountGetQueryInterface } from 'interfaces/saas-account';
import { GetQueryInterface } from '../../interfaces';

export const getSaasAccounts = async (query?: SaasAccountGetQueryInterface) => {
  const response = await axios.get(`/api/saas-accounts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSaasAccount = async (saasAccount: SaasAccountInterface) => {
  const response = await axios.post('/api/saas-accounts', saasAccount);
  return response.data;
};

export const updateSaasAccountById = async (id: string, saasAccount: SaasAccountInterface) => {
  const response = await axios.put(`/api/saas-accounts/${id}`, saasAccount);
  return response.data;
};

export const getSaasAccountById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/saas-accounts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSaasAccountById = async (id: string) => {
  const response = await axios.delete(`/api/saas-accounts/${id}`);
  return response.data;
};

import axios from 'axios';
import queryString from 'query-string';
import { HrisIntegrationInterface, HrisIntegrationGetQueryInterface } from 'interfaces/hris-integration';
import { GetQueryInterface } from '../../interfaces';

export const getHrisIntegrations = async (query?: HrisIntegrationGetQueryInterface) => {
  const response = await axios.get(`/api/hris-integrations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHrisIntegration = async (hrisIntegration: HrisIntegrationInterface) => {
  const response = await axios.post('/api/hris-integrations', hrisIntegration);
  return response.data;
};

export const updateHrisIntegrationById = async (id: string, hrisIntegration: HrisIntegrationInterface) => {
  const response = await axios.put(`/api/hris-integrations/${id}`, hrisIntegration);
  return response.data;
};

export const getHrisIntegrationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/hris-integrations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHrisIntegrationById = async (id: string) => {
  const response = await axios.delete(`/api/hris-integrations/${id}`);
  return response.data;
};

import axios from 'axios';
import queryString from 'query-string';
import { OnboardingWorkflowInterface, OnboardingWorkflowGetQueryInterface } from 'interfaces/onboarding-workflow';
import { GetQueryInterface } from '../../interfaces';

export const getOnboardingWorkflows = async (query?: OnboardingWorkflowGetQueryInterface) => {
  const response = await axios.get(`/api/onboarding-workflows${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOnboardingWorkflow = async (onboardingWorkflow: OnboardingWorkflowInterface) => {
  const response = await axios.post('/api/onboarding-workflows', onboardingWorkflow);
  return response.data;
};

export const updateOnboardingWorkflowById = async (id: string, onboardingWorkflow: OnboardingWorkflowInterface) => {
  const response = await axios.put(`/api/onboarding-workflows/${id}`, onboardingWorkflow);
  return response.data;
};

export const getOnboardingWorkflowById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/onboarding-workflows/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOnboardingWorkflowById = async (id: string) => {
  const response = await axios.delete(`/api/onboarding-workflows/${id}`);
  return response.data;
};

import request from '../../utils/request';
import config from '../../utils/config';

const { api, ftq } = config;
const {productChance:{
  getValueAddProductChanceResponse,
  getProductTree,
  getCustomerContractWillResponse,
  getCustomerSubscriptionProductResponse,
  queryAlphaCusList
}} = ftq

export async function AddedProducted(payload) {
    const option = {
      url: getValueAddProductChanceResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  export async function GetProductTree(payload) {
    const option = {
      url: getProductTree,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  export async function GetCustomerContractWillResponse(payload) {
    const option = {
      url: getCustomerContractWillResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  export async function GetCustomerSubscriptionProductResponse(payload) {
    const option = {
      url: getCustomerSubscriptionProductResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  export async function GetQueryAlphaCusList(payload) {
    const option = {
      url: queryAlphaCusList,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

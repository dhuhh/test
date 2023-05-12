import request from '../../utils/request';
import config from '../../utils/config';

const { ftq } = config;
const { customerTag: {queryCustomer,getTagHoverResponse,getTagUsageAmountRespon,getTagSearchResponse, getTagValidationResponse,getTagEditPermissionResponse, getTagTreeResponse,getTagDetailResponse,getTagEditResponse ,getAllTagTypeResponse,getTagStateEditResponse,getTagNameValidationResp,getTagDeleteResponse,deleteTagType,editTagType,addTagType} } = ftq;

//查询全部标签
export async function getTagTreeList(payload) {
    const option = {
      url: getTagTreeResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }
//获取详情
  export async function getDetail(payload) {
    const option = {
      url: getTagDetailResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }
//保存编辑
  export async function saveEdit(payload) {
    const option = {
      url: getTagEditResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  //标签类型
  export async function getTagType(payload) {
    const option = {
      url: getAllTagTypeResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  //标签上下架
  export async function changeTag(payload) {
    const option = {
      url: getTagStateEditResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

    //查一查
    export async function getTag(payload) {
        const option = {
          url: getTagValidationResponse,
          method: 'post',
          data: payload,
        };
        return request(option);
      }

          //权限
    export async function getResponse(payload) {
        const option = {
          url: getTagEditPermissionResponse,
          method: 'post',
          data: payload,
        };
        return request(option);
      }

    //重名
    export async function getValidationResp(payload) {
        const option = {
          url: getTagNameValidationResp,
          method: 'post',
          data: payload,
        };
        return request(option);
      }
    
    //删除
    export async function getDel(payload) {
        const option = {
          url: getTagDeleteResponse,
          method: 'post',
          data: payload,
        };
        return request(option);
      }

     //搜索
     export async function getSearch(payload) {
        const option = {
          url: getTagSearchResponse,
          method: 'post',
          data: payload,
        };
        return request(option);
      }

    //搜索
    export async function getPopNum(payload) {
        const option = {
          url: getTagUsageAmountRespon,
          method: 'post',
          data: payload,
        };
        return request(option);
      }

    //气泡
    export async function getTagHoverResponseList(payload) {
      const option = {
        url: getTagHoverResponse,
        method: 'post',
        data: payload,
      };
      return request(option);
    }
     //查询
     export async function getQueryCustomer(payload) {
      const option = {
        url: queryCustomer,
        method: 'post',
        data: payload,
      };
      return request(option);
    }
    export async function deleteType(payload) {
      const option = {
        url: deleteTagType,
        method: 'post',
        data: payload,
      };
      return request(option);
    }
    export async function editType(payload) {
      const option = {
        url: editTagType,
        method: 'post',
        data: payload,
      };
      return request(option);
    }
    export async function addType(payload) {
      const option = {
        url: addTagType,
        method: 'post',
        data: payload,
      };
      return request(option);
    }


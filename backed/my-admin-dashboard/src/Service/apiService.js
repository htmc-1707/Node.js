import axios from 'axios';

// Cấu hình base URL cho API
const API_BASE_URL = 'http://localhost:5011/api/admin'; // Thay đổi URL cho phù hợp với backend của bạn

// Tạo một hàm để gửi yêu cầu HTTP
const httpClient = (url, options = {}) => {
  const token = localStorage.getItem('authToken'); // Lấy token từ localStorage

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(`HTTP error! status: ${response.status}, ${error.message}`);
        });
      }
      return response.json(); // Chuyển đổi phản hồi thành JSON
    });
};

// Lấy danh sách các đối tượng
const getList = (resource, params) => {
  const { page, pageSize } = params.pagination;
  const url = `${API_BASE_URL}/${resource}?page=${page - 1}&size=${pageSize}`;

  return httpClient(url)
    .then((json) => {
      const data = json || []; // Dữ liệu trả về từ API
      const total = json.totalElements || data.length; // Tổng số bản ghi từ API

      return { data, total };
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
};

// Lấy thông tin một đối tượng cụ thể
const getOne = (resource, id) => {
  const url = `${API_BASE_URL}/${resource}/${id}`;

  return httpClient(url)
    .then((json) => ({
      data: json,
    }))
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
};

// Tạo mới một đối tượng
const create = (resource, data) => {
    if (resource === 'product' || resource === 'brand' || resource === 'slider') {
      const formData = new FormData();
  
      // Thêm các thuộc tính vào FormData
      for (const key in data) {
        if (key !== 'images') {
          if(key==='imagess'||key==='deletedImages'){
            formData.append(key, JSON.stringify(data[key]));
          }else{
            formData.append(key, data[key]);
          }
        }
      }
  
      // Thêm hình ảnh vào FormData
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          // Kiểm tra nếu là brand và thêm hình ảnh
          if ((resource === 'brand' || resource === 'slider') && image.rawFile) {
            formData.append('image', image.rawFile); // Thêm hình ảnh
          } else if (resource === 'product') {
            formData.append('images', image.rawFile); // Thêm hình ảnh sản phẩm
            formData.append('isMain', image.isMain);
            formData.append('uid', image.uid);
          }
        });
      }
  
      return httpClient(`${API_BASE_URL}/${resource}`, {
        method: 'POST',
        body: formData,
      }).then((json) => ({
        data: { ...data, id: json.id },
      }));
    }
  

    return httpClient(`${API_BASE_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((json) => ({
      data: { ...data, id: json.id },
    }));
  };

// Cập nhật một đối tượng
const update = (resource, id, data) => {
    if (resource === 'product' || resource === 'brand' || resource === 'slider') {
      const formData = new FormData();
  
      // Thêm các thuộc tính vào FormData
      for (const key in data) {
        if (key !== 'images' && key !== 'image') { // Exclude image field for brand and slider
          formData.append(key, data[key]);
        }
      }
  
    console.log(data)
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image.rawFile);
          formData.append('isMain', image.isMain);
          formData.append('uid', image.uid);
        });
      } else if ((resource === 'brand' || resource === 'slider') && data.image) {
        // For brand and slider, add single image if it exists
        formData.append('image', data.image); // Assuming image is already a file object or blob
      }
  
      return httpClient(`${API_BASE_URL}/${resource}/${id}`, {
        method: 'PUT',
        body: formData,
      }).then((json) => ({
        data: { ...data, id: json.id },
      }));
    }

    return httpClient(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((json) => ({
      data: { ...data, id: json.id },
    }));
  };
  
// Xóa một đối tượng
const remove = (resource, id) => {
  return httpClient(`${API_BASE_URL}/${resource}/${id}`, {
    method: 'DELETE',
  }).then(() => ({
    data: { id },
  }))
  .catch((error) => {
    console.error('Error deleting data:', error);
    throw error;
  });
};

export { getList, getOne, create, update, remove };

import httpAxios from "../Httpaxios";

// Hàm helper để thêm token vào header
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Hàm helper để lưu yêu thích vào localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Hàm helper để lấy yêu thích từ localStorage
const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await httpAxios.post(`cart`, { productId, quantity }, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Lỗi kết nối đến server');
    }
  } else {
    const cart = getCartFromLocalStorage();
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    saveCartToLocalStorage(cart);
    return { message: 'Thêm vào yêu thích thành công' };
  }
};

export const getCart = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await httpAxios.get(`cart`, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Lỗi kết nối đến server');
    }
  } else {
    return { CartItems: getCartFromLocalStorage() };
  }
};

export const updateCartItem = async (id, quantity) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await httpAxios.put(`cart/${id}`, { quantity }, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Lỗi kết nối đến server');
    }
  } else {
    const cart = getCartFromLocalStorage();
    const existingItem = cart.CartItems.find(item => item.productId == id);
    console.log('Existing Item:', existingItem);
    if (existingItem) {
      existingItem.quantity = quantity;

      saveCartToLocalStorage(cart);
      return { message: 'Cập nhật yêu thích thành công' };
    }
    throw new Error('Không tìm thấy sản phẩm trong yêu thích');
  }
};

export const removeFromCart = async (id) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await httpAxios.delete(`cart/${id}`, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Lỗi kết nối đến server');
    }
  } else {
    let cart = getCartFromLocalStorage();
    if (cart.CartItems.length === 1 && cart.CartItems[0].productId === id) {
      localStorage.removeItem('cart');
    } else {
      cart.CartItems = cart.CartItems.filter(item => item.productId !== id);
      saveCartToLocalStorage(cart);
    }
    return { message: 'Xóa sản phẩm khỏi yêu thích thành công' };
  }
};

export const syncCart = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      let cart = getCartFromLocalStorage();
      const productIdQuantity = cart.CartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      const response = await httpAxios.post(`cart/sync`, productIdQuantity, {
        headers: authHeader()
      });
      localStorage.removeItem('cart'); // Xóa yêu thích local sau khi đồng bộ
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Lỗi kết nối đến server');
    }
  } else {
    throw new Error('Người dùng chưa đăng nhập');
  }
};
export const addToCartValidation = {
    productId: 'required|string',
    userId: 'required|string',
    qty: 'required|numeric'
};

export const removeCartValidation = {
    productId: 'required|string',
    userId: 'required|string'
};

export const getCartValidation = {
    userId: 'required|string'
};

export const updateCartValidation = {
    productId: 'required|string',
    userId: 'required|string',
    qty: 'required|numeric'
};

export const getCartCountValidation = {
    userId: 'required|string'
};
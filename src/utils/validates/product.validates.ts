export const addProductValidation = {
    categoryId: 'required|string',
    productBaseMetalId: 'required|string',
    productPlatingId: 'required|string',
    productStoneTypeId: 'required|string',
    productTrendId: 'required|string',
    name: 'required|string',
    image: 'required|array',
    code: 'required|string',
    price: 'required|numeric',
    mrp: 'required|numeric',
    qty: 'required|numeric',
    inSuratCityCharge: 'required|numeric',
    inGujratStateCharge: 'required|numeric',
    inOutStateCharge: 'required|numeric',
    isPramotion: 'boolean',
    isPause: 'boolean'
};

export const updateProductValidation = {
    _id: 'required|string'
}

export const getAllProductValidation = {
    userId: 'string'
}

export const getPramotionProductValidation = {
    userId: 'string'
}

export const updateProductActionValidation = {
    productId: 'required|string'
}

export const getProductByCategoryIdValidation = {
    userId: 'string',
    categoryId: 'required|string'
}

export const getProductByIdValidation = {
    userId: 'string',
    productId: 'required|string'
}

export const deleteProductValidation = {
    productId: 'required|string'
}

export const updateProductPramotionFlagValidation = {
    _id: 'required|string',
    isPramotion: 'required|boolean'
}

export const updateProductDiscountValidation = {
    _id: 'required|string',
    discount: 'required|numeric'
}

export const updateProductRewardValidation = {
    _id: 'required|string',
    reward: 'required|numeric'
}

export const getSearchProductValidation = {
    userId: 'required|string',
    search: 'required|string'
}
export const addProductValidation = {
    categoryId: 'required|string',
    productBaseMetalId: 'required|string',
    productPlatingId: 'required|string',
    productStoneTypeId: 'required|string',
    productTrendId: 'required|string',
    name: 'required|string',
    image: 'required|array',
    code: 'required|string',
    price: 'required|number',
    mrp: 'required|number',
    qty: 'required|number',
    inSuratCityCharge: 'required|number',
    inGujratStateCharge: 'required|number',
    inOutStateCharge: 'required|number',
    isPramotion: 'required|boolean',
    isPause: 'required|boolean'
};

export const updateProductValidation = {
    _id: 'required|string'
}

export const getAllProductValidation = {
    userId: 'required|string'
}

export const getPramotionProductValidation = {
    userId: 'required|string'
}

export const updateProductActionValidation = {
    productId: 'required|string'
}

export const getProductByCategoryIdValidation = {
    userId: 'required|string',
    categoryId: 'required|string'
}

export const getProductByIdValidation = {
    userId: 'required|string',
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
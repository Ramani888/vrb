export const addProductValidation = {
    categoryId: 'required|string',
    name: 'required|string',
    code: 'required|string',
    price: 'required|numeric',
    mrp: 'required|numeric',
    qty: 'required|numeric',
    gst: 'required|string',
    inSuratCityCharge: 'required|numeric',
    inGujratStateCharge: 'required|numeric',
    inOutStateCharge: 'required|numeric',
    productBaseMetalId: 'string',
    productPlatingId: 'string',
    productStoneTypeId: 'string',
    productTrendId: 'string',
    productBrandId: 'string',
    productColorId: 'string',
    productOccasionId: 'string',
    productTypeId: 'string',
    size: 'string',
    weight: 'numeric',
    description: 'string',
    isPramotion: 'boolean',
    isPause: 'boolean',
    discount: 'numeric',
    reward: 'numeric'
};

export const updateProductValidation = {
    _id: 'required|string',
    categoryId: 'string',
    name: 'string',
    code: 'string',
    price: 'numeric',
    mrp: 'numeric',
    qty: 'numeric',
    gst: 'string',
    inSuratCityCharge: 'numeric',
    inGujratStateCharge: 'numeric',
    inOutStateCharge: 'numeric',
    productBaseMetalId: 'string',
    productPlatingId: 'string',
    productStoneTypeId: 'string',
    productTrendId: 'string',
    productBrandId: 'string',
    productColorId: 'string',
    productOccasionId: 'string',
    productTypeId: 'string',
    size: 'string',
    weight: 'numeric',
    description: 'string',
    isPramotion: 'boolean',
    isPause: 'boolean',
    discount: 'numeric',
    reward: 'numeric'
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
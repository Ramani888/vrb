export const registerValidation = {
    mobileNumber: 'required|numeric',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric',
    password: 'required|string',
};

export const registerLoginValidation = {
    mobileNumber: 'required|numeric',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric'
};

export const loginValidation = {
    mobileNumber: 'required|numeric',
    password: 'required|string',
};

export const adminLoginValidation = {
    email: 'required|email',
    password: 'required|string',
};

export const updateUserValidation = {
    _id: 'required|string'
};

export const getUserByIdValidation = {
    userId: 'required|string'
}

export const deleteUserValidation = {
    userId: 'required|string'
}

export const updateUserStatusValidation = {
    _id: 'required|string',
    isActive: 'required|boolean'
}

export const getRewardDataValidation = {
    userId: 'required|string'
}

export const addCapturePaymentValidation = {
    paymentId: 'required|string',
    payment: 'required|numeric'
}

export const getPaymentValidation = {
    paymentId: 'required|string'
}
export const registerValidation = {
    mobileNumber: 'required|numeric',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric',
    password: 'required|string',
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
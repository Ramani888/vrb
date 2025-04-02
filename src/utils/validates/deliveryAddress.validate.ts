export const addDeliveryAddressValidation = {
    userId: 'required|string',
    addressFirst: 'required|string',
    area: 'required|string',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric',
};

export const deleteDeliveryAddressValidation = {
    id: 'required|string'
}

export const updateDeliveryAddressValidation = {
    _id: 'required|string'
}

export const getDeliveryAddressValidation = {
    userId: 'required|string'
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryAddressValidation = exports.updateDeliveryAddressValidation = exports.deleteDeliveryAddressValidation = exports.addDeliveryAddressValidation = void 0;
exports.addDeliveryAddressValidation = {
    userId: 'required|string',
    addressFirst: 'required|string',
    area: 'required|string',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric',
};
exports.deleteDeliveryAddressValidation = {
    id: 'required|string'
};
exports.updateDeliveryAddressValidation = {
    _id: 'required|string'
};
exports.getDeliveryAddressValidation = {
    userId: 'required|string'
};

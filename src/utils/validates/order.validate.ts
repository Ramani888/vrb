export const addTrackingDetailsValidation = {
    trackingId: 'required|string',
    orderId: 'required|string',
    packingId: 'required|string'
};

export const updateTrackingDetailsValidation = {
    _id: 'required|string'
};

export const sendPushNotificationValidation = {
    title: 'required|string',
    body: 'required|string',
    imageUrl: 'required|string'
}

export const getNotificationValidation = {
    userId: 'required|string'
};

export const getNotificationCountValidation = {
    userId: 'required|string'
};

export const updateNotificationStatusValidation = {
    status: 'required|boolean',
    notificationId: 'required|string'
}

export const insertDeviceTokenValidation = {
    token: 'required|string',
    userId: 'required|string'
};

export const addUnloadingDetailsValidation = {
    orderId: 'required|string'
};

export const addOrderValidation = {
    paymentId: 'string',
    userId: 'required|string',
    totalAmount: 'required|numeric',
    product: 'required|array'
}

export const addRazorpayOrderValidation = {
    amount: 'required|numeric'
}

export const checkRazorpayOrderValidation = {
    order_id: 'required|string'
}

export const getOrderByUserValidation = {
    userId: 'required|string'
}

export const updateOrderStatusValidation = {
    orderId: 'required|string',
    status: 'required|string'
}
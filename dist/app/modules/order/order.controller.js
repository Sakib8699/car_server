"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderControllers = void 0;
const order_service_1 = require("./order.service");
const car_model_1 = __importDefault(require("../car/car.model"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = req.body;
        const isCarExist = yield car_model_1.default.findById(order.car);
        if (!isCarExist) {
            return res.status(404).json({
                message: 'Something went wrong',
                status: false,
                error: {
                    message: 'Car is not founded!!!',
                },
            });
        }
        if (!isCarExist.inStock) {
            return res.status(404).json({
                message: 'Out of Stock',
                status: false,
                error: {
                    message: 'Car is out of stock!!!',
                },
            });
        }
        if (isCarExist.quantity < order.quantity) {
            return res.status(404).json({
                message: 'Something went wrong',
                status: false,
                error: {
                    message: `Insufficient Car! ${isCarExist.quantity} cars are available`,
                },
            });
        }
        const inStock = isCarExist.quantity - order.quantity > 0;
        const updatedResult = yield car_model_1.default.findByIdAndUpdate(order.car, {
            $set: {
                quantity: isCarExist.quantity - order.quantity,
                inStock,
            },
        }, {
            new: true,
            runValidators: true,
        });
        const result = yield order_service_1.orderServices.createOrderToDB(order);
        console.log(updatedResult);
        return res.status(200).json({
            message: 'Order created successfully',
            status: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: 'Something went wrong',
            status: false,
            error,
            stack: error === null || error === void 0 ? void 0 : error.stack,
        });
    }
});
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.orderServices.getAllOrdersFromDB();
        res.json({
            status: true,
            message: 'Order retrived successfully',
            data: result,
        });
    }
    catch (error) {
        res.json({
            status: true,
            message: 'Something went wrong',
            error,
        });
    }
});
const getUserOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield order_service_1.orderServices.getUserOrder(email);
    res.json({
        status: true,
        message: 'Order retrived successfully',
        data: result,
    });
}));
const updateOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const payload = req.body;
    const result = yield order_service_1.orderServices.updateOrder(orderId, payload);
    res.json({
        status: true,
        message: 'Order updated successfully',
        data: result,
    });
}));
const calculateRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.orderServices.calculateRevenueFromDB();
        res.json({
            message: 'Revenue calculated successfully',
            status: true,
            data: result[0],
        });
    }
    catch (error) {
        res.status(200).json({
            message: 'Something went wrong',
            status: true,
            error,
            stack: error === null || error === void 0 ? void 0 : error.stack,
        });
    }
});
const getClientSecret = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // const result = ;
    const result = yield order_service_1.orderServices.getClientSecret(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'client sceret retrived successfully',
        data: result,
    });
}));
exports.orderControllers = {
    createOrder,
    calculateRevenue,
    getAllOrder,
    updateOrder,
    getClientSecret,
    getUserOrder,
};

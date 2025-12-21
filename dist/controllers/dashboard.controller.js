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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const http_status_codes_1 = require("http-status-codes");
const dashboard_service_1 = require("../services/dashboard.service");
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, dashboard_service_1.getDashboardData)();
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getDashboard = getDashboard;

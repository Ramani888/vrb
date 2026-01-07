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
exports.deleteAdsPoster = exports.getAllAdsPoster = exports.updateAdsPoster = exports.addAdsPoster = void 0;
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const adsPoster_service_1 = require("../services/adsPoster.service");
const global_1 = require("../utils/helpers/global");
dotenv_1.default.config();
const addAdsPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
        return;
    }
    const posterUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;
    try {
        const data = {
            imagePath: posterUrl
        };
        yield (0, adsPoster_service_1.addAdsPosterData)(data);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: 'Ads Poster data inserted.' });
    }
    catch (error) {
        console.error('Error adding ads poster:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to insert ads poster data.' });
    }
});
exports.addAdsPoster = addAdsPoster;
const updateAdsPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const bodyData = req.body;
    const file = req.file;
    try {
        const adsPosterData = yield (0, adsPoster_service_1.getAdsPosterDataById)(bodyData === null || bodyData === void 0 ? void 0 : bodyData._id);
        if (!adsPosterData || adsPosterData.length === 0) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Ads poster data not found.' });
            return;
        }
        if (file) {
            const posterUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;
            // Delete Image (if exists)
            const imagePath = (_b = (_a = adsPosterData[0]) === null || _a === void 0 ? void 0 : _a.imagePath) !== null && _b !== void 0 ? _b : ''; // Ensure it's a string
            if (imagePath) {
                yield (0, global_1.deleteVpsUpload)(imagePath);
            }
            // Insert Data
            const dataObject = {
                imagePath: posterUrl,
                _id: bodyData._id
            };
            yield (0, adsPoster_service_1.updateAdsPosterData)(dataObject);
        }
        else {
            yield (0, adsPoster_service_1.updateAdsPosterData)(Object.assign(Object.assign({}, bodyData), { imagePath: (_d = (_c = adsPosterData[0]) === null || _c === void 0 ? void 0 : _c.imagePath) !== null && _d !== void 0 ? _d : '' }));
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Ads Poster data updated." });
    }
    catch (error) {
        console.error('Error updating ads poster:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update ads poster data.' });
    }
});
exports.updateAdsPoster = updateAdsPoster;
const getAllAdsPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, adsPoster_service_1.getAllAdsPosterData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getAllAdsPoster = getAllAdsPoster;
const deleteAdsPoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { adsPosterId } = req.query;
    try {
        const adsPosterData = yield (0, adsPoster_service_1.getAdsPosterDataById)(adsPosterId);
        if (!adsPosterData || adsPosterData.length === 0) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Ads Poster Data not found.' });
            return;
        }
        // Ensure imagePath is a valid string before deleting
        const imagePath = (_b = (_a = adsPosterData[0]) === null || _a === void 0 ? void 0 : _a.imagePath) !== null && _b !== void 0 ? _b : '';
        if (imagePath) {
            yield (0, global_1.deleteVpsUpload)(imagePath);
        }
        // Delete ad poster data
        yield (0, adsPoster_service_1.deleteAdsPosterData)(adsPosterId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Ads Poster data deleted." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.deleteAdsPoster = deleteAdsPoster;

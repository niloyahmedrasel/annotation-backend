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
exports.baseRepository = void 0;
class baseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    findOneAndUpdate(filters, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDocument = yield this.model.findOneAndUpdate(filters, data, { new: true }).exec();
            return updatedDocument;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id).exec();
        });
    }
    find(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find(filters).exec();
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({ userId });
        });
    }
    findOne(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filters).exec();
        });
    }
    updateByID(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        });
    }
    updateOne(filters, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne(filters, data, { new: true }).exec();
            return this.model.findOne(filters).exec();
        });
    }
    updateMany(filters, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany(filters, data, { new: true }).exec();
            return this.model.find(filters).exec();
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndDelete(id).exec();
        });
    }
    deleteMany(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteMany(filters).exec();
        });
    }
    deleteOne(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteOne(filters).exec();
        });
    }
    countDocuments(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(filters).exec();
        });
    }
}
exports.baseRepository = baseRepository;

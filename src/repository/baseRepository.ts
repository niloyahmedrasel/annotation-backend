import mongoose,{Document,Model} from "mongoose";
import { DeleteResult } from "mongodb";

export class baseRepository<T extends Document>{
    private model:Model<T>;

    constructor(model:Model<T>){
        this.model = model;
    }

    async create(data:Partial<T>):Promise<T>{
        
        return this.model.create(data)
    }

    async findOneAndUpdate(filters: {}, data: Partial<T>): Promise<T | null> {
      const updatedDocument = await this.model.findOneAndUpdate(filters, data, { new: true }).exec();
      return updatedDocument;
    }
  
    async findById(id:string):Promise<T | null>{
        return this.model.findById(id).exec()
    }
    async find(filters:{}):Promise<T[]>{
        return this.model.find(filters).exec()
    }
    async findByUserId(userId: string): Promise<T[]> {
        return this.find({ userId });
    }
    async findOne(filters:{}):Promise<T|null>{
        return this.model.findOne(filters).exec()
    }
    async updateByID(id:string,data:Partial<T>):Promise<T | null>{
        return this.model.findByIdAndUpdate(id,data,{new:true}).exec()
    }
    async updateOne(filters:{},data:Partial<T>):Promise<T | null>{
        await this.model.updateOne(filters,data,{new:true}).exec();
        return this.model.findOne(filters).exec();
    }
    async updateMany(filters: {}, data: Partial<T>): Promise<T[]> {
        await this.model.updateMany(filters, data, { new: true }).exec();
        return this.model.find(filters).exec();
    }
    async deleteById(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec()
    }

    async deleteMany(filters: {}): Promise<DeleteResult> {
        return this.model.deleteMany(filters).exec()
    }

    async deleteOne(filters: {}): Promise<DeleteResult> {
        return this.model.deleteOne(filters).exec();
      }
      
    async countDocuments(): Promise<number> {
        return this.model.countDocuments().exec();
    }

}

import { Publisher } from "../model/interface/publisher";
import { PublisherModel } from "../model/publisher";
import { baseRepository } from "./baseRepository";
export class PublisherRepository extends baseRepository<Publisher> {
    constructor() {
        super(PublisherModel);
    }
}
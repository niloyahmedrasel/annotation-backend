
import { Tag } from "../model/interface/tag";
import { TagModel } from "../model/tag";
import { baseRepository } from "./baseRepository";
export class TagRepository extends baseRepository<Tag> {
    constructor() {
        super(TagModel);
    }
}
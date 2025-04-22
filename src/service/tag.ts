import { Tag } from "../model/interface/tag";
import { TagRepository } from "../repository/tag";

const tagRepository = new TagRepository();

export class TagService {
    async create(title: string): Promise<Tag> {
        const tag = await tagRepository.create({ title });
        return tag;
    }

    async getAllTags(): Promise<Tag[]> {
        const tags = await tagRepository.find({});
        return tags;
    }

    async getTagById(tagId: string): Promise<Tag | null> {
        const tag = await tagRepository.findById(tagId);
        return tag;
    }

    async delete(tagId: string): Promise<Tag | null> {
        const tag = await tagRepository.deleteById(tagId);
        return tag;
    }

    async update(tagId: string, title: string): Promise<Tag | null> {
        const tag = await tagRepository.findOneAndUpdate({ _id: tagId }, { title });
        return tag;
    }
}
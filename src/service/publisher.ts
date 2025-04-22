import { PublisherRepository } from "../repository/publisher";
const publisherRepository = new PublisherRepository();
export class PublisherService {
    async create(title: string): Promise<any> {
        const publisher = await publisherRepository.create({ title });
        return publisher;
    }

    async update(publisherId: string, title: string): Promise<any> {
        const publisher = await publisherRepository.findOneAndUpdate({ _id: publisherId }, { title });
        return publisher;
    }

    async delete(publisherId: string): Promise<any> {
        const publisher = await publisherRepository.deleteById(publisherId);
        return publisher;
    }

    async getAllPublishers(): Promise<any> {
        const publishers = await publisherRepository.find({});
        return publishers;
    }

    async getPublisherById(publisherId: string): Promise<any> {
        const publisher = await publisherRepository.findOne({ _id: publisherId });
        return publisher;
    }
}
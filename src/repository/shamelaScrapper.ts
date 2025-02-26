import { ShamelaScrapper } from "../model/interface/shamelaScrapper";
import { ShamelaScrapperModel } from "../model/shamelaScrapper";
import { baseRepository } from "./baseRepository";

export class ShamelaScrapperRepository extends baseRepository<ShamelaScrapper> {
    constructor() {
        super(ShamelaScrapperModel);
    }
}
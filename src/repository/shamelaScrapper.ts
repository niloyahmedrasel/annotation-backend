import { Scraper } from "../model/interface/shamelaScrapper";
import { baseRepository } from "./baseRepository";
import {ScraperModel} from "../model/shamelaScrapper";

export class ShamelaScrapperRepository extends baseRepository<Scraper> {
    constructor() {
        super(ScraperModel);
    }
}
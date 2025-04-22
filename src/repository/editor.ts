
import { EditorModel } from "../model/editor";
import { Editor } from "../model/interface/editor";
import { baseRepository } from "./baseRepository";
export class EditorRepository extends baseRepository<Editor> {
    constructor() {
        super(EditorModel);
    }
}
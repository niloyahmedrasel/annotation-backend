
import { Editor } from "../model/interface/editor";
import { EditorRepository } from "../repository/editor";
import { AppError } from "../utils/appError";

const editorRepository = new EditorRepository();
export class EditorService {
    async create(title: string): Promise<Editor> {
        const editor = await editorRepository.create({ title });
        return editor;
    }

    async getAllEditors(): Promise<Editor[]> {
        const editors = await editorRepository.find({});
        return editors;
    }

    async getEditorById(editorId: string): Promise<Editor | null> {
        const editor = await editorRepository.findOne({ _id: editorId });
        return editor;
    }

    async update(editorId: string, title: string): Promise<Editor> {
        const editor = await editorRepository.findOneAndUpdate({ _id: editorId }, { title });
        if (!editor) throw new AppError("Editor not found",404);
        return editor;
    }

    async delete(editorId: string): Promise<Editor> {
        const editor = await editorRepository.deleteById(editorId);
        if (!editor) throw new AppError("Editor not found",404);
        return editor;
    }
}
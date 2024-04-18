import { IsNotEmpty } from "class-validator";

export class CategoryDTO {
    @IsNotEmpty()
    name : string;

    constructor(data: any) {
        this.name = data.name;
    }
}
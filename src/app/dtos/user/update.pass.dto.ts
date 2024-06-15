import { Injectable } from "@angular/core";
import { IsNotEmpty } from "class-validator";

export class UpdatePassDTO {

    @IsNotEmpty()
    old_pass : string;

    @IsNotEmpty()
    new_pass : string;

    @IsNotEmpty()
    confirm_pass : string;

    constructor(data : any) {
        this.old_pass = data.old_pass;
        this.new_pass = data.new_pass;
        this.confirm_pass = data.confirm_pass;
    }
    
}
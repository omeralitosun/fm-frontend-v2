import type { Field } from "../field/Field";

export class GetAllFieldDTO{
    fields!: Field[];
    totalElements!: number;
}
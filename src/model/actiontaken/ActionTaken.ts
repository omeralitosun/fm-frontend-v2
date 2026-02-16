import type { Field } from "../field/Field";
import type { Season } from "../season/Season";

export class ActionTaken {
    id!: string;
    field!: Field;
    season!: Season;
    process!: string;
    cost!: number;
    comment!: string;
    date!: Date;
}
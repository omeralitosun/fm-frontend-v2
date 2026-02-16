import type { GetAllFieldDTO } from '@/model/dto/GetAllFieldDTO';
import { CreateField } from '@/model/field/CreateField';
import type { Field } from '@/model/field/Field';
import type { AxiosResponse } from 'axios';

export interface IFieldService {
    addField(Field: CreateField): Promise<AxiosResponse<any, any>>;
    getField(id: string): Promise<Field>;
    getAllField(page: number, rows: number): Promise<GetAllFieldDTO>;
    deleteField(id: string): Promise<void>;
    updateField(id: string, Field: CreateField): Promise<AxiosResponse<any, any>>;
}
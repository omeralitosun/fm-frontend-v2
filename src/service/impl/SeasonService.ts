import { Season } from "@/model/season/Season";
import type { ISeasonService } from "../ISeasonService";
import api from "../api";
import { Service } from "typedi";
import { CreateSeason } from "@/model/season/CreateSeason";
import { GetAllSeasonDto } from "@/model/dto/GetAllSeasonDto";

@Service()
export class SeasonService implements ISeasonService {
    private readonly apiSeasonURL = "/api/v1/season";

    async createSeasonFromCurrentYearToNextYear(): Promise<Season> {
        const createSeason = new CreateSeason();
        createSeason.startYear = new Date().getFullYear();
        createSeason.endYear = createSeason.startYear + 1;

        const response = await api.post(this.apiSeasonURL, createSeason);
        return this.mapToSeason(response.data);
    }

    async getAllSeasons(page: number, rows: number): Promise<GetAllSeasonDto> {
        const response = await api.get(this.apiSeasonURL, {
            params: { page, rows }
        });
        return this.mapToGetAllSeasonDto(response.data);
    }

    private mapToGetAllSeasonDto(data: any): GetAllSeasonDto {
        const dto = new GetAllSeasonDto();
        dto.totalElements = data.totalElements;
        dto.seasons = data.seasons.map((item: any) => this.mapToSeason(item));
        return dto;
    }

    private mapToSeason(item: any): Season {
        const season = new Season();
        season.id = item.id;
        season.name = `${item.startYear} - ${item.endYear}`;
        season.startYear = item.startYear;
        season.endYear = item.endYear;
        return season;
    }
}
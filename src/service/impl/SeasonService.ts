import { Season } from "@/model/season/Season";
import type { ISeasonService } from "../ISeasonService";
import axios from "axios";
import { Service } from "typedi";
import { CreateSeason } from "@/model/season/CreateSeason";
import { GetAllSeasonDto } from "@/model/dto/GetAllSeasonDto";

@Service()
export class SeasonService implements ISeasonService {

    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiFieldURL = this.apiUrl + "/api/v1/season"

    async createSeasonFromCurrentYearToNextYear(): Promise<Season> {
        let pathVariable = this.apiFieldURL;
        const createSeason = new CreateSeason();

        createSeason.startYear = new Date().getFullYear();
        createSeason.endYear = createSeason.startYear + 1;

        const response = await axios.post(pathVariable, createSeason);

        const season = new Season();

        season.id = response.data.id;
        season.name = response.data.startYear + " - " + response.data.endYear;
        season.startYear = response.data.startYear;
        season.endYear = response.data.endYear;

        return season;
    }

    async getAllSeasons(page: number, rows: number): Promise<GetAllSeasonDto> {
        let pathVariable = this.apiFieldURL;
        const response = await axios.get(pathVariable + "?page=" + page + "&rows=" + rows);


        const getAllSeasonDto = new GetAllSeasonDto();
        getAllSeasonDto.seasons = response.data.seasons.map((item: any) => {
            const season = new Season();

            season.id = item.id;
            season.name = item.startYear + " - " + item.endYear;
            season.startYear = item.startYear;
            season.endYear = item.endYear;

            return season;
        });

        getAllSeasonDto.totalElements = response.data.totalElements;
        return getAllSeasonDto;
    }

}
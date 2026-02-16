export class Process {
    private constructor(
        public readonly key: string,
        public readonly label: string
    ) { }

    static readonly SOIL_PREPARATION = new Process("SOIL_PREPARATION", "Toprak İşleme");
    static readonly PLANTING = new Process("PLANTING", "Ekim Yapma");
    static readonly SPRAYING = new Process("SPRAYING", "İlaçlama");
    static readonly WATERING = new Process("WATERING", "Sulama");
    static readonly REAP = new Process("REAP", "Biçim");
    static readonly OTHER = new Process("OTHER", "Diğer");

    static values(): Process[] {
        return [Process.SOIL_PREPARATION, Process.PLANTING, Process.SPRAYING, Process.WATERING, Process.REAP, Process.OTHER];
    }

    static getProcessByKey(key: string): Process | undefined {
        return this.values().find(item => item.key === key);
    }
}
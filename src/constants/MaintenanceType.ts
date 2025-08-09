export class MaintenanceType {
  private constructor(
    public readonly key: string,
    public readonly label: string
  ) { }

  static readonly MAINTENANCE = new MaintenanceType("MAINTENANCE", "Bakım");
  static readonly PARTS_REPLACEMENT = new MaintenanceType("PARTS_REPLACEMENT", "Parça Değişimi");
  static readonly OTHER = new MaintenanceType("OTHER", "Diğer");

  static values(): MaintenanceType[] {
    return [MaintenanceType.MAINTENANCE, MaintenanceType.PARTS_REPLACEMENT, MaintenanceType.OTHER];
  }

  static getMaintenanceTypeByKey(key: string): MaintenanceType | undefined {
    return this.values().find(item => item.key === key);
  }
}
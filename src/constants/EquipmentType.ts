export class EquipmentType {
  private constructor(
    public readonly key: string,
    public readonly label: string
  ) { }

  static readonly CAR = new EquipmentType("CAR", "Araba");
  static readonly TRACTOR = new EquipmentType("TRACTOR", "Traktör");

  static values(): EquipmentType[] {
    return [EquipmentType.CAR, EquipmentType.TRACTOR];
  }

  static getEquipmentTypeByKey(key: string): EquipmentType | undefined {
  return this.values().find(item => item.key === key);
}
}
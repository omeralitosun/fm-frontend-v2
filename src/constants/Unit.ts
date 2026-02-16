export class Unit {
  private constructor(
    public readonly key: string,
    public readonly label: string
  ) { }

  static readonly NUMBER = new Unit("NUMBER", "Adet");
  static readonly KILOGRAM = new Unit("KILOGRAM", "Kilogram");
  static readonly LITER = new Unit("LITER", "Litre");

  static values(): Unit[] {
    return [Unit.NUMBER, Unit.KILOGRAM, Unit.LITER];
  }

  static getUnitByKey(key: string): Unit | undefined {
    return this.values().find(item => item.key === key);
  }
}

export class LocalStorage<T extends { [key: string]: any; }> {

  constructor(
    private name: string,
    private initialValue: T
  ) {
    if (localStorage.getItem(this.name) === null)
      this.reset();
  }

  public getItem<Key extends string & keyof T>(item: Key): T[Key] {
    const storage = JSON.parse(localStorage.getItem(this.name) || '{}');

    if (typeof storage[item] !== typeof this.initialValue[item]) {
      const fallbackValue = this.initialValue[item];
      console.warn(`Type of ${this.name}.${item} is not as expected, `
        + `falling back to initial value (${fallbackValue}).`);

      localStorage.setItem(this.name, JSON.stringify({
        ...storage, [item]: fallbackValue
      }));
      return fallbackValue;
    }

    return storage[item];
  }

  public setItem<Key extends keyof T>(item: Key, value: T[Key]) {
    localStorage.setItem(this.name, JSON.stringify({
      ...JSON.parse(localStorage.getItem(this.name) || '{}'),
      [item]: value
    }));
  }

  public reset() {
    localStorage.setItem(this.name, JSON.stringify(this.initialValue));
  }

}

export function ClassName<T extends { new(...args: any[]): {}}>(target: T) {
  return class extends target {
    constructor(...args) {
      super(...args);
    }

    public __className: string = target.name;
  };
}

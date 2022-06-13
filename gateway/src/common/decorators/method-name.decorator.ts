export function MethodName<A extends any[], R>(
  target: Object,
  methodName: string,
  descriptor: TypedPropertyDescriptor<(...args: A) => Promise<R>>,
) {
  const method = descriptor.value;

  descriptor.value = async function(...args: A): Promise<R> {
    console.log(methodName);
    return await method.apply(target, args);
  };
}

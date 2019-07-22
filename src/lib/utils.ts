// tslint:disable-next-line
export const __decorate = function(decorators, target, key, desc) {
  if (
    typeof Reflect === 'object' &&
    typeof (Reflect as any).decorate === 'function'
  ) {
    return (Reflect as any).decorate(decorators, target, key, desc);
  }
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight((o, d) => {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight((o, d) => {
        return d && d(target, key), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight((o, d) => {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};

export const nameof = <T>(name: keyof T) => name;

export const assert = (exp: boolean, msg: string) => {
  if (!exp) {
    alert(msg);
  }
};

const UNIQUE_STORE_SEPARATOR = '-';
export const createUniqueActionName = (storeName, actionName): string => {
  return `${storeName}${UNIQUE_STORE_SEPARATOR}${actionName}`;
};

export const getStoreNameFromUniqueActionName = (uniqueActionName): string => {
  const [storeName] = uniqueActionName.split(UNIQUE_STORE_SEPARATOR);
  return storeName;
};

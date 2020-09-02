export interface Extended<T> {
    withPlugin(plugin: (entity: T) => T): T & Extended<T>;
}

export const extend = <T>(entity: T): T & Extended<T> => {
    return { ...entity, withPlugin: (plugin) => extend(plugin(entity)) };
};

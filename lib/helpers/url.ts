export const serializeToQuery = (
    obj: Record<string, any>,
    prefix: string = ''
): string => {
    const str = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + '[' + p + ']' : p,
                v = obj[p];
            str.push(
                v !== null && typeof v === 'object'
                    ? serializeToQuery(v, k)
                    : encodeURIComponent(k) + '=' + encodeURIComponent(v)
            );
        }
    }
    return str.join('&');
};
export const getUrlWithParam = (
    baseUrl: string,
    params: Record<string, any>
): string => {
    const Url = new URL(baseUrl);
    Url.search = serializeToQuery(params);
    return Url.toString();
};
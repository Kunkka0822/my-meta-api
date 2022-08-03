import axios from "axios";
import { getUrlWithParam } from "../lib/helpers/url";
import { env } from "../lib/helpers/env";
import { ControllerError } from "../lib/exceptions/controller_exception";

const getAddress = async (longlat: string) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longlat}.json`;
    const accessToken = env('MAPBOX_TOKEN')
    const types = 'place,address';

    try {
        const absUrl = getUrlWithParam(url, {
            types,
            limit: 1,
            access_token: accessToken
        })
    
        const response = await axios.get(absUrl);
        const { data } = response;
        console.log(longlat, data)
        const feature = data.features[0];
        const  { context } = feature;

        const countryCode = context.find((item: any) => item.id.includes('country.')).short_code;
        const regionCode = context.find((item: any) => item.id.includes('region.')).short_code;
        const locality = context.find((item: any) => item.id.includes('locality.'))?.text;
        const place = context.find((item: any) => item.id.includes('place.'))?.text;

        return {
            countryCode,
            regionCode,
            place: locality || place
        }
        
    } catch (e) {
        console.log(e);
        throw new ControllerError('Mapbox error')
    }
}

const MapboxGeoService = {
    getAddress
}
export default MapboxGeoService;
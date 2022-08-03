import { expect } from "chai";
import { describe } from "mocha";
import { faker } from '@faker-js/faker';
import MapboxGeoService from "../services/mapbox.geo.service";

describe('begin', function() {
    describe('Mapbox Service' , function() {
        it('get address', async () => {
            const longlat = '-74.01268120200862,40.70072301956384';
            const { regionCode, place } = await MapboxGeoService.getAddress(longlat);
            expect(regionCode).to.be.not.empty;
            expect(place).to.be.not.empty;
        })
    })
})
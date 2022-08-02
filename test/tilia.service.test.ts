import { expect } from "chai";
import { describe } from "mocha";
import { TiliaService } from "../services/tilia.service";
import { faker } from '@faker-js/faker';

describe('begin', function() {
    describe('Tilia Service' , function() {
        it('auth token', async () => {
            const token = await TiliaService.getAccessToken('write_registrations');
            expect(token).to.be.not.empty;
        })
        it('user register', async () => {
            const email = faker.internet.email();
            const name = faker.random.alpha(10);
            const accountId = await TiliaService.registerUser({ email,  name});
            expect(accountId).to.be.not.empty;
        })
        
    })
})
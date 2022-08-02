import { User } from "@prisma/client";
import axios from "axios";
import { env } from "../lib/helpers/env";
import { faker } from '@faker-js/faker';
import { ControllerError } from "../lib/exceptions/controller_exception";


const getApiUrl = (pref: string) => {
    const environment = env('NODE_ENV') === 'production' ? '' : 'staging';
    return 'https://' + pref + '.' + environment + '.tilia-inc.com';
}

const getAccessToken = async (scope: string) => {
    try {
        const defaultScope = 'write_registration';
        const result = await axios.post(getApiUrl('auth') + '/token?client_id=' + env('TILIA_CLIENT_ID') +
            '&client_secret=' + env('TILIA_CLIENT_SECRET') +
            '&grant_type=client_credentials' + 
            '&scope=' + (scope || defaultScope)
        )
        return result.data.access_token;
    } catch(e) {
        console.log(e);
        throw new ControllerError('Tilia auth failed');
    }
}
const registerUser = async ({ name, email }: { name: string, email: string}) => {
    const token = await getAccessToken('write_registrations');
    const username = 'mymeta_' + name + '_' + faker.random.alphaNumeric(10);
    try {
        const result = await axios.post(getApiUrl('accounts') + '/register', {
            username,
            email: {
                address: email
            }
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        return result.data.payload.account_id;
    } catch (e) {
        console.error(e);
        throw new ControllerError('Register failed')
    }
}
const getUserWallets = async (user: User) => {
    try {
        const token = await getAccessToken('read_payment_methods');
        const result = await axios.get(getApiUrl('payments') + `/v1/${user.tiliaId}/payment_methods`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return result.data.payload;
    } catch(e) {
        console.log(e);
        throw new ControllerError('Get wallets failed');
    }
}
const authorizeUser = async (user: User) => {
    try {
        const token = await getAccessToken('write_user_tokens,write_invoices');
        const result = await axios.post(getApiUrl('auth') + `/authorize/user`, {
            account_id: user.tiliaId
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        const { data } = result;
        if (data.status !== 'Success') {
            throw new Error
        }
        return data.payload.redirect;
    } catch(e) {
        console.log(e);
        throw new ControllerError('Tilia user authorization failed');
    }
}
const tosCheck = async (user: User) => {
    try {
        const token = await getAccessToken('read_accounts');
        const result = await axios.get(getApiUrl('accounts') + `/v1/user-info/${user.tiliaId}/tos/tilia`, {
            headers: {
                Authoization: 'Bearer ' + token
            }
        });
        const { data } = result;
        return data.signed_tos;
    } catch (e) {
        console.log(e);
        throw new ControllerError('Tos check failed failed');
    }
}


export const TiliaService = {
    getApiUrl,
    getAccessToken,
    registerUser,
    getUserWallets,
    authorizeUser,
    tosCheck
}
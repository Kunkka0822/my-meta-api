import { DataTypes, Model } from "sequelize/types";
import { mysql } from '.';

class Parcel extends Model {
    public id: string;
    public image: string;
    public address: string;
    public square: number;
    public price: number;
    public ownerAddress: string;
    public contractAddress: string;
    public tokenId: string;
    public onSale: boolean;
}

Parcel.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    image: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING
    },
    square: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    ownerAddress: {
        type: DataTypes.STRING
    },
    contractAddress: {
        type: DataTypes.STRING
    },
    tokenId: {
        type: DataTypes.STRING
    },
    onSale: {
        type: DataTypes.STRING
    }
}, {
    sequelize: mysql,
    tableName: 'parcels'
})
export default Parcel;
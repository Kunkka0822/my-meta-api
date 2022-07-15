import { DataTypes, Model } from "sequelize";
import { mysql } from '.';

class Parcel extends Model {
    public id: string;
    public handleId: string;
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
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    handleId: {
        type: DataTypes.STRING,
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
    tableName: 'Parcel'
})
export default Parcel;
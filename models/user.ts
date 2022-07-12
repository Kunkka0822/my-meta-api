import { DataTypes, Model } from "sequelize";
import { mysql } from '.';

class User extends Model {
    public id ? : number;
    public wallet ? : string;
    public email ? : string;
    public password ? : string;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
     },
     wallet: {
        type: DataTypes.STRING
     },
     name: {
        type: DataTypes.STRING
     },
     password: {
        type: DataTypes.STRING
     }
}, {
    sequelize: mysql,
    tableName: 'User'
})
export default User;
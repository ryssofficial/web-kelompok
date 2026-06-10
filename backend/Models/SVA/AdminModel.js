import BaseModel from "../BaseModel.js";

class AdminModel extends BaseModel{
    constructor(){
        super(
            'admin.identity', 
            'id_admin', 
            ['nama_admin', 'email_admin', 'password_admin']
        )
    }
}

export default new AdminModel();
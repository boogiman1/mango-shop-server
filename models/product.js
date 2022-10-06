module.exports=(sequelize, DataTypes)=>{
    //sequelize 정의
    const product=sequelize.define("Product",{
        name:{
            type:DataTypes.STRING(20), //20글자 까지
            allowNull:false, // 빈 값은 허용 하지 않는다. 즉 필수 입력 속성
        },
        price:{
            type:DataTypes.INTEGER(20), // 정수형
            allowNull:false,
        },
        seller:{
            type:DataTypes.STRING(30),
            allowNull:false,
        },
        description:{
            type:DataTypes.STRING(300),
            allowNull:false,
        },
        imageUrl:{
            type:DataTypes.STRING(300),
            allowNull:true,
        },
    });
    return product;
}
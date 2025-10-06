const auth = require('../authorization/authentication');
module.exports = (sequelize, DataType) => {
  let model = sequelize.define('User', {
    first_name: {
      type: DataType.STRING(150)
    },
    last_name: {
      type: DataType.STRING(150)
    },
    email: {
      type: DataType.STRING(255),
      unique: true
    },
    description: {
      type: DataType.TEXT
    },
    phone: {
      type: DataType.STRING(12)
    },
    role: {
      type: DataType.STRING(50)
    },
    active: {
      type: DataType.BOOLEAN
    },
    password: {
      type: DataType.STRING
    },
    salt: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: auth.createSalt
    },
    last_login: {
      type: DataType.DATE,
      defaultValue: sequelize.NOW
    },
    uuid: {
      type: DataType.STRING(255),
    },
    gdpr: {
      type: DataType.BOOLEAN,
    },
    validated_email: {
      type: DataType.BOOLEAN
    },
    stripe_customer_id: {
      type: DataType.STRING
    }
  }, {
    timestamps: true,
    indexes: []
  });
  model.addHook('beforeCreate', function beforeCreate(user) {
    user.password = auth.hashPwd(user.salt, user.password);
    return user;
  });
  return model;
};

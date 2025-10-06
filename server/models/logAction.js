module.exports = (sequelize, DataType) => {
  let model = sequelize.define('LogAction', {
    action: {
      type: DataType.STRING
    },
    date: {
      type: DataType.DATEONLY
    },
    details: {
      type: DataType.TEXT
    },
    is_report: {
      type: DataType.BOOLEAN
    },
    ip_address: {
      type: DataType.STRING
    },
    user_agent: {
      type: DataType.STRING
    }
  }, {
    timestamps: true,
    indexes: [
      {fields: ['id_user']}
    ]
  });
  model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'set null'});
  return model;
};

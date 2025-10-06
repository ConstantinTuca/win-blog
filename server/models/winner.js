module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Winner', {
    full_name: {
      type: DataType.STRING
    },
		confesion: {
      type: DataType.TEXT
    },
    date: {
      type: DataType.DATEONLY
    },
    prize: {
      type: DataType.INTEGER
    },
    paid: {
      type: DataType.BOOLEAN
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
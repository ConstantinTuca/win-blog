module.exports = (sequelize, DataType) => {
	let model = sequelize.define('EmailQueue', {
		email: {
      type: DataType.STRING
    },
		subject: {
      type: DataType.STRING
    },
    content: {
      type: DataType.TEXT
    },
    date: {
      type: DataType.DATEONLY
    },
		status: {
			type: DataType.INTEGER
			//1 - in progress
		},
		retry_counter: {
			type: DataType.INTEGER
		}
	}, {
		timestamps: true,
		indexes: [
			{fields: ['id_user_sender']},
			{fields: ['status']}
		]
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user_sender', onDelete: 'set null'});
	return model;
};

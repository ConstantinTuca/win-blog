module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Post', {
		title: {
      type: DataType.STRING
    },
		content: {
      type: DataType.TEXT
    },
    category: {
      type: DataType.STRING
    },
    tags: {
      type: DataType.STRING
    },
    publish_date: {
      type: DataType.DATEONLY
    },
    time_to_read: {
      type: DataType.INTEGER
    },
    active: {
      type: DataType.BOOLEAN
    }
	}, {
		timestamps: true,
		indexes: [
			{fields: ['id_file']},
			{fields: ['id_user']},
		]
	});
	model.belongsTo(sequelize.models.File, {foreignKey: 'id_file', onDelete: 'set null'});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'set null'});
	return model;
};
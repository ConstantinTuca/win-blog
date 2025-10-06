module.exports = (sequelize, DataType) => {
	let model = sequelize.define('File', {
		name: {
			type: DataType.STRING
		},
		file_name: {
			type: DataType.STRING
		},
		date: {
			type: DataType.DATEONLY
		},
		details: {
			type: DataType.TEXT
		},
		extension: {
			type: DataType.STRING(10)
		},
		file_blob: {
			type: DataType.BLOB
		},
		profile_image: {
			type: DataType.BOOLEAN
		},
		blog_post: {
			type: DataType.BOOLEAN
		}
	}, {
		timestamps: true,
		indexes: [
			{fields: ['id_user']},
			{fields: ['profile_image']},
			{fields: ['blog_post']}
		]
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'cascade'});
	return model;
};

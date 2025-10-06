module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Subscription', {
		plan: {
      type: DataType.STRING(50)
    },
		status: {
      type: DataType.STRING(20)
    },
    stripe_customer_id: {
      type: DataType.STRING
    },
    stripe_subscription_id: {
      type: DataType.STRING
    },
    current_period_end: {
      type: DataType.DATEONLY
    },
    last_payment: {
      type: DataType.DATEONLY
    }
	}, {
		timestamps: true,
		indexes: [
			{fields: ['id_user']},
		]
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'set null'});
	return model;
};
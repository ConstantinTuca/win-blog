module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Invoice', {
		stripe_invoice_id: {
      type: DataType.STRING
    },
    amount: {
      type: DataType.INTEGER
    },
    currency: {
      type: DataType.STRING(10)
    },
		status: {
      type: DataType.STRING(20)
    },
    hosted_invoice_url: {
      type: DataType.STRING
    },
    invoice_pdf: {
      type: DataType.STRING
    },
    date: {
      type: DataType.DATEONLY
    }
	}, {
		timestamps: true,
		indexes: [
			{fields: ['id_subscription']}
		]
	});
	model.belongsTo(sequelize.models.Subscription, {foreignKey: 'id_subscription', onDelete: 'set null'});
	return model;
};
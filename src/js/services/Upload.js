class Upload {
	async save(data) {
		try {
			const data_1 = await fetch(
				`https://ap-southeast-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/test-gqltz/service/cantsayit/incoming_webhook/webhook0?secret=cantsayit`,
				{
					method: 'POST',
					body: JSON.stringify(data),
				}
			);
			return data_1;
		} catch (err) {
			console.log(err);
		}
	}
}

export default new Upload();

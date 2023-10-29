const axios = require('axios');

const { WALLET_API_URL } = process.env

const getBalance = async (userId) => {
	console.log(process.env)
	const { data } = await axios.get(`${WALLET_API_URL}/carteiras/${userId}/saldo`)
	return data
}

const SetBalance = async (userId, requestData) => {
	const {prizeAmount} = requestData
	const {transactionType} = requestData

	const request = {
		valorTransacao: prizeAmount,
		naturezaTransacao: transactionType,
	}

	const { data } = await axios.post(`${WALLET_API_URL}/carteiras/${userId}/transacao`, request, {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	return data
} 

const walletRepository = {
    getBalance,
	SetBalance,
}

module.exports = walletRepository
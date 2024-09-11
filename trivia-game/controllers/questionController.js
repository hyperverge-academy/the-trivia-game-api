const axios = require('axios');

const fetchQuestions = async (category, difficulty) => {
    try {
        const response = await axios.get(`https://the-trivia-api.com/api/questions`, {
            params: {
                categories: category,
                limit: 2,
                difficulty: difficulty,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

};

module.exports = { fetchQuestions };
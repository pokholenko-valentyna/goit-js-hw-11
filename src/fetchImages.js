import axios from "axios";

export class PixabayAPI {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '35199728-3cdab553b07aca2adc97ae479';
    
    query = null;
    page = 1;
    count = 40;
    
    async fetchImages() {
        try {
            const response = await axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.query}&image_type=photo&safesearch=true&orientation=horizontal&page=${this.page}&per_page=${this.count}`);
            return response; 
        } catch (err) {
            throw new Error(err.message);
        }       
    }
}



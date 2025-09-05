import React from 'react';
import Preloader from '../components/Preloader';
import MovieList from '../components/MovieList';
import './Main.css';

class Main extends React.Component {
    state = {
        movies: [],
        searchTerm: '',
        isLoading: false,
        error: null
    }
    componentDidMount() {
        this.fetchMovies(this.state.searchTerm);
    }

    //Функция для получения фильмов
    fetchMovies = (searchTerm) => {
        this.setState({ isLoading: true, error: null });

        fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=dbe5de73&s=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.json();
            })
            .then(data => {
                if (data.Response === 'True') {
                    this.setState({
                        movies: data.Search || [],
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        movies: [],
                        isLoading: false,
                        error: data.Error || 'Фильмы не найдены'
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    error: 'Произошла ошибка при загрузке данных'
                });
            });
    }

    // Обработчик изменения поля поиска
    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    //Обработчик отправки формы поиска
    handleSearchSubmit = (event) => {
        event.preventDefault();
        if (this.state.searchTerm.trim()) {
            this.fetchMovies(this.state.searchTerm.trim());
        }
    }

    render() {
        const { movies, searchTerm, isLoading, error } = this.state;

        return (
            <div className='main'>
                <div className='wrap'>
                    <form onSubmit={this.handleSearchSubmit} className='search-form'>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                            placeholder='Введите название фильма...'
                            className='search-input'
                        />
                        <button type='submit' className='search-button'>
                            Поиск
                        </button>
                    </form>

                    {isLoading && <Preloader />}

                    {error && !isLoading && (
                        <div className='error-message'>
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && movies.length > 0 && (
                        <MovieList movies={movies} />
                    )}

                     {!isLoading && !error && movies.length === 0 && (
                        <div className="no-results">
                            Введите запрос.
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Main;
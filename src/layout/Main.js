import React from 'react';
import Preloader from '../components/Preloader';
import MovieList from '../components/MovieList';
import './Main.css';

class Main extends React.Component {
    state = {
        movies: [],
        searchTerm: '',
        isLoading: false,
        error: null,
        itemsPerPage: 6,
        currentPage: 1
    }
    componentDidMount() {
        this.fetchMovies(this.state.searchTerm);
    }

    //Функция для получения фильмов
    fetchMovies = (searchTerm) => {
        this.setState({ isLoading: true, error: null });

        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=dbe5de73&s=${encodeURIComponent(searchTerm)}`)
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
                        isLoading: false,
                        currentPage: 1
                    });
                }
                else {
                    this.setState({
                        movies: [],
                        isLoading: false,
                        error: data.Error || 'Фильмы не найдены',
                        currentPage: 1
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

    //Обработчик изменения количества фильмов на странице
    handleItemsPerPageChange = (event) => {
        this.setState({
            itemsPerPage: parseInt(event.target.value),
            currentPage: 1
        });
    }

    //Обработчик изменения страницы
    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    //Функция для получения текущих фильмов (с учетом пагинации)
    getCurrentMovies = () => {
        const { movies, currentPage, itemsPerPage } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return movies.slice(startIndex, endIndex);
    }

    //Функция для расчета общего количества страниц
    getTotalPages = () => {
        const { movies, itemsPerPage } = this.state;
        return Math.ceil(movies.length / itemsPerPage);
    }

    //Функция для отрисовки пагинации
    renderPagination = () => {
        const totalPages = this.getTotalPages();
        const { currentPage } = this.state;

        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePage = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePage / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePage - 1);
        if (endPage - startPage + 1 < maxVisiblePage) {
            startPage = Math.max(1, endPage - maxVisiblePage + 1);
        }

        //Конпка "Назад"
        if (currentPage > 1) {
            pages.push(
                <button
                    key="prev"
                    onClick={() => this.handlePageChange(currentPage - 1)}
                    className='pagination-btn'
                >
                    ←
                </button>
            );
        }

        // Первая страница
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => this.handlePageChange(1)}
                    className='pagination-btn'
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="elepsis1" className='pagination-ellipsis'>...</span>);
            }
        }

        //Основные страницы
        for(let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => this.handlePageChange(i)}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        //Последняя страница
        if(endPage < totalPages){
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className='pagination-ellipsis'>...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={()=>this.handlePageChange(totalPages)}
                    className='pagination-btn'
                >
                    {totalPages}
                </button>
            );
        }

        //Конпка "Вперед"
        if(currentPage < totalPages) {
            pages.push(
                <button
                    key="next"
                    onClick={() => this.handlePageChange(currentPage + 1)}
                    className='pagination-btn'
                >
                    →
                </button>
            );
        }
        
        return <div className='pagination'>{pages}</div>;
    }

    render() {
        const { movies, searchTerm, isLoading, error, itemsPerPage, currentPage } = this.state;
        const currentMovies = this.getCurrentMovies();
        const totalPages = this.getTotalPages();
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

                    {/* Радио кнопки*/}
                    {movies.length > 0 && !isLoading && !error && (
                        <div className='items-per-page'>
                            <label>Фильмов на странице:</label>
                            <label >
                                <input 
                                type="radio"
                                value="3"
                                checked={itemsPerPage === 3}
                                onChange={this.handleItemsPerPageChange} 
                                />
                                3
                            </label>
                            <label >
                                <input 
                                type="radio"
                                value="6"
                                checked={itemsPerPage === 6}
                                onChange={this.handleItemsPerPageChange}  
                                />
                                6
                            </label>
                            <label>
                                <input 
                                type="radio" 
                                value="9"
                                checked={itemsPerPage === 9}
                                onChange={this.handleItemsPerPageChange}
                                />
                                9
                            </label>
                        </div>
                    )}

                    {isLoading && <Preloader />}

                    {error && !isLoading && (
                        <div className='error-message'>
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && currentMovies.length > 0 && (
                        <>
                            <MovieList movies={currentMovies} />
                            <div className='pagination-info'>
                                Страница {currentPage} из {totalPages}
                            </div>
                            {this.renderPagination()}
                        </>
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